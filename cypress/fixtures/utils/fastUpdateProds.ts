import { ObjectId } from 'mongodb';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS } from '../../../db/collectionNames';
import { ProductModel, ShopProductModel } from '../../../db/dbModels';

require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

    const shopProducts = await shopProductsCollection
      .find({
        shopId: new ObjectId('60f7e437a0b68100095774b2'),
      })
      .toArray();
    const productIds = shopProducts.map(({ productId }) => productId);
    const products = await productsCollection
      .find({
        _id: {
          $in: productIds,
        },
      })
      .toArray();
    console.log({
      shopProducts: shopProducts.length,
      products: products.length,
    });
    for await (const product of products) {
      await shopProductsCollection.updateMany(
        {
          productId: product._id,
        },
        {
          $addToSet: {
            barcode: {
              $each: product.barcode,
            },
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
