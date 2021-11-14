import {
  CATEGORY_SLUG_PREFIX_SEPARATOR,
  CATEGORY_SLUG_PREFIX_WORD,
  FILTER_SEPARATOR,
} from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
} from '../../../db/collectionNames';
import {
  AttributeModel,
  ObjectIdModel,
  OptionModel,
  ProductAttributeModel,
  ProductModel,
  ShopProductModel,
} from '../../../db/dbModels';

require('dotenv').config();

/*async function getNextNumberItemId(collectionName: string, db: Db): Promise<string> {
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
}*/

interface ProductAttributesAggregation {
  _id: ObjectIdModel;
  productAttributes: ProductAttributeModel[];
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
    const productAttributesCollection =
      db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);

    const variants = ['select', 'multipleSelect'] as any;
    const attributes = await attributesCollection
      .find({
        variant: {
          $in: variants,
        },
      })
      .toArray();
    console.log('attributes length ', attributes.length);
    for await (const attribute of attributes) {
      if (attribute.optionsGroupId) {
        const options = await optionsCollection
          .find({ optionsGroupId: attribute.optionsGroupId })
          .toArray();

        const productAttributeGroups = await productAttributesCollection
          .aggregate<ProductAttributesAggregation>([
            {
              $match: {
                attributeId: attribute._id,
              },
            },
            {
              $group: {
                _id: '$productId',
                productAttributes: {
                  $addToSet: '$$ROOT',
                },
              },
            },
          ])
          .toArray();

        for await (const productAttributeGroup of productAttributeGroups) {
          const { productAttributes, _id } = productAttributeGroup;

          const product = await productsCollection.findOne({ _id });

          if (product) {
            const categorySelectedSlugs = product.selectedOptionsSlugs.filter((slug) => {
              const slugParts = slug.split(CATEGORY_SLUG_PREFIX_SEPARATOR);
              return slugParts[0] === CATEGORY_SLUG_PREFIX_WORD;
            });
            const selectedOptionsSlugs: string[] = [...categorySelectedSlugs];
            // update product attributes
            for await (const productAttribute of productAttributes) {
              const innerSelectedOptionsSlugs: string[] = [];
              const selectedOptions = options.filter(({ _id }) => {
                return productAttribute.selectedOptionsIds.some((optionId) => {
                  return optionId.equals(_id);
                });
              });

              selectedOptions.forEach(({ slug }) => {
                const selectedSlug = `${attribute.slug}${FILTER_SEPARATOR}${slug}`;
                innerSelectedOptionsSlugs.push(selectedSlug);
                selectedOptionsSlugs.push(selectedSlug);
              });

              await productAttributesCollection.findOneAndUpdate(
                {
                  _id: productAttribute._id,
                },
                {
                  $set: {
                    selectedOptionsSlugs: innerSelectedOptionsSlugs,
                  },
                },
              );
            }

            // update product
            await productsCollection.findOneAndUpdate(
              {
                _id,
              },
              {
                $set: {
                  selectedOptionsSlugs,
                },
              },
            );

            // update shop products
            await shopProductsCollection.updateMany(
              {
                productId: _id,
              },
              {
                $set: {
                  selectedOptionsSlugs,
                },
              },
            );
          }
        }
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
