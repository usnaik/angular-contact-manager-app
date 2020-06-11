require('dotenv').config();

const users = require('./users');
const contacts = require('./contacts');

const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

function seedCollection(collectionName, initialRecords) {
  MongoClient.connect(process.env.DB_CONN, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.log(">>>> DB connection error !!! ");
      console.error(err);
      return;
    }

    console.log('connected to mongodb...');

    const db = client.db();  // const db = client.db("contact_manager_app");
    const collection = db.collection(collectionName);

    collection.deleteMany({});

    initialRecords.forEach((item) => {
      if (item.password) {
        item.password = bcrypt.hashSync(item.password, 10);
      }
    });

    collection.insertMany(initialRecords, (err, result) => {
      console.log(`${result.insertedCount} records inserted.`);
      console.log('closing connection...');
      client.close();
      console.log('done.');
    });

  });
}

seedCollection('users', users);
seedCollection('contacts', contacts);
