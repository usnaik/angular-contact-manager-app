const createExpressApp = require('./create-express-app');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();

MongoClient.connect(process.env.DB_CONN, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('connected to mongodb...');
  const database = client.db();
  const port = process.env.PORT || 3000;
  createExpressApp(database)
    .listen(port, () => {
      console.log(`listening on port ${port}...`);
    });
});
