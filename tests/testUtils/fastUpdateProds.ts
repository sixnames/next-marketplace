import { Db } from 'mongodb';
import { ID_COUNTER_STEP } from '../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_BLOG_POSTS, COL_ID_COUNTERS } from '../../db/collectionNames';
import { BlogPostModel, IdCounterModel } from '../../db/dbModels';
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
    const postsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);

    const posts = await postsCollection
      .aggregate<any>([
        {
          $sort: {
            _id: -1,
          },
        },
      ])
      .toArray();
    for await (const post of posts) {
      const selectedOptionsSlugs = post.selectedOptionsSlugs || ([] as string[]);
      const filterSlugs = [...selectedOptionsSlugs];
      await postsCollection.findOneAndUpdate(
        {
          _id: post._id,
        },
        {
          $set: {
            filterSlugs,
          },
          $unset: {
            selectedOptionsSlugs: '',
          },
        },
      );
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
