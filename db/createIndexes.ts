import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CONFIGS,
  COL_MANUFACTURERS,
  COL_RUBRICS,
} from 'db/collectionNames';
import { BrandModel, ConfigModel, ManufacturerModel, ProductModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';

export async function createIndexes() {
  const db = await getDatabase();

  // Brands indexes
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  await brandsCollection.createIndex({ slug: 1 });

  // Brand collections indexes
  const brandCollectionsCollection = db.collection<BrandModel>(COL_BRAND_COLLECTIONS);
  await brandCollectionsCollection.createIndex({ slug: 1 });

  // Manufacturers indexes
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  await manufacturersCollection.createIndex({ slug: 1 });

  // Rubrics indexes
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  await rubricsCollection.createIndex({ slug: 1 });

  // Configs indexes
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  await configsCollection.createIndex({ slug: 1 });

  // Products indexes
  const productsCollection = db.collection<ProductModel>(COL_RUBRICS);
  await productsCollection.createIndex({
    selectedOptionsSlugs: 1,
  });
  await productsCollection.createIndex({
    selectedOptionsSlugs: 1,
    active: 1,
    archive: 1,
  });
  await productsCollection.createIndex({
    selectedOptionsSlugs: 1,
    active: 1,
    archive: 1,
    [`views.msk`]: -1,
    [`priority.msk`]: -1,
    [`minPriceCities.msk`]: -1,
  });
  await productsCollection.createIndex({
    selectedOptionsSlugs: 1,
    active: 1,
    archive: 1,
    [`views.msk`]: -1,
    [`priority.msk`]: -1,
    [`minPriceCities.msk`]: 1,
  });
  await productsCollection.createIndex({ slug: 1 });

  const indexes = await productsCollection.listIndexes().toArray();
  console.log(indexes);
}
