import { generateDbCollections } from 'db/mongodb';
import { ID_COUNTER_STEP } from 'lib/config/common';
import { Db, MongoClient } from 'mongodb';
import { dbsConfig, getProdDb } from './getProdDb';

require('dotenv').config();

export async function getFastNextNumberItemId(
  collectionName: string,
  db: Db,
  client: MongoClient,
): Promise<string> {
  const collections = generateDbCollections({ db, client });
  const idCountersCollection = collections.idCountersCollection();

  const updatedCounter = await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $inc: {
        counter: ID_COUNTER_STEP,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  );

  if (!updatedCounter.ok || !updatedCounter.value) {
    throw Error(`${collectionName} id counter update error`);
  }

  return `${updatedCounter.value.counter}`;
}

async function processProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Processing ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const collections = generateDbCollections({ db, client });

    console.log(collections);

    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
  }
}

(() => {
  processProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
