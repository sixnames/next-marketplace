import { Db } from 'mongodb';
import { DEFAULT_COMPANY_SLUG, ID_COUNTER_STEP } from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_COMPANIES, COL_ID_COUNTERS, COL_SEO_CONTENTS } from '../../../db/collectionNames';
import { CompanyModel, IdCounterModel, SeoContentModel } from '../../../db/dbModels';
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
    const soeContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
    const slug = '20';
    const company = await companiesCollection.findOne({
      slug,
    });
    if (company) {
      const seoContents = await soeContentsCollection.find({ companySlug: company.slug }).toArray();
      for await (const seo of seoContents) {
        const newSlug = seo.slug.replace(company._id.toHexString(), DEFAULT_COMPANY_SLUG);
        const oldSeo = await soeContentsCollection.findOne({
          slug: newSlug,
        });
        if (oldSeo) {
          await soeContentsCollection.findOneAndDelete({
            _id: oldSeo._id,
          });
        }
        await soeContentsCollection.findOneAndUpdate(
          {
            _id: seo._id,
          },
          {
            $set: {
              companySlug: DEFAULT_COMPANY_SLUG,
              url: seo.url.replace(slug, DEFAULT_COMPANY_SLUG),
              slug: seo.slug.replace(company._id.toHexString(), DEFAULT_COMPANY_SLUG),
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
