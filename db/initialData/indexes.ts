#!/usr/bin/env ts-node-script

import { Db } from 'mongodb';
import {
  BrandModel,
  CityModel,
  ConfigModel,
  ManufacturerModel,
  ProductModel,
  RubricModel,
} from '../dbModels';
import { getDatabase } from '../mongodb';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CITIES,
  COL_CONFIGS,
  COL_ID_COUNTERS,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from '../collectionNames';
require('dotenv').config();

async function updateCollectionItemId(collectionName: string, db: Db) {
  const entityCollection = db.collection(collectionName);
  const idCountersCollection = db.collection(COL_ID_COUNTERS);
  const counter = await entityCollection.countDocuments();

  await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $set: {
        counter: counter,
      },
    },
    {
      upsert: true,
    },
  );
}

async function createIndexes() {
  const db = await getDatabase();

  console.log('Updating itemId counters');
  const itemIdCollections = [COL_BRAND_COLLECTIONS, COL_BRANDS, COL_MANUFACTURERS, COL_PRODUCTS];
  for await (const collectionName of itemIdCollections) {
    await updateCollectionItemId(collectionName, db);
  }

  console.log('Creating indexes');

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

  // Cities indexes
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  const cities = await citiesCollection.find({}).toArray();
  for await (const city of cities) {
    // Brands
    await brandsCollection.createIndex({
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    // Brand collections
    await brandCollectionsCollection.createIndex({
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    // Manufacturers
    await manufacturersCollection.createIndex({
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    // Products
    await productsCollection.createIndex({
      rubricId: 1,
      [`minPriceCities.${city.slug}`]: 1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      selectedOptionsSlugs: 1,
      [`minPriceCities.${city.slug}`]: 1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      selectedOptionsSlugs: 1,
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });
  }

  return;
}

(() => {
  createIndexes()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
  return;
})();
