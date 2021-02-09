import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  RUBRIC_DEFAULT_COUNTERS,
} from 'config/common';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  AttributeModel,
  AttributesGroupModel,
  GenderModel,
  ObjectIdModel,
  RubricAttributeModel,
  RubricModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ParsedRubricInterface } from 'db/parsedDataModels';
import rubricsData from 'db/seedData/rubrics.json';
import { castOptionsForRubric } from 'lib/optionsUtils';
import { recalculateRubricProductCounters } from 'lib/rubricUtils';

export const seedRubrics = async () => {
  const db = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
  const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

  const rubricVariantAlcohol = await rubricVariantsCollection.findOne({
    [`nameI18n.${DEFAULT_LOCALE}`]: 'Алкоголь',
  });

  if (!rubricVariantAlcohol) {
    console.log('rubricVariantAlcohol not found');
    return false;
  }

  const insertedAttributesGroups = await attributesGroupsCollection.find({}).toArray();

  for await (const rubric of rubricsData) {
    const initialRubric: ParsedRubricInterface = rubric;
    console.log(`Creating rubric ${initialRubric.name} ${new Date().toISOString()}`);

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
    const rubricAttributes: RubricAttributeModel[] = [];
    const attributesGroupsIds: ObjectIdModel[] = [];
    for await (const attributesGroup of attributesGroups) {
      const { attributesIds } = attributesGroup;
      attributesGroupsIds.push(attributesGroup._id);

      const groupAttributes = await attributesCollection
        .find({
          _id: { $in: attributesIds },
        })
        .toArray();

      groupAttributes.forEach((attribute) => {
        const visible =
          (attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
            attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) &&
          !excludedRubricCatalogueAttributes.includes(attribute.nameI18n[DEFAULT_LOCALE]);

        rubricAttributes.push({
          ...attribute,
          showInCatalogueNav: visible,
          showInCatalogueFilter: visible,
          options: castOptionsForRubric(attribute.options),
          visibleInCatalogueCities: {},
          ...DEFAULT_COUNTERS_OBJECT,
        });
      });
    }

    const rubricName = {
      [DEFAULT_LOCALE]: initialRubric.name,
    };

    const createdRubricResult = await rubricsCollection.insertOne({
      active: true,
      slug: initialRubric.slug,
      attributesGroupsIds,
      attributes: rubricAttributes,
      variantId: rubricVariantAlcohol._id,
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
      ...RUBRIC_DEFAULT_COUNTERS,
    });
    console.log(`Rubric created ${initialRubric.name} ${new Date().toISOString()}`);
    console.log(createdRubricResult.ops[0]._id);

    if (createdRubricResult.result.ok && createdRubricResult.ops[0]) {
      console.log(`Recalculating ${initialRubric.name} rubric ${new Date().toISOString()}`);
      await recalculateRubricProductCounters({ rubricId: createdRubricResult.ops[0]._id });
      console.log(
        `${initialRubric.name} rubric recalculation finished at ${new Date().toISOString()}`,
      );
    }
    console.log(' ');
    console.log(' ');
  }

  return true;
};
