const express = require('express');
const mongoDb = require("mongodb");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const checkJwt = require('express-jwt');

function apiRouter(database) {

  const router = express.Router();

  router.use(
    checkJwt({ secret: process.env.JWT_SECRET }).unless({ path: '/api/authenticate' })
  );

  router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({ error: err.message });
    }
  });

  // GET /contacts : Retrieve and return all the Contacts 
  router.get('/contacts', (req, res) => {
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

  // POST /contacts : Add a NEW contact to database [Save]
  router.post('/contacts', (req, res) => {
    const user = req.body;

    const contactsCollection = database.collection('contacts');
    contactsCollection.insertOne(user, (err, r) => {
      if (err) {
        return res.status(500).json({ error: 'Error inserting new record !' });
      }
      const newRec = r.ops[0];
      return res.status(201).json(newRec);
    });
  });

  // EDIT : Retrieves returns Specified Contact for Editing
  router.get('/contacts/:id', (req, res) => {

    const contactId = req.params.id;
    const contactObjId = new mongoDb.ObjectID(contactId);

    const contactsCollection = database.collection('contacts');
    contactsCollection
      .findOne({ _id: contactObjId }, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error in retireving record !' });
        };
        if (!result) {
          return res.status(404).json({ error: 'contact not found' });
        }
        return res.status(200).json(result);
      });

  });

  // UPDATE  PUT /Contact: Retrieve a Contact for Editing
  router.put('/contacts/:id', async (req, res) => {
    const updateContact = req.body;

    const contactId = req.params.id;
    const contactObjId = new mongoDb.ObjectID(contactId);

    const contactsCollection = database.collection('contacts');
    contactsCollection
      .findOneAndReplace({ _id: contactObjId }, { updateContact }, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error in retireving records !' });
        };
        if (!result) {
          return res.status(404).json({ error: 'contact could not be found' });
        }
        return res.status(200).json(result);
      });
  });

  // DELETE a Contact
  router.delete('/contacts/:id', (req, res) => {

    const contactId = req.params.id;
    const contactObjId = new mongoDb.ObjectID(contactId);

    const contactsCollection = database.collection('contacts');
    contactsCollection.findOneAndDelete({ _id: contactObjId }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting record !' });
      }
      return res.status(200).json(result);
    });
  });

  // Authenticate a User 
  router.post('/authenticate', (req, res) => {
    const user = req.body;

    const usersCollection = database.collection('users');

    usersCollection
      .findOne({ username: user.username }, (err, result) => {
        if (!result) {
          return res.status(404).json({ error: 'user not found' });
        }

        if (!bcrypt.compareSync(user.password, result.password)) {
          return res.status(401).json({ error: 'incorrect password ' });
        }

        const payload = {
          username: result.username,
          admin: result.admin
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });

        return res.json({
          message: 'successfuly authenticated',
          token: token
        });
      });
  });

  return router;
}

module.exports = apiRouter;
