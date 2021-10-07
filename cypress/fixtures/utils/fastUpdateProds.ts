import { ObjectIdModel, ProductModel, ShopProductModel } from '../../../db/dbModels';
import { COL_PRODUCTS, COL_SHOP_PRODUCTS } from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

interface ShopProductsAggregation {
  _id: ObjectIdModel;
  shopProductIds: ObjectIdModel[];
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    const shopProductsCollection = await db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const productsCollection = await db.collection<ProductModel>(COL_PRODUCTS);

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    const shopProductsAggregation = await shopProductsCollection.aggregate<ShopProductsAggregation>(
      [
        {
          $group: {
            _id: '$productId',
            shopProductIds: {
              $addToSet: '$_id',
            },
          },
        },
      ],
    );

    for await (const shopProduct of shopProductsAggregation) {
      const product = await productsCollection.findOne({ _id: shopProduct._id });
      if (product) {
        await shopProductsCollection.updateMany(
          {
            _id: {
              $in: shopProduct.shopProductIds,
            },
          },
          {
            $set: {
              mainImage: product.mainImage,
            },
          },
        );
      }
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
