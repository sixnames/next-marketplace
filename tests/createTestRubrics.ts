import { getDatabase } from 'db/mongodb';
import { castOptionsForRubric } from 'lib/optionsUtils';
import {
  createTestRubricVariants,
  CreateTestRubricVariantsInterface,
} from './createTestRubricVariants';
import {
  AttributeModel,
  GenderModel,
  ObjectIdModel,
  RubricAttributeModel,
  RubricModel,
  TranslationModel,
} from 'db/dbModels';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  GENDER_IT,
  RUBRIC_DEFAULT_COUNTERS,
  SECONDARY_LOCALE,
} from 'config/common';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { COL_RUBRICS } from 'db/collectionNames';
import { ObjectId } from 'mongodb';

export interface CreateTestRubricsPayloadInterface extends CreateTestRubricVariantsInterface {
  rubricADefaultName: string;
  rubricAName: TranslationModel;
  rubricA: RubricModel;

  rubricBDefaultName: string;
  rubricBName: TranslationModel;
  rubricB: RubricModel;

  rubricCDefaultName: string;
  rubricCName: TranslationModel;
  rubricC: RubricModel;

  rubricDDefaultName: string;
  rubricDName: TranslationModel;
  rubricD: RubricModel;
}

export const createTestRubrics = async (): Promise<CreateTestRubricsPayloadInterface> => {
  const db = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const rubricVariantsPayload = await createTestRubricVariants();
  const {
    attributeWineCombinations,
    attributeWineVintage,
    attributeWineColor,
    attributeWineVariant,
    attributeString,
    attributeNumber,
    attributeOuterRatingA,
    attributeOuterRatingB,
    attributeOuterRatingC,
    attributesGroupOuterRating,
    attributesGroupWineFeatures,
    rubricVariantAlcohol,
  } = rubricVariantsPayload;

  function getRubricAttributes(attributes: AttributeModel[]): RubricAttributeModel[] {
    return attributes.map((attribute) => {
      const visible =
        attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
        attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT;
      return {
        ...attribute,
        showInCatalogueFilter: visible,
        showInCatalogueNav: visible,
        options: castOptionsForRubric(attribute.options),
        visibleInCatalogueCities: {},
        ...DEFAULT_COUNTERS_OBJECT,
      };
    });
  }

  interface RubricAttributesGroupsInterface {
    attributesGroupsIds: ObjectIdModel[];
    attributes: RubricAttributeModel[];
  }

  const rubricAttributesGroups: RubricAttributesGroupsInterface = {
    attributesGroupsIds: [attributesGroupOuterRating._id, attributesGroupWineFeatures._id],
    attributes: [
      ...getRubricAttributes([
        attributeWineCombinations,
        attributeWineVintage,
        attributeWineColor,
        attributeWineVariant,
        attributeString,
        attributeNumber,
      ]),
      ...getRubricAttributes([attributeOuterRatingA, attributeOuterRatingB, attributeOuterRatingC]),
    ],
  };

  const genderIt = GENDER_IT as GenderModel;

  const description = {
    [DEFAULT_LOCALE]: 'Описание',
    [SECONDARY_LOCALE]: 'description',
  };

  const rubricADefaultName = 'Вино';
  const rubricAName = {
    [DEFAULT_LOCALE]: rubricADefaultName,
    [SECONDARY_LOCALE]: 'Wine',
  };
  const rubricAId = new ObjectId();
  const rubricA: RubricModel = {
    _id: rubricAId,
    nameI18n: rubricAName,
    slug: generateDefaultLangSlug(rubricAName),
    variantId: rubricVariantAlcohol._id,
    active: true,
    descriptionI18n: description,
    shortDescriptionI18n: description,
    ...rubricAttributesGroups,
    catalogueTitle: {
      defaultTitleI18n: {
        [DEFAULT_LOCALE]: 'Купить вино',
        [SECONDARY_LOCALE]: 'Buy a wine',
      },
      prefixI18n: {
        [DEFAULT_LOCALE]: 'Купить',
        [SECONDARY_LOCALE]: 'Buy a',
      },
      keywordI18n: {
        [DEFAULT_LOCALE]: 'вино',
        [SECONDARY_LOCALE]: 'wine',
      },
      gender: genderIt,
    },
    ...DEFAULT_COUNTERS_OBJECT,
    ...RUBRIC_DEFAULT_COUNTERS,
  };

  const rubricBDefaultName = 'Шампанское и игристое';
  const rubricBName = {
    [DEFAULT_LOCALE]: rubricBDefaultName,
    [SECONDARY_LOCALE]: 'Champagne',
  };
  const rubricBId = new ObjectId();
  const rubricB: RubricModel = {
    _id: rubricBId,
    nameI18n: rubricBName,
    slug: generateDefaultLangSlug(rubricBName),
    variantId: rubricVariantAlcohol._id,
    active: true,
    ...rubricAttributesGroups,
    descriptionI18n: {
      [DEFAULT_LOCALE]: 'Описание',
      [SECONDARY_LOCALE]: 'description',
    },
    shortDescriptionI18n: {
      [DEFAULT_LOCALE]: 'Описание',
      [SECONDARY_LOCALE]: 'description',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        [DEFAULT_LOCALE]: 'Купить шампанское',
        [SECONDARY_LOCALE]: 'Buy a champagne',
      },
      prefixI18n: {
        [DEFAULT_LOCALE]: 'Купить',
        [SECONDARY_LOCALE]: 'Buy a',
      },
      keywordI18n: {
        [DEFAULT_LOCALE]: 'шампанское',
        [SECONDARY_LOCALE]: 'champagne',
      },
      gender: genderIt,
    },
    ...DEFAULT_COUNTERS_OBJECT,
    ...RUBRIC_DEFAULT_COUNTERS,
  };

  const rubricCDefaultName = 'Виски';
  const rubricCName = {
    [DEFAULT_LOCALE]: rubricCDefaultName,
    [SECONDARY_LOCALE]: 'Whiskey',
  };
  const rubricCId = new ObjectId();
  const rubricC: RubricModel = {
    _id: rubricCId,
    nameI18n: rubricCName,
    slug: generateDefaultLangSlug(rubricCName),
    variantId: rubricVariantAlcohol._id,
    active: true,
    descriptionI18n: description,
    shortDescriptionI18n: description,
    ...rubricAttributesGroups,
    catalogueTitle: {
      defaultTitleI18n: {
        [DEFAULT_LOCALE]: 'Купить Виски',
        [SECONDARY_LOCALE]: 'Buy a Whiskey',
      },
      prefixI18n: {
        [DEFAULT_LOCALE]: 'Купить',
        [SECONDARY_LOCALE]: 'Buy a',
      },
      keywordI18n: {
        [DEFAULT_LOCALE]: 'Виски',
        [SECONDARY_LOCALE]: 'Whiskey',
      },
      gender: genderIt,
    },
    ...DEFAULT_COUNTERS_OBJECT,
    ...RUBRIC_DEFAULT_COUNTERS,
  };

  const rubricDDefaultName = 'Коньяк';
  const rubricDName = {
    [DEFAULT_LOCALE]: rubricDDefaultName,
    [SECONDARY_LOCALE]: 'Cognac',
  };
  const rubricDId = new ObjectId();
  const rubricD: RubricModel = {
    _id: rubricDId,
    nameI18n: rubricDName,
    slug: generateDefaultLangSlug(rubricDName),
    variantId: rubricVariantAlcohol._id,
    active: true,
    descriptionI18n: description,
    shortDescriptionI18n: description,
    ...rubricAttributesGroups,
    catalogueTitle: {
      defaultTitleI18n: {
        [DEFAULT_LOCALE]: 'Купить коньяк',
        [SECONDARY_LOCALE]: 'Buy a cognac',
      },
      prefixI18n: {
        [DEFAULT_LOCALE]: 'Купить',
        [SECONDARY_LOCALE]: 'Buy a',
      },
      keywordI18n: {
        [DEFAULT_LOCALE]: 'коньяк',
        [SECONDARY_LOCALE]: 'cognac',
      },
      gender: genderIt,
    },
    ...DEFAULT_COUNTERS_OBJECT,
    ...RUBRIC_DEFAULT_COUNTERS,
  };

  await rubricsCollection.insertMany([rubricA, rubricB, rubricC, rubricD]);

  return {
    ...rubricVariantsPayload,
    rubricADefaultName,
    rubricAName,
    rubricA,

    rubricBDefaultName,
    rubricBName,
    rubricB,

    rubricCDefaultName,
    rubricCName,
    rubricC,

    rubricDDefaultName,
    rubricDName,
    rubricD,
  };
};
