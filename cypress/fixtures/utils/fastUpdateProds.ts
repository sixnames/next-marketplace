import { ProductModel, ShopProductModel } from '../../../db/dbModels';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
  COL_SHOP_PRODUCTS,
  COL_SUPPLIERS,
} from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);
    const productsCollection = await db.collection<ProductModel>(COL_PRODUCTS);
    const shopProductsCollection = await db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    const brandsCollection = await db.collection<any>(COL_BRANDS);
    const brandCollectionsCollection = await db.collection<any>(COL_BRAND_COLLECTIONS);
    const manufacturersCollection = await db.collection<any>(COL_MANUFACTURERS);
    const suppliersCollection = await db.collection<any>(COL_SUPPLIERS);

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    console.log('Brands');
    const brands = await brandsCollection.find({});
    for await (const brand of brands) {
      const query = {
        brandSlug: brand.slug,
      };
      const updater = {
        $set: {
          brandSlug: brand.itemId,
        },
      };
      await productsCollection.updateMany(query, updater);
      await shopProductsCollection.updateMany(query, updater);
    }

    console.log('Brand collections');
    const brandCollections = await brandCollectionsCollection.find({});
    for await (const brandCollection of brandCollections) {
      const query = {
        brandCollectionSlug: brandCollection.slug,
      };
      const updater = {
        $set: {
          brandCollectionSlug: brandCollection.itemId,
        },
      };
      await productsCollection.updateMany(query, updater);
      await shopProductsCollection.updateMany(query, updater);
    }

    console.log('Manufacturers');
    const manufacturers = await manufacturersCollection.find({});
    for await (const manufacturer of manufacturers) {
      const query = {
        manufacturerSlug: manufacturer.slug,
      };
      const updater = {
        $set: {
          manufacturerSlug: manufacturer.itemId,
        },
      };
      await productsCollection.updateMany(query, updater);
      await shopProductsCollection.updateMany(query, updater);
    }

    console.log('Suppliers');
    const suppliers = await suppliersCollection.find({});
    for await (const supplier of suppliers) {
      const query = {
        supplierSlugs: supplier.slug,
      };
      const updater = {
        $set: {
          [`supplierSlugs.$`]: supplier.itemId,
        },
      };
      await productsCollection.updateMany(query, updater);
      await shopProductsCollection.updateMany(query, updater);
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
