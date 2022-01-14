import { Db } from 'mongodb';
import { DEFAULT_COMPANY_SLUG, ID_COUNTER_STEP } from '../../config/common';
import { noNaN } from '../../lib/numbers';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_COMPANIES, COL_ID_COUNTERS } from '../../db/collectionNames';
import { CompanyModel, IdCounterModel } from '../../db/dbModels';
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
  const slugs: string[] = [DEFAULT_COMPANY_SLUG];
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);

    const companies = await companiesCollection
      .aggregate<CompanyModel>([
        {
          $sort: {
            slug: -1,
          },
        },
        {
          $project: {
            slug: true,
          },
        },
      ])
      .toArray();
    for await (const company of companies) {
      const exist = slugs.some((slug) => slug === company.slug);
      if (!exist) {
        slugs.push(company.slug);
      }
    }

    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
  }

  console.log(
    slugs.sort((a, b) => {
      return noNaN(a) - noNaN(b);
    }),
    slugs.length,
  );
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
