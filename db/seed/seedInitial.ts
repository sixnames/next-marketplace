import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  OPTIONS_GROUP_VARIANT_TEXT,
  RUBRIC_LEVEL_ONE,
} from 'config/common';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_OPTIONS_GROUPS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  AttributeModel,
  AttributesGroupModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
  BrandCollectionModel,
  BrandModel,
  GenderModel,
  ManufacturerModel,
  OptionModel,
  OptionsGroupModel,
  OptionsGroupVariantModel,
  RubricAttributesGroupModel,
  RubricModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  ParsedAttributesGroupInterface,
  ParsedBrandInterface,
  ParsedManufacturerInterface,
  ParsedOptionsGroupInterface,
  ParsedRubricInterface,
} from 'db/parsedDataModels';
import optionsData from 'db/seedData/optionsGroups.json';
import attributesData from 'db/seedData/attributesGroups.json';
import brandCollectionsData from 'db/seedData/brandCollections.json';
import brandsData from 'db/seedData/brands.json';
import manufacturersData from 'db/seedData/manufacturers.json';
import rubricsData from 'db/seedData/rubrics.json';
import { getNextItemId } from 'lib/itemIdUtils';
import { ObjectId } from 'mongodb';

export const seedInitial = async () => {
  try {
    const db = await getDatabase();

    // Options
    const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
    const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
    const insertedOptionsGroups: OptionsGroupModel[] = [];

    for await (const optionsGroupItem of optionsData) {
      const optionsGroup: ParsedOptionsGroupInterface = optionsGroupItem;
      const castedOptions = optionsGroup.options.map((option) => {
        return {
          nameI18n: {
            [DEFAULT_LOCALE]: option.name,
          },
          slug: option.slug,
          ...DEFAULT_COUNTERS_OBJECT,
        };
      });

      const insertedOptions = await optionsCollection.insertMany(castedOptions);

      const insertedOptionsGroupResult = await optionsGroupsCollection.insertOne({
        variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
        optionsIds: Object.values(insertedOptions.insertedIds),
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
          optionsIds: currentOptionsGroup?.optionsIds || [],
          nameI18n: {
            [DEFAULT_LOCALE]: attribute.attributeName,
          },
          ...DEFAULT_COUNTERS_OBJECT,
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

    // Rubrics
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    for await (const rubric of rubricsData) {
      const initialRubric: ParsedRubricInterface = rubric;
      const attributesGroups = insertedAttributesGroups.filter(({ nameI18n }) => {
        return initialRubric.attributesGroupNames.includes(nameI18n[DEFAULT_LOCALE]);
      });

      const excludedRubricCatalogueAttributes = [
        'Пиво',
        'Состав',
        'Вид',
        'Температура сервировки',
        'Содержание хмеля',
        'Температура ферментации',
        'Страна производства',
        'Регион',
        'Капсула',
        'Игристое вино/шампанское',
        'Биодинамическое',
        'Органическое',
        'Самый старый спирт',
        'Добавки',
        'Сырье',
        'Основа',
        'Дистилляция',
        'Выдержка в бочках',
      ];
      const rubricAttributesGroups: RubricAttributesGroupModel[] = [];
      for await (const attributesGroup of attributesGroups) {
        const { _id, attributesIds } = attributesGroup;
        const filterAttributes = await attributesCollection
          .find({
            _id: { $in: attributesIds },
            [`nameI18n.${DEFAULT_LOCALE}`]: {
              $nin: excludedRubricCatalogueAttributes,
            },
            $or: [
              { variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel },
              { variant: ATTRIBUTE_VARIANT_MULTIPLE_SELECT as AttributeVariantModel },
            ],
          })
          .toArray();

        const selectAttributesIds = filterAttributes.map(({ _id }) => _id);
        rubricAttributesGroups.push({
          _id: new ObjectId(),
          showInCatalogueFilter: selectAttributesIds,
          attributesGroupId: _id,
          isOwner: true,
        });
      }

      const rubricName = {
        [DEFAULT_LOCALE]: initialRubric.name,
      };

      await rubricsCollection.insertOne({
        active: true,
        level: RUBRIC_LEVEL_ONE,
        slug: initialRubric.slug,
        attributesGroups: rubricAttributesGroups,
        variantId: rubricVariantAlcohol.ops[0]._id,
        nameI18n: rubricName,
        catalogueTitle: {
          gender: initialRubric.gender as GenderModel,
          defaultTitleI18n: rubricName,
          keywordI18n: rubricName,
        },
        descriptionI18n: {
          [DEFAULT_LOCALE]: '',
        },
        shortDescriptionI18n: {
          [DEFAULT_LOCALE]: '',
        },
        ...DEFAULT_COUNTERS_OBJECT,
      });
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
