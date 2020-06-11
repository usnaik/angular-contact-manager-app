const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

let database;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/profiles', express.static(path.join(__dirname, 'profiles')));
app.use(bodyParser.json());

app.get('/api/contacts', (req, res) => {
  const contactsCollection = database.collection('contacts');
  contactsCollection.find({}).toArray((err, docs) => {
    if (err) {
      return res.status(500).json({
        error: 'Error in retireving records !'
      });
    };
    return res.json(docs);
  });
});

app.post('/api/contacts', (req, res) => {
  const user = req.body;
  const contactsCollection = database.collection('contacts');
  contactsCollection.insertOne(user, (err, r) => {
    if (err) {
      return res.status(500).json({
        error: 'Error inserting new record !'
      });
    }
    const newRec = r.ops[0];
    return res.status(201).json(newRec);
  });
});

app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public/index.html'));
});

MongoClient.connect(process.env.DB_CONN, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log("database connection error !!! ");
    console.error(err);
    return;
  }
  console.log('connected to mongodb...');

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    database = client.db();
    console.log(`listening on port ${port} ...`);
  });

});
