require('dotenv').config();

const users = require('./users');
const contacts = require('./contacts');

const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

function seedCollection(collectionName, initialData) {
  MongoClient.connect(process.env.DB_CONN, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error(">>>> DB CONNECTION ERROR >>>> \n", err);
      process.exit();
    };

    console.log(`connected to mongodb \"${client.db().databaseName}\" ...`);

    const collection = client.db().collection(collectionName);

    collection.deleteMany({});

    initialData.forEach((item) => {
      if (item.password) {
        item.password = bcrypt.hashSync(item.password, 10);
      }
    });

    collection.insertMany(initialData, (err, result) => {
      console.log(`${result.insertedCount} records inserted, in collection \"${collectionName}\"`);
      console.log('closing connection...');
      client.close();
      console.log('done.');
    });

  });
}

seedCollection('users', users);
seedCollection('contacts', contacts);
