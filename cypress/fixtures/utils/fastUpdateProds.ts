import {
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardContentModel,
  ProductConnectionItemModel,
  ProductModel,
  ShopProductModel,
} from '../../../db/dbModels';
import { dbsConfig, getProdDb } from './getProdDb';
import {
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CARD_CONTENTS,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
} from '../../../db/collectionNames';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');

    // update products
    console.log(`Updating products in ${dbConfig.dbName} db`);
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const productAttributesCollection =
      db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
    const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
    const productCardContentsCollection =
      db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
    const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
      COL_PRODUCT_CONNECTION_ITEMS,
    );
    const products = await productsCollection
      .aggregate([
        {
          $project: {
            _id: true,
            itemId: true,
          },
        },
      ])
      .toArray();
    for await (const product of products) {
      // product
      await productsCollection.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $set: {
            slug: product.itemId,
          },
        },
      );

      const finder = {
        productId: product._id,
      };

      // shop product
      await shopProductsCollection.updateMany(finder, {
        $set: {
          slug: product.itemId,
        },
      });

      const updater = {
        $set: {
          productSlug: product.itemId,
        },
      };

      // attributes
      await productAttributesCollection.updateMany(
        {
          productId: product._id,
        },
        updater,
      );

      // assets
      await productAssetsCollection.updateMany(
        {
          productId: product._id,
        },
        updater,
      );

      // contents
      await productCardContentsCollection.updateMany(
        {
          productId: product._id,
        },
        updater,
      );

      // connections
      await productConnectionItemsCollection.updateMany(
        {
          productId: product._id,
        },
        updater,
      );
    }
    console.log(`products updated in ${dbConfig.dbName} db`);

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
