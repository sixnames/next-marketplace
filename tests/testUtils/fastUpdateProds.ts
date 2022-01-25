import { Db } from 'mongodb';
import { ID_COUNTER_STEP } from '../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_ID_COUNTERS, COL_PRODUCT_SUMMARIES } from '../../db/collectionNames';
import { IdCounterModel, ProductSummaryModel, ProductVariantModel } from '../../db/dbModels';
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
    const summariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);

    const summaries = await summariesCollection
      .find({
        'variants.1': {
          $exists: true,
        },
      })
      .toArray();

    const variants = summaries.reduce((acc: ProductVariantModel[], { variants }) => {
      return [...acc, ...(variants || [])];
    }, []);
    const allVariants = variants.reduce((acc: ProductVariantModel[], variant) => {
      const exist = acc.some(({ _id }) => {
        return _id.equals(variant._id);
      });
      if (exist) {
        return acc;
      }
      return [...acc, variant];
    }, []);

    console.log('allVariants', allVariants.length);
    await summariesCollection.updateMany(
      {},
      {
        $set: {
          variants: [],
        },
      },
    );

    for await (const variant of allVariants) {
      const summaryIds = variant.products.map(({ productId }) => productId);
      await summariesCollection.updateMany(
        {
          _id: {
            $in: summaryIds,
          },
        },
        {
          $push: {
            variants: variant,
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
