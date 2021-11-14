import { CATEGORY_SLUG_PREFIX_SEPARATOR, CATEGORY_SLUG_PREFIX_WORD } from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_CATEGORIES, COL_PRODUCTS, COL_SHOP_PRODUCTS } from '../../../db/collectionNames';
import { CategoryModel, ObjectIdModel, ProductModel, ShopProductModel } from '../../../db/dbModels';

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

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    const products = await productsCollection.find({}).toArray();
    const categories = await categoriesCollection.find({}).toArray();

    for await (const product of products) {
      const selectedOptionsSlugs = [...product.selectedOptionsSlugs];
      const categorySelectedSlugs = selectedOptionsSlugs.filter((slug) => {
        const slugParts = slug.split(CATEGORY_SLUG_PREFIX_SEPARATOR);
        return slugParts[0] === CATEGORY_SLUG_PREFIX_WORD;
      });

      const productCategories = categories.filter(({ slug }) => {
        return categorySelectedSlugs.includes(slug);
      });

      const categoryIds = productCategories.reduce((acc: ObjectIdModel[], { parentTreeIds }) => {
        return [...acc, ...parentTreeIds];
      }, []);

      const newCategories = categories.filter(({ _id }) => {
        return categoryIds.some((categoryId) => categoryId.equals(_id));
      });

      newCategories.forEach(({ slug, nameI18n }) => {
        const exist = selectedOptionsSlugs.includes(slug);
        if (!exist) {
          console.log('not found ', nameI18n.ru, ' ', product._id.toHexString());
          selectedOptionsSlugs.push(slug);
        }
      });

      // update product
      await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
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
          productId: product._id,
        },
        {
          $set: {
            selectedOptionsSlugs,
          },
        },
      );
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
