import path from 'path';
import { COL_SHOPS } from '../../../db/collectionNames';
import { MongoClient } from 'mongodb';
require('dotenv').config();

async function getDatabase() {
  const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');
  const uri = process.env.PROD_MONGO_URL;
  if (!uri) {
    throw new Error('Unable to connect to database, no URI provided');
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: process.env.PROD_MONGO_DB_NAME,
    tls: true,
    tlsCAFile,
    replicaSet: process.env.MONGO_DB_RS,
  };

  // Create connection
  const client = await MongoClient.connect(uri, options);

  // Select the database through the connection
  return client.db(process.env.PROD_MONGO_DB_NAME);
}

async function updateProductionShops() {
  const db = await getDatabase();

  console.log('Updating api shops');

  const timeStart = new Date().getTime();
  const shopsCollection = db.collection(COL_SHOPS);
  await shopsCollection.updateMany(
    {},
    {
      $set: {
        rating: 5,
      },
    },
  );

  console.log('Total time: ', new Date().getTime() - timeStart);
}

(() => {
  updateProductionShops()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
