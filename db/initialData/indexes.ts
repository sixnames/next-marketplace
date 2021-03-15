#!/usr/bin/env ts-node-script

import { Db } from 'mongodb';
import {
  BrandModel,
  CityModel,
  CompanyModel,
  ConfigModel,
  CountryModel,
  LanguageModel,
  ManufacturerModel,
  ProductModel,
  RubricModel,
  ShopProductModel,
} from '../dbModels';
import { getDatabase } from '../mongodb';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CITIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_COUNTRIES,
  COL_ID_COUNTERS,
  COL_LANGUAGES,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
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

  // Brands
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  await brandsCollection.createIndex({ slug: 1 }, { unique: true });

  // Brand collections
  const brandCollectionsCollection = db.collection<BrandModel>(COL_BRAND_COLLECTIONS);
  await brandCollectionsCollection.createIndex({ slug: 1 }, { unique: true });

  // Manufacturers
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  await manufacturersCollection.createIndex({ slug: 1 }, { unique: true });

  // Rubrics
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  await rubricsCollection.createIndex({ slug: 1 }, { unique: true });

  // Configs
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  await configsCollection.createIndex({ slug: 1 }, { unique: true });
  await configsCollection.createIndex({ index: 1 });

  // Languages
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  await languagesCollection.createIndex({ itemId: 1 }, { unique: true });

  // Cities
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  await citiesCollection.createIndex({ itemId: 1 }, { unique: true });

  // Countries
  const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
  await countriesCollection.createIndex({ citiesIds: 1 });

  // Companies
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  await companiesCollection.createIndex({ shopsIds: 1 });

  // Shop products
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  await shopProductsCollection.createIndex({ slug: 1 }, { unique: true });
  await shopProductsCollection.createIndex({
    _id: 1,
    citySlug: 1,
  });
  await shopProductsCollection.createIndex({
    productId: 1,
  });
  await shopProductsCollection.createIndex({
    productId: 1,
    citySlug: 1,
  });
  await shopProductsCollection.createIndex({
    companyId: 1,
  });

  // Products
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  await productsCollection.createIndex({ slug: 1 }, { unique: true });
  await productsCollection.createIndex({
    rubricId: 1,
  });
  await productsCollection.createIndex({
    'attributes.attributeId': 1,
  });

  // Cities
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

    // Rubrics cities
    await rubricsCollection.createIndex({
      activeProductsCount: 1,
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
    });

    // Products catalogue

    // views / priority sort
    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      brandSlug: 1,
      brandCollectionSlug: 1,
      manufacturerSlug: 1,
      selectedOptionsSlugs: 1,
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      brandCollectionSlug: 1,
      manufacturerSlug: 1,
      selectedOptionsSlugs: 1,
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      manufacturerSlug: 1,
      selectedOptionsSlugs: 1,
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      selectedOptionsSlugs: 1,
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      [`views.${city.slug}`]: -1,
      [`priority.${city.slug}`]: -1,
      _id: -1,
    });

    // minPrice sort
    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      brandSlug: 1,
      brandCollectionSlug: 1,
      manufacturerSlug: 1,
      selectedOptionsSlugs: 1,
      [`minPriceCities.${city.slug}`]: 1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      brandCollectionSlug: 1,
      manufacturerSlug: 1,
      selectedOptionsSlugs: 1,
      [`minPriceCities.${city.slug}`]: 1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      manufacturerSlug: 1,
      selectedOptionsSlugs: 1,
      [`minPriceCities.${city.slug}`]: 1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      selectedOptionsSlugs: 1,
      [`minPriceCities.${city.slug}`]: 1,
      _id: -1,
    });

    await productsCollection.createIndex({
      rubricId: 1,
      active: 1,
      [`minPriceCities.${city.slug}`]: 1,
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
