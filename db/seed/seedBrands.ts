import { DEFAULT_LOCALE } from 'config/common';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_RUBRIC_VARIANTS,
} from 'db/collectionNames';
import {
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ParsedBrandInterface, ParsedManufacturerInterface } from 'db/parsedDataModels';
import brandCollectionsData from 'db/seedData/brandCollections.json';
import brandsData from 'db/seedData/brands.json';
import manufacturersData from 'db/seedData/manufacturers.json';
import { getNextItemId } from 'lib/itemIdUtils';
import { ObjectId } from 'mongodb';

export const seedBrands = async () => {
  try {
    const db = await getDatabase();

    // Brand collections
    const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
    const castedBrandCollections: BrandCollectionModel[] = [];
    for await (const collection of brandCollectionsData) {
      const itemId = await getNextItemId(COL_BRAND_COLLECTIONS);
      castedBrandCollections.push({
        _id: new ObjectId(),
        itemId,
        slug: collection.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
        nameI18n: {
          [DEFAULT_LOCALE]: collection.name,
        },
      });
    }

    const createdBrandCollectionsResult = await brandCollectionsCollection.insertMany(
      castedBrandCollections,
    );
    const createdBrandCollections = createdBrandCollectionsResult.ops;

    // Brands
    const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
    for await (const brand of brandsData) {
      const initialBrand: ParsedBrandInterface = brand;
      const collectionsIds = createdBrandCollections
        .filter(({ nameI18n }) => {
          return initialBrand.collections.includes(nameI18n[DEFAULT_LOCALE]);
        })
        .map(({ _id }) => _id);
      const itemId = await getNextItemId(COL_BRANDS);

      await brandsCollection.insertOne({
        itemId,
        collectionsIds,
        slug: initialBrand.slug,
        url: initialBrand.url,
        createdAt: new Date(),
        updatedAt: new Date(),
        nameI18n: {
          [DEFAULT_LOCALE]: initialBrand.name,
        },
      });
    }

    // Manufacturers
    const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
    const initialManufacturersData = manufacturersData as ParsedManufacturerInterface[];
    for await (const manufacturer of initialManufacturersData) {
      const initialManufacturer: ParsedManufacturerInterface = manufacturer;
      const itemId = await getNextItemId(COL_MANUFACTURERS);

      await manufacturersCollection.insertOne({
        itemId,
        slug: initialManufacturer.slug,
        url: initialManufacturer.url,
        createdAt: new Date(),
        updatedAt: new Date(),
        descriptionI18n: initialManufacturer.description
          ? {
              [DEFAULT_LOCALE]: initialManufacturer.description,
            }
          : null,
        nameI18n: {
          [DEFAULT_LOCALE]: initialManufacturer.name,
        },
      });
    }

    // Rubric variants
    const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
    const rubricVariantAlcohol = await rubricVariantsCollection.insertOne({
      nameI18n: {
        [DEFAULT_LOCALE]: 'Алкоголь',
      },
    });

    if (!rubricVariantAlcohol.result.ok) {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
