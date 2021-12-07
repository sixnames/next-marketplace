// import { Db } from 'mongodb';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_PRODUCTS } from '../../../db/collectionNames';
import { ProductModel } from '../../../db/dbModels';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

    // products
    const products = await productsCollection
      .aggregate([
        {
          $project: {
            _id: true,
          },
        },
      ])
      .toArray();
    console.log(products.length);
    console.log(products[0]);
    /*for await (const product of products) {
    
    }*/

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
