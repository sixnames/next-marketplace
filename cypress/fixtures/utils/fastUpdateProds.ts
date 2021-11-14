import { CATEGORY_SLUG_PREFIX_SEPARATOR, CATEGORY_SLUG_PREFIX_WORD } from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import {
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
} from '../../../db/collectionNames';
import {
  ObjectIdModel,
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
    const productAttributesCollection =
      db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);

    const productAttributeGroups = await productAttributesCollection
      .aggregate<ProductAttributesAggregation>([
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
    console.log('attributes length ', productAttributeGroups.length);

    for await (const productAttributeGroup of productAttributeGroups) {
      const { productAttributes, _id } = productAttributeGroup;

      console.log('productAttributes length ', productAttributes.length);

      const product = await productsCollection.findOne({ _id });

      if (product) {
        const categorySelectedSlugs = product.selectedOptionsSlugs.filter((slug) => {
          const slugParts = slug.split(CATEGORY_SLUG_PREFIX_SEPARATOR);
          return slugParts[0] === CATEGORY_SLUG_PREFIX_WORD;
        });
        const selectedOptionsSlugs: string[] = [...categorySelectedSlugs];

        // get category slugs
        const titleCategoriesSlugs = product.titleCategoriesSlugs || [];
        titleCategoriesSlugs.forEach((categorySlug) => {
          const exist = selectedOptionsSlugs.some((slug) => categorySlug === slug);
          if (!exist) {
            selectedOptionsSlugs.push(categorySlug);
          }
        });

        for await (const productAttribute of productAttributes) {
          productAttribute.selectedOptionsSlugs.forEach((slug) => {
            selectedOptionsSlugs.push(slug);
          });
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
