import { getDatabase } from 'db/mongodb';
import { ObjectId } from 'mongodb';
import { createTestRubrics, CreateTestRubricsPayloadInterface } from './createTestRubrics';
import { BrandCollectionModel, BrandModel, ManufacturerModel } from 'db/dbModels';
import { COL_BRAND_COLLECTIONS, COL_BRANDS, COL_MANUFACTURERS } from 'db/collectionNames';
import { generateSlug } from 'lib/slugUtils';
import { setCollectionItemId } from 'lib/itemIdUtils';
import { DEFAULT_COUNTERS_OBJECT, DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';

export interface GetFakeBrandInterface {
  itemId: string;
  brandCollectionName: string;
  brandName: string;
  brandConnectionIdString: string;
  brandIdString: string;
}

export interface GetFakeBrandPayloadInterface {
  brand: BrandModel;
  brandCollection: BrandCollectionModel;
}

export async function getFakeBrand({
  itemId,
  brandCollectionName,
  brandName,
  brandConnectionIdString,
  brandIdString,
}: GetFakeBrandInterface): Promise<GetFakeBrandPayloadInterface> {
  const brandId = new ObjectId(brandIdString);
  const brandSlug = generateSlug(brandName);
  const brand: BrandModel = {
    _id: brandId,
    itemId,
    nameI18n: {
      [DEFAULT_LOCALE]: brandName,
      [SECONDARY_LOCALE]: brandName,
    },
    slug: brandSlug,
    url: [`https://${brandName}.com`],
    descriptionI18n: {
      [DEFAULT_LOCALE]: 'Описание',
      [SECONDARY_LOCALE]: 'description',
    },
    ...DEFAULT_COUNTERS_OBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const brandCollectionId = new ObjectId(brandConnectionIdString);
  const brandCollection: BrandCollectionModel = {
    _id: brandCollectionId,
    itemId,
    brandId,
    brandSlug,
    nameI18n: {
      [DEFAULT_LOCALE]: brandCollectionName,
      [SECONDARY_LOCALE]: brandCollectionName,
    },
    slug: generateSlug(brandCollectionName),
    descriptionI18n: {
      [DEFAULT_LOCALE]: 'Описание',
      [SECONDARY_LOCALE]: 'description',
    },
    ...DEFAULT_COUNTERS_OBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    brand,
    brandCollection,
  };
}

interface GetFakeManufacturerInterface {
  idString: string;
  itemId: string;
  manufacturerName: string;
}

export async function getFakeManufacturer({
  itemId,
  manufacturerName,
  idString,
}: GetFakeManufacturerInterface): Promise<ManufacturerModel> {
  return {
    _id: new ObjectId(idString),
    itemId,
    nameI18n: {
      [DEFAULT_LOCALE]: manufacturerName,
      [SECONDARY_LOCALE]: manufacturerName,
    },
    slug: generateSlug(manufacturerName),
    url: [`https://${manufacturerName}.com`],
    descriptionI18n: {
      [DEFAULT_LOCALE]: 'Описание',
      [SECONDARY_LOCALE]: 'description',
    },
    ...DEFAULT_COUNTERS_OBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export interface CreateTestBrandsPayloadInterface extends CreateTestRubricsPayloadInterface {
  brandA: BrandModel;
  brandB: BrandModel;
  brandC: BrandModel;
  allBrands: BrandModel[];
  brandCollectionA: BrandCollectionModel;
  brandCollectionB: BrandCollectionModel;
  brandCollectionC: BrandCollectionModel;
  allBrandCollections: BrandCollectionModel[];
  manufacturerA: ManufacturerModel;
  manufacturerB: ManufacturerModel;
  manufacturerC: ManufacturerModel;
  allManufacturers: ManufacturerModel[];
}

export async function createTestBrands(): Promise<CreateTestBrandsPayloadInterface> {
  const db = await getDatabase();
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);

  const rubricsPayload = await createTestRubrics();

  // Brand A
  const { brandCollection: brandCollectionA, brand: brandA } = await getFakeBrand({
    brandIdString: '604cad83b604c1c320c32893',
    brandConnectionIdString: '604cad83b604c1c320c32892',
    itemId: '1',
    brandName: 'brandA',
    brandCollectionName: 'brandCollectionA',
  });

  // Brand B
  const { brandCollection: brandCollectionB, brand: brandB } = await getFakeBrand({
    brandIdString: '604cad83b604c1c320c32895',
    brandConnectionIdString: '604cad83b604c1c320c32894',
    itemId: '2',
    brandName: 'brandB',
    brandCollectionName: 'brandCollectionB',
  });

  // Brand C
  const { brandCollection: brandCollectionC, brand: brandC } = await getFakeBrand({
    brandIdString: '604cad83b604c1c320c32897',
    brandConnectionIdString: '604cad83b604c1c320c32896',
    itemId: '3',
    brandName: 'brandC',
    brandCollectionName: 'brandCollectionC',
  });

  // Manufacturer A
  const manufacturerA = await getFakeManufacturer({
    idString: '604cad83b604c1c320c32898',
    itemId: '1',
    manufacturerName: 'manufacturerA',
  });

  // Manufacturer B
  const manufacturerB = await getFakeManufacturer({
    idString: '604cad83b604c1c320c32899',
    itemId: '2',
    manufacturerName: 'manufacturerB',
  });

  // Manufacturer C
  const manufacturerC = await getFakeManufacturer({
    idString: '604cad83b604c1c320c3289a',
    itemId: '3',
    manufacturerName: 'manufacturerC',
  });

  const allBrands = [brandA, brandB, brandC];
  const allBrandCollections = [brandCollectionA, brandCollectionB, brandCollectionC];
  const allManufacturers = [manufacturerA, manufacturerB, manufacturerC];

  // Set itemId counters
  await setCollectionItemId(COL_BRAND_COLLECTIONS, 3);
  await setCollectionItemId(COL_BRANDS, 3);
  await setCollectionItemId(COL_MANUFACTURERS, 3);

  // Insert all
  await brandsCollection.insertMany([brandA, brandB, brandC]);
  await brandCollectionsCollection.insertMany([
    brandCollectionA,
    brandCollectionB,
    brandCollectionC,
  ]);
  await manufacturersCollection.insertMany([manufacturerA, manufacturerB, manufacturerC]);

  return {
    brandA,
    brandB,
    brandC,
    allBrands,
    brandCollectionA,
    brandCollectionB,
    brandCollectionC,
    allBrandCollections,
    manufacturerA,
    manufacturerB,
    manufacturerC,
    allManufacturers,
    ...rubricsPayload,
  };
}
