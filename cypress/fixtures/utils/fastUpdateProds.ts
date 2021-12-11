import { Db } from 'mongodb';
import { ID_COUNTER_STEP } from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_COMPANIES, COL_ID_COUNTERS, COL_SHOP_PRODUCTS } from '../../../db/collectionNames';
import { CompanyModel, IdCounterModel, ShopProductModel } from '../../../db/dbModels';
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
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    const companies = await companiesCollection.find({}).toArray();
    for await (const company of companies) {
      await shopProductsCollection.updateMany(
        {
          companyId: company._id,
        },
        {
          $set: {
            companySlug: company.slug,
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
