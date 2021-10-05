import { ObjectId } from 'mongodb';
import { DEFAULT_COUNTERS_OBJECT, FILTER_SEPARATOR } from '../../../config/common';
import {
  AttributeInterface,
  OptionInterface,
  ProductAttributeInterface,
  ProductInterface,
} from '../../../db/uiInterfaces';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
} from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
    const attributesCollection = db.collection<AttributeInterface>(COL_ATTRIBUTES);
    const optionsCollection = db.collection<OptionInterface>(COL_OPTIONS);
    const productAttributesCollection =
      db.collection<ProductAttributeInterface>(COL_PRODUCT_ATTRIBUTES);

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');

    console.log(`Updating product in ${dbConfig.dbName} db`);
    const products = await productsCollection.find({}).toArray();
    for await (const product of products) {
      const { selectedOptionsSlugs, selectedAttributesIds } = product;

      const attributes = await attributesCollection
        .find({
          _id: {
            $in: selectedAttributesIds,
          },
        })
        .toArray();

      for await (const attribute of attributes) {
        const productAttribute = await productAttributesCollection.findOne({
          productId: product._id,
          attributeId: attribute._id,
        });
        if (!productAttribute && attribute.optionsGroupId) {
          const currentAttributeSlugs: string[] = [];
          const castedOptionSlugs = selectedOptionsSlugs.reduce((acc: string[], slug) => {
            const slugParts = slug.split(FILTER_SEPARATOR);
            if (slugParts[0] === attribute.slug && slugParts[1]) {
              currentAttributeSlugs.push(slug);
              return [...acc, slugParts[1]];
            }
            return acc;
          }, []);

          if (castedOptionSlugs.length > 0) {
            const options = await optionsCollection
              .find({
                optionsGroupId: attribute.optionsGroupId,
                slug: {
                  $in: castedOptionSlugs,
                },
              })
              .toArray();
            if (options.length > 0) {
              const selectedOptionsIds = options.map(({ _id }) => _id);
              await productAttributesCollection.insertOne({
                ...attribute,
                _id: new ObjectId(),
                attributeId: attribute._id,
                productId: product._id,
                productSlug: product.slug,
                rubricId: product.rubricId,
                rubricSlug: product.rubricSlug,
                selectedOptionsIds,
                selectedOptionsSlugs: currentAttributeSlugs,
                number: undefined,
                textI18n: {},
                showAsBreadcrumb: false,
                ...DEFAULT_COUNTERS_OBJECT,
              });
            }
          }
        }
      }
    }
    console.log(`Done product in ${dbConfig.dbName} db`);
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
