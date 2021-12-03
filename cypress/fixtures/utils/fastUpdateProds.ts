import { Db } from 'mongodb';
import { ID_COUNTER_STEP } from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_ICONS, COL_ID_COUNTERS } from '../../../db/collectionNames';
import { IconModel, IdCounterModel } from '../../../db/dbModels';
import { optimize } from 'svgo';
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
    const iconsCollection = db.collection<IconModel>(COL_ICONS);

    const icons = await iconsCollection.find({}).toArray();
    for await (const icon of icons) {
      const optimizedIcon = await optimize(icon.icon, {
        plugins: [
          'removeDimensions',
          'cleanupIDs',
          {
            name: 'prefixIds',
            // @ts-ignore
            params: {
              prefix: () => {
                const random = Math.random();
                const date = new Date().getTime();
                const prefix = Math.ceil(date / random);
                return `${prefix}`;
              },
            },
          },
        ],
      });
      if (optimizedIcon) {
        await iconsCollection.findOneAndUpdate(
          {
            _id: icon._id,
          },
          {
            $set: {
              icon: optimizedIcon.data,
            },
          },
        );
      }
    }

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
