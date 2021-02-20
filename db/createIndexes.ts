import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CONFIGS,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import { BrandModel, ConfigModel, ManufacturerModel, ProductModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';

export async function createIndexes() {
  const db = await getDatabase();

  // Brands indexes
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  await brandsCollection.createIndex({ slug: 1 }, { unique: true });

  // Brand collections indexes
  const brandCollectionsCollection = db.collection<BrandModel>(COL_BRAND_COLLECTIONS);
  await brandCollectionsCollection.createIndex({ slug: 1 }, { unique: true });

  // Manufacturers indexes
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  await manufacturersCollection.createIndex({ slug: 1 }, { unique: true });

  // Rubrics indexes
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  await rubricsCollection.createIndex({ slug: 1 }, { unique: true });

  // Configs indexes
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  await configsCollection.createIndex({ slug: 1 }, { unique: true });

  // Products indexes
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  await productsCollection.createIndex({ slug: 1 }, { unique: true });
  await productsCollection.createIndex({
    rubricId: 1,
    selectedOptionsSlugs: 1,
    [`views.msk`]: -1,
    [`priority.msk`]: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    [`views.msk`]: -1,
    [`priority.msk`]: -1,
    _id: -1,
  });
  await productsCollection.createIndex({ slug: 1 });

  const indexes = await productsCollection.listIndexes().toArray();
  console.log(indexes);
}
