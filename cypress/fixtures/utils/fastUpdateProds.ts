import addZero from 'add-zero';
import { ID_COUNTER_DIGITS } from 'config/common';
import { IdCounterModel, ShopProductModel } from 'db/dbModels';
import { COL_ID_COUNTERS, COL_SHOP_PRODUCTS } from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

interface TempShopProduct {
  index: number;
  shopProduct: ShopProductModel;
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const idCountersCollection = db.collection<IdCounterModel>(COL_ID_COUNTERS);

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');

    console.log(`Updating shop product itemId in ${dbConfig.dbName} db`);
    const shopProducts = await shopProductsCollection.find({}).toArray();
    await idCountersCollection.insertOne({
      collection: COL_SHOP_PRODUCTS,
      counter: shopProducts.length + 100,
    });

    const shopProductsWithIndex: TempShopProduct[] = shopProducts.map((shopProduct, index) => {
      return {
        index,
        shopProduct,
      };
    });

    for await (const shopProduct of shopProductsWithIndex) {
      await shopProductsCollection.findOneAndUpdate(
        {
          _id: shopProduct.shopProduct._id,
        },
        {
          $set: {
            itemId: addZero(shopProduct.index, ID_COUNTER_DIGITS),
          },
          $unset: {
            slug: '',
            active: '',
            originalName: '',
            nameI18n: '',
            descriptionI18n: '',
            mainImage: '',
            titleCategoriesSlugs: '',
            selectedAttributesIds: '',
            gender: '',
          },
        },
      );
    }
    console.log(`Done shop product itemId in ${dbConfig.dbName} db`);
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
