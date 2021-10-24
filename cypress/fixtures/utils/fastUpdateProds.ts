import { DEFAULT_COMPANY_SLUG } from '../../../config/common';
import {
  CategoryDescriptionModel,
  ProductCardDescriptionModel,
  ProductSeoModel,
  RubricDescriptionModel,
  RubricSeoModel,
} from '../../../db/dbModels';
import {
  COL_CATEGORIES,
  COL_CATEGORY_DESCRIPTIONS,
  COL_PRODUCT_CARD_DESCRIPTIONS,
  COL_PRODUCT_SEO,
  COL_PRODUCTS,
  COL_RUBRIC_DESCRIPTIONS,
  COL_RUBRIC_SEO,
  COL_RUBRICS,
} from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const isToys = dbConfig.dbName === `${process.env.SC_DB_NAME}`;
    const isWp = dbConfig.dbName === `${process.env.WP_DB_NAME}`;
    const companySlug = isToys ? DEFAULT_COMPANY_SLUG : 'womens_secretary_000003';

    const { db, client } = await getProdDb(dbConfig);
    const rubricsCollection = await db.collection<any>(COL_RUBRICS);
    const rubricSeoCollection = await db.collection<RubricSeoModel>(COL_RUBRIC_SEO);
    const rubricDescriptionsCollection = await db.collection<RubricDescriptionModel>(
      COL_RUBRIC_DESCRIPTIONS,
    );

    const categoriesCollection = await db.collection<any>(COL_CATEGORIES);
    const categoryDescriptionsCollection = await db.collection<CategoryDescriptionModel>(
      COL_CATEGORY_DESCRIPTIONS,
    );

    const productsCollection = await db.collection<any>(COL_PRODUCTS);
    const productSeoCollection = await db.collection<ProductSeoModel>(COL_PRODUCT_SEO);
    const productDescriptionsCollection = await db.collection<ProductCardDescriptionModel>(
      COL_PRODUCT_CARD_DESCRIPTIONS,
    );

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    // update rubrics
    const rubrics = await rubricsCollection.find({}).toArray();
    for await (const rubric of rubrics) {
      // title
      await rubricsCollection.findOneAndUpdate(
        {
          _id: rubric._id,
        },
        {
          $unset: {
            descriptionTopI18n: '',
            descriptionBottomI18n: '',
            catalogueTitle: '',
          },
          $set: {
            defaultTitleI18n: rubric.catalogueTitle.defaultTitleI18n,
            prefixI18n: rubric.catalogueTitle.prefixI18n,
            keywordI18n: rubric.catalogueTitle.keywordI18n,
            gender: rubric.catalogueTitle.gender,
          },
        },
      );

      // descriptions
      if (rubric.descriptionTopI18n) {
        rubricDescriptionsCollection.insertOne({
          companySlug,
          rubricId: rubric._id,
          rubricSlug: rubric.slug,
          position: 'top',
          textI18n: rubric.descriptionTopI18n,
        });
      }
      if (rubric.descriptionBottomI18n) {
        rubricDescriptionsCollection.insertOne({
          companySlug,
          rubricId: rubric._id,
          rubricSlug: rubric.slug,
          position: 'bottom',
          textI18n: rubric.descriptionBottomI18n,
        });
      }
    }

    // update categories
    const categories = await categoriesCollection.find({}).toArray();
    for await (const category of categories) {
      await categoriesCollection.findOneAndUpdate(
        {
          _id: category._id,
        },
        {
          $unset: {
            descriptionTopI18n: '',
            descriptionBottomI18n: '',
          },
        },
      );

      // descriptions
      if (category.descriptionTopI18n) {
        categoryDescriptionsCollection.insertOne({
          companySlug,
          categoryId: category._id,
          categorySlug: category.slug,
          position: 'top',
          textI18n: category.descriptionTopI18n,
        });
      }
      if (category.descriptionBottomI18n) {
        categoryDescriptionsCollection.insertOne({
          companySlug,
          categoryId: category._id,
          categorySlug: category.slug,
          position: 'bottom',
          textI18n: category.descriptionBottomI18n,
        });
      }
    }

    // update rubric and category seo
    await rubricSeoCollection.updateMany(
      {},
      {
        $set: {
          companySlug,
        },
      },
    );

    // update products
    if (!isWp) {
      const products = await productsCollection.find({}).toArray();
      for await (const product of products) {
        if (product.cardDescriptionI18n) {
          await productDescriptionsCollection.insertOne({
            companySlug,
            textI18n: product.cardDescriptionI18n,
            productId: product._id,
            productSlug: product.slug,
          });

          await productsCollection.findOneAndUpdate(
            {
              _id: product._id,
            },
            {
              $unset: {
                cardDescriptionI18n: '',
              },
            },
          );
        }
      }

      // update product seo
      await productSeoCollection.updateMany(
        {},
        {
          $set: {
            companySlug,
          },
        },
      );
    }

    console.log(`Done ${dbConfig.dbName} db`);
    console.log(' ');

    // disconnect form db
    await client.close();
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
