import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  FILTER_SEPARATOR,
} from '../../../config/common';
import { getNextItemId } from '../../../lib/itemIdUtils';
import {
  AttributeModel,
  ProductAttributeModel,
  ProductModel,
  ShopProductModel,
} from '../../../db/dbModels';
import {
  COL_ATTRIBUTES,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
} from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);

    const attributesCollection = await db.collection<AttributeModel>(COL_ATTRIBUTES);
    const productsCollection = await db.collection<ProductModel>(COL_PRODUCTS);
    const shopProductsCollection = await db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const productAttributesCollection = await db.collection<ProductAttributeModel>(
      COL_PRODUCT_ATTRIBUTES,
    );

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    console.log('Brands');
    const attributes = await attributesCollection.find({});
    for await (const attribute of attributes) {
      const isWithOptions =
        attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
        attribute.variant === ATTRIBUTE_VARIANT_SELECT;
      const newSlug = await getNextItemId(COL_ATTRIBUTES);
      const productAttributes = await productAttributesCollection
        .find({
          attributeId: attribute._id,
        })
        .toArray();

      if (isWithOptions) {
        for await (const productAttribute of productAttributes) {
          const selectedOptionsSlugs = productAttribute.selectedOptionsSlugs.reduce(
            (acc: string[], optionSlug) => {
              const slugParts = optionSlug.split(FILTER_SEPARATOR);
              if (slugParts[0] === attribute.slug) {
                return [...acc, `${newSlug}${FILTER_SEPARATOR}${slugParts[1]}`];
              }
              return [...acc, optionSlug];
            },
            [],
          );

          // update product attribute
          await productAttributesCollection.findOneAndUpdate(
            { _id: productAttribute._id },
            {
              $set: {
                selectedOptionsSlugs,
              },
            },
          );

          // update product
          const product = await productsCollection.findOne({
            _id: productAttribute.productId,
          });
          if (product) {
            const selectedOptionsSlugs = product.selectedOptionsSlugs.reduce(
              (acc: string[], optionSlug) => {
                const slugParts = optionSlug.split(FILTER_SEPARATOR);
                if (slugParts[0] === attribute.slug) {
                  return [...acc, `${newSlug}${FILTER_SEPARATOR}${slugParts[1]}`];
                }
                return [...acc, optionSlug];
              },
              [],
            );
            const updater = {
              $set: {
                selectedOptionsSlugs,
              },
            };

            await productsCollection.findOneAndUpdate(
              {
                _id: product._id,
              },
              updater,
            );

            // update shop products
            await shopProductsCollection.updateMany({ productId: product._id }, updater);
          } else {
            await productAttributesCollection.findOneAndDelete({ _id: productAttribute._id });
          }
        }
      }

      // update attribute
      await attributesCollection.findOneAndUpdate(
        {
          _id: attribute._id,
        },
        {
          slug: newSlug,
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
