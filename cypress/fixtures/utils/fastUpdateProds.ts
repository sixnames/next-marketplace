import { DEFAULT_COMPANY_SLUG, ID_COUNTER_STEP } from '../../../config/common';
import { Db } from 'mongodb';
import { dbsConfig, getProdDb } from './getProdDb';
import {
  COL_ATTRIBUTES,
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_POSTS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_CATEGORY_DESCRIPTIONS,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_ID_COUNTERS,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_PAGES,
  COL_PAGES_GROUP,
  COL_PRODUCT_CARD_CONTENTS,
  COL_PRODUCT_CARD_DESCRIPTIONS,
  COL_PRODUCT_SEO,
  COL_PROMO,
  COL_RUBRIC_DESCRIPTIONS,
  COL_RUBRIC_SEO,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../../db/collectionNames';
import {
  CompanyModel,
  ConfigModel,
  ProductCardDescriptionModel,
  ProductCardContentModel,
  ProductSeoModel,
  RubricVariantModel,
  RubricDescriptionModel,
  CategoryDescriptionModel,
  RubricSeoModel,
  PromoModel,
  PagesGroupModel,
  PageModel,
  BlogPostModel,
  IdCounterModel,
  AttributeModel,
  BrandModel,
  BrandCollectionModel,
  ManufacturerModel,
  OptionModel,
  RubricModel,
  CategoryModel,
  ShopProductModel,
  BlogAttributeModel,
} from '../../../db/dbModels';

require('dotenv').config();
const defaultSlug = 'default';

async function getNextNumberItemId(collectionName: string, db: Db): Promise<string> {
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

    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
    const cardDescriptionsCollection = db.collection<ProductCardDescriptionModel>(
      COL_PRODUCT_CARD_DESCRIPTIONS,
    );
    const cardContentsCollection =
      db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
    const productSeoCollection = db.collection<ProductSeoModel>(COL_PRODUCT_SEO);
    const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
    const rubricDescriptionsCollection =
      db.collection<RubricDescriptionModel>(COL_RUBRIC_DESCRIPTIONS);
    const categoryDescriptionsCollection =
      db.collection<CategoryDescriptionModel>(COL_CATEGORY_DESCRIPTIONS);
    const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);
    const promosCollection = db.collection<PromoModel>(COL_PROMO);
    const pageGroupsCollection = db.collection<PagesGroupModel>(COL_PAGES_GROUP);
    const pagesCollection = db.collection<PageModel>(COL_PAGES);
    const postsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);

    const companies = await companiesCollection.find({}).toArray();
    const companySlugs = companies.map(({ slug }) => slug);

    for await (const companySlug of [...companySlugs, defaultSlug]) {
      const isDefault = companySlug === defaultSlug;
      const newSlug = isDefault
        ? DEFAULT_COMPANY_SLUG
        : await getNextNumberItemId(COL_COMPANIES, db);

      const query = {
        companySlug,
      };
      const updater = {
        $set: {
          companySlug: newSlug,
        },
      };

      await configsCollection.updateMany(query, updater);
      await cardDescriptionsCollection.updateMany(query, updater);
      await cardContentsCollection.updateMany(query, updater);
      await productSeoCollection.updateMany(query, updater);
      await rubricVariantsCollection.updateMany(query, updater);
      await rubricDescriptionsCollection.updateMany(query, updater);
      await categoryDescriptionsCollection.updateMany(query, updater);
      await rubricSeoCollection.updateMany(query, updater);
      await promosCollection.updateMany(query, updater);
      await pageGroupsCollection.updateMany(query, updater);
      await pagesCollection.updateMany(query, updater);
      await postsCollection.updateMany(query, updater);

      if (!isDefault) {
        await companiesCollection.findOneAndUpdate(
          {
            slug: companySlug,
          },
          {
            $set: {
              slug: newSlug,
            },
          },
        );
      }
    }

    // reset counters
    console.log('reset counters');
    await postsCollection.updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<AttributeModel>(COL_ATTRIBUTES).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<BrandModel>(COL_BRANDS).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<ManufacturerModel>(COL_MANUFACTURERS).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<OptionModel>(COL_OPTIONS).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<RubricModel>(COL_RUBRICS).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<CategoryModel>(COL_CATEGORIES).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<ShopProductModel>(COL_SHOP_PRODUCTS).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
        },
      },
    );
    await db.collection<BlogAttributeModel>(COL_BLOG_ATTRIBUTES).updateMany(
      {},
      {
        $unset: {
          views: '',
          priorities: '',
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
