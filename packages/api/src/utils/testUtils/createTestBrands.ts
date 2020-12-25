import { createTestRubrics, CreateTestRubricsPayloadInterface } from './createTestRubrics';
import { Brand, BrandModel } from '../../entities/Brand';
import faker from 'faker';
import { BrandCollection, BrandCollectionModel } from '../../entities/BrandCollection';
import { Manufacturer, ManufacturerModel } from '../../entities/Manufacturer';
import { generateSlug } from '../slug';

export interface GetFakeBrandPayloadInterface {
  brand: Brand;
  brandCollection: BrandCollection;
}

export async function getFakeBrand(): Promise<GetFakeBrandPayloadInterface> {
  const brandCollectionName = faker.commerce.productName();
  const brandCollection = await BrandCollectionModel.create({
    nameString: brandCollectionName,
    slug: generateSlug(brandCollectionName),
    description: faker.lorem.paragraph(),
  });

  const brandName = faker.company.companyName();
  const brand = await BrandModel.create({
    nameString: brandName,
    slug: generateSlug(brandName),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
    collections: [brandCollection.id],
  });

  return {
    brand,
    brandCollection,
  };
}

export async function getFakeManufacturer(): Promise<Manufacturer> {
  const manufacturerName = faker.company.companyName();
  return ManufacturerModel.create({
    nameString: manufacturerName,
    slug: generateSlug(manufacturerName),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
  });
}

export interface CreateTestBrandsPayloadInterface extends CreateTestRubricsPayloadInterface {
  brandA: Brand;
  brandB: Brand;
  brandC: Brand;
  allBrands: Brand[];
  brandCollectionA: BrandCollection;
  brandCollectionB: BrandCollection;
  brandCollectionC: BrandCollection;
  allBrandCollections: BrandCollection[];
  manufacturerA: Manufacturer;
  manufacturerB: Manufacturer;
  manufacturerC: Manufacturer;
}

export async function createTestBrands(): Promise<CreateTestBrandsPayloadInterface> {
  const rubricsPayload = await createTestRubrics();

  // Brand A
  const { brandCollection: brandCollectionA, brand: brandA } = await getFakeBrand();

  // Brand B
  const { brandCollection: brandCollectionB, brand: brandB } = await getFakeBrand();

  // Brand C
  const { brandCollection: brandCollectionC, brand: brandC } = await getFakeBrand();

  // Manufacturer A
  const manufacturerA = await getFakeManufacturer();

  // Manufacturer B
  const manufacturerB = await getFakeManufacturer();

  // Manufacturer C
  const manufacturerC = await getFakeManufacturer();

  const allBrands = [brandA, brandB, brandC];
  const allBrandCollections = [brandCollectionA, brandCollectionB, brandCollectionC];

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
    ...rubricsPayload,
  };
}
