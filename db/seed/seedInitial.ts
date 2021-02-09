import { DEFAULT_LOCALE, OPTIONS_GROUP_VARIANT_TEXT } from 'config/common';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_OPTIONS_GROUPS,
  COL_RUBRIC_VARIANTS,
} from 'db/collectionNames';
import {
  AttributeModel,
  AttributesGroupModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
  OptionModel,
  OptionsGroupModel,
  OptionsGroupVariantModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  ParsedAttributesGroupInterface,
  ParsedBrandInterface,
  ParsedManufacturerInterface,
  ParsedOptionsGroupInterface,
} from 'db/parsedDataModels';
import optionsData from 'db/seedData/optionsGroups.json';
import attributesData from 'db/seedData/attributesGroups.json';
import brandCollectionsData from 'db/seedData/brandCollections.json';
import brandsData from 'db/seedData/brands.json';
import manufacturersData from 'db/seedData/manufacturers.json';
import { getNextItemId } from 'lib/itemIdUtils';
import { ObjectId } from 'mongodb';

export const seedInitial = async () => {
  try {
    const db = await getDatabase();

    // Options
    const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
    const insertedOptionsGroups: OptionsGroupModel[] = [];

    for await (const optionsGroupItem of optionsData) {
      const optionsGroup: ParsedOptionsGroupInterface = optionsGroupItem;
      const castedOptions: OptionModel[] = optionsGroup.options.map((option) => {
        return {
          _id: new ObjectId(),
          nameI18n: {
            [DEFAULT_LOCALE]: option.name,
          },
          slug: option.slug,
          options: [],
          variants: {},
        };
      });

      const insertedOptionsGroupResult = await optionsGroupsCollection.insertOne({
        variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
        options: castedOptions,
        nameI18n: {
          [DEFAULT_LOCALE]: optionsGroup.name,
        },
      });
      insertedOptionsGroups.push(insertedOptionsGroupResult.ops[0]);
    }

    // Attributes
    const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
    const insertedAttributesGroups: AttributesGroupModel[] = [];

    for await (const attributesGroupItem of attributesData) {
      const attributesGroup: ParsedAttributesGroupInterface = attributesGroupItem;

      const castedAttributes: AttributeModel[] = attributesGroup.attributes.map((attribute) => {
        const currentOptionsGroup = insertedOptionsGroups.find(({ nameI18n }) => {
          return nameI18n[DEFAULT_LOCALE] === attribute.attributeName;
        });

        return {
          _id: new ObjectId(),
          slug: attribute.attributeSlug,
          variant: attribute.variant as AttributeVariantModel,
          viewVariant: attribute.viewVariant as AttributeViewVariantModel,
          optionsGroupId: currentOptionsGroup?._id || null,
          options: currentOptionsGroup?.options || [],
          nameI18n: {
            [DEFAULT_LOCALE]: attribute.attributeName,
          },
        };
      });

      let insertedAttributes: AttributeModel[] = [];
      if (castedAttributes.length > 0) {
        const insertedAttributesResult = await attributesCollection.insertMany(castedAttributes);
        insertedAttributes = insertedAttributesResult.ops;
      }

      const insertedAttributesIds = insertedAttributes.map(({ _id }) => _id);

      const insertedAttributesGroupResult = await attributesGroupsCollection.insertOne({
        attributesIds: insertedAttributesIds,
        nameI18n: {
          [DEFAULT_LOCALE]: attributesGroup.name,
        },
      });
      insertedAttributesGroups.push(insertedAttributesGroupResult.ops[0]);
    }

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
