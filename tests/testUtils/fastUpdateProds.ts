import { Db } from 'mongodb';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  ID_COUNTER_STEP,
} from '../../config/common';
import { getAttributeReadableValueLocales } from '../../lib/productAttributesUtils';
import { dbsConfig, getProdDb } from './getProdDb';
import {
  COL_ATTRIBUTES,
  COL_ID_COUNTERS,
  COL_OPTIONS,
  COL_PRODUCT_SUMMARIES,
} from '../../db/collectionNames';
import {
  AttributeModel,
  IdCounterModel,
  OptionModel,
  ProductSummaryAttributeModel,
  ProductSummaryModel,
} from '../../db/dbModels';
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
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
    const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

    const attributes = await attributesCollection.find({}).toArray();
    const options = await optionsCollection.find({}).toArray();

    const summaries = await summariesCollection
      .find({
        'attributes.readableValueI18n.ru': null,
      })
      .toArray();
    for await (const summary of summaries) {
      const productAttributes: ProductSummaryAttributeModel[] = [];
      for await (const productAttribute of summary.attributes) {
        if (!productAttribute.attributeId) {
          continue;
        }
        const attribute = attributes.find(({ _id }) => {
          return _id.equals(productAttribute.attributeId);
        });
        if (!attribute) {
          continue;
        }

        const attributeOptions = options.filter(({ _id }) => {
          return productAttribute.optionIds.some((optionId) => optionId.equals(_id));
        });
        if (
          attributeOptions.length < 1 &&
          (attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
            attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT)
        ) {
          continue;
        }
        const readableValueI18n = getAttributeReadableValueLocales({
          productAttribute: {
            ...productAttribute,
            attribute: {
              ...attribute,
              options: attributeOptions,
            },
          },
          gender: summary.gender,
        });
        if (!readableValueI18n.ru) {
          continue;
        }

        const updatedProductAttribute: ProductSummaryAttributeModel = {
          ...productAttribute,
          readableValueI18n,
        };
        productAttributes.push(updatedProductAttribute);
      }

      // update summary
    }
    console.log('summaries', summaries.length);

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
