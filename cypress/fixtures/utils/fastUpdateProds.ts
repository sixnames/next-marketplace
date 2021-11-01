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
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    const updater = {
      $unset: {
        supplierSlugs: '',
      },
    };

    await productsCollection.updateMany({}, updater);
    await shopProductsCollection.updateMany({}, updater);

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
