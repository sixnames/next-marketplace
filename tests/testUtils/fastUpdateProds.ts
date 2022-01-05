import { Db } from 'mongodb';
import { ID_COUNTER_STEP } from '../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_ID_COUNTERS, COL_ORDER_PRODUCTS } from '../../db/collectionNames';
import { IdCounterModel, OrderProductModel } from '../../db/dbModels';
require('dotenv').config();

// const COL_PRODUCT_CONNECTIONS_OLD = 'productConnections';
// const COL_PRODUCT_CONNECTION_ITEMS_OLD = 'productConnectionItems';
// const COL_PRODUCT_VARIANTS_OLD = 'productVariants';
// const COL_PRODUCT_VARIANT_ITEMS_OLD = 'productVariantItems';
// const COL_SHOP_PRODUCTS_OLD = 'shopProducts';
// const COL_PRODUCTS_OLD = 'products';
// const COL_PRODUCT_ASSETS_OLD = 'productAssets';

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
    const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
    console.log(orderProductsCollection);

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
