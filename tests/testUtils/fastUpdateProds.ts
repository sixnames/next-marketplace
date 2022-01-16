import { Db } from 'mongodb';
import { ID_COUNTER_STEP } from '../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_CATEGORIES, COL_ID_COUNTERS, COL_RUBRICS } from '../../db/collectionNames';
import { CategoryModel, IdCounterModel, ObjectIdModel, RubricModel } from '../../db/dbModels';
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

interface CategoryType extends CategoryModel {
  attributesGroupIds: ObjectIdModel[];
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const categoriesCollection = db.collection<CategoryType>(COL_CATEGORIES);

    const rubrics = await rubricsCollection.find({}).toArray();
    for await (const rubric of rubrics) {
      const categories = await categoriesCollection
        .find({
          rubricId: rubric._id,
        })
        .toArray();
      const attributesGroupIds = categories.reduce((acc: ObjectIdModel[], category) => {
        return [...acc, ...category.attributesGroupIds];
      }, []);
      await rubricsCollection.findOneAndUpdate(
        {
          _id: rubric._id,
        },
        {
          $addToSet: {
            attributesGroupIds: {
              $each: attributesGroupIds,
            },
          },
        },
      );
    }

    await categoriesCollection.updateMany(
      {},
      {
        $unset: {
          attributesGroupIds: '',
        },
      },
    );

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
