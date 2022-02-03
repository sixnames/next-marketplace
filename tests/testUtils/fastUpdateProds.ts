import { Db } from 'mongodb';
import { ID_COUNTER_STEP, PAGE_EDITOR_DEFAULT_VALUE_STRING } from '../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_ID_COUNTERS, COL_SEO_CONTENTS } from '../../db/collectionNames';
import { IdCounterModel, SeoContentModel } from '../../db/dbModels';
require('dotenv').config();

export async function getFastNextNumberItemId(collectionName: string, db: Db): Promise<string> {
  const idCountersCollection = db.collection<IdCounterModel>(COL_ID_COUNTERS);

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

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

    const countBefore = await seoContentsCollection.countDocuments({});

    await seoContentsCollection.deleteMany({
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      $or: [
        {
          showForIndex: false,
        },
        {
          showForIndex: {
            $exists: false,
          },
        },
      ],
    });

    const countAfter = await seoContentsCollection.countDocuments({});

    console.log({ countBefore, countAfter, diff: countBefore - countAfter });

    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
  }
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
