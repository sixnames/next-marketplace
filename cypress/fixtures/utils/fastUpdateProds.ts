import addZero from 'add-zero';
import { Db } from 'mongodb';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  FILTER_SEPARATOR,
  ID_COUNTER_DIGITS,
  ID_COUNTER_STEP,
} from '../../../config/common';
import {
  AttributeModel,
  IdCounterModel,
  OptionModel,
  ProductAttributeModel,
  ProductModel,
  ShopProductModel,
} from '../../../db/dbModels';
import {
  COL_ATTRIBUTES,
  COL_ID_COUNTERS,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
} from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

export async function getNextItemId(collectionName: string, db: Db): Promise<string> {
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

  return addZero(updatedCounter.value.counter, ID_COUNTER_DIGITS);
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);

    const attributesCollection = await db.collection<AttributeModel>(COL_ATTRIBUTES);
    const optionsCollection = await db.collection<OptionModel>(COL_OPTIONS);
    const productsCollection = await db.collection<ProductModel>(COL_PRODUCTS);
    const shopProductsCollection = await db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const productAttributesCollection = await db.collection<ProductAttributeModel>(
      COL_PRODUCT_ATTRIBUTES,
    );

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    const attributes = await attributesCollection.find({});
    for await (const attribute of attributes) {
      console.log('<<<<<<< Attribute', attribute.nameI18n.ru);
      const isWithOptions =
        attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
        attribute.variant === ATTRIBUTE_VARIANT_SELECT;
      const newSlug = await getNextItemId(COL_ATTRIBUTES, db);

      if (isWithOptions && attribute.optionsGroupId) {
        const options = await optionsCollection
          .find({ optionsGroupId: attribute.optionsGroupId })
          .toArray();

        for await (const option of options) {
          console.log('option ====== ', option.nameI18n.ru);
          const oldOptionSlug = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
          const newOptionSlug = `${newSlug}${FILTER_SEPARATOR}${option.slug}`;

          const updater = {
            $set: {
              [`selectedOptionsSlugs.$[element]`]: newOptionSlug,
            },
          };
          const updateOptions = {
            multi: true,
            arrayFilters: [{ element: { $eq: oldOptionSlug } }],
          };

          await productsCollection.updateMany({}, updater, updateOptions);
          console.log('products done');
          await shopProductsCollection.updateMany({}, updater, updateOptions);
          console.log('shop products done');
          await productAttributesCollection.updateMany({}, updater, updateOptions);
          console.log('product attributes done');
        }
      }

      // update attribute
      await attributesCollection.findOneAndUpdate(
        {
          _id: attribute._id,
        },
        {
          $set: {
            slug: newSlug,
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
