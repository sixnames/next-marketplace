import { getDatabase } from 'db/mongodb';
import {
  createTestRubricVariants,
  CreateTestRubricVariantsInterface,
} from './createTestRubricVariants';
import {
  GenderModel,
  RubricAttributesGroupModel,
  RubricModel,
  TranslationModel,
} from 'db/dbModels';
import {
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  GENDER_IT,
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
    attributeWineColor,
    attributeWineVariant,
    attributesGroupOuterRating,
    attributesGroupWineFeatures,
    rubricVariantAlcohol,
  } = rubricVariantsPayload;

  const rubricAttributesGroups = (): RubricAttributesGroupModel[] => [
    {
      _id: new ObjectId(),
      showInCatalogueFilter: [attributeWineColor._id, attributeWineVariant._id],
      attributesGroupId: attributesGroupWineFeatures._id,
    },
    {
      _id: new ObjectId(),
      showInCatalogueFilter: [],
      attributesGroupId: attributesGroupOuterRating._id,
    },
  ];

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
  const rubricLevelOneAId = new ObjectId();
  const rubricA: RubricModel = {
    _id: rubricLevelOneAId,
    nameI18n: rubricAName,
    slug: generateDefaultLangSlug(rubricAName),
    variantId: rubricVariantAlcohol._id,
    attributesGroups: rubricAttributesGroups(),
    active: true,
    descriptionI18n: description,
    shortDescriptionI18n: description,
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
  };

  const rubricBDefaultName = 'Шампанское и игристое';
  const rubricBName = {
    [DEFAULT_LOCALE]: rubricBDefaultName,
    [SECONDARY_LOCALE]: 'Champagne',
  };
  const rubricLevelOneBId = new ObjectId();
  const rubricB: RubricModel = {
    _id: rubricLevelOneBId,
    nameI18n: rubricBName,
    slug: generateDefaultLangSlug(rubricBName),
    variantId: rubricVariantAlcohol._id,
    attributesGroups: rubricAttributesGroups(),
    active: true,
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
  };

  const rubricCDefaultName = 'Виски';
  const rubricCName = {
    [DEFAULT_LOCALE]: rubricCDefaultName,
    [SECONDARY_LOCALE]: 'Whiskey',
  };
  const rubricLevelOneCId = new ObjectId();
  const rubricC: RubricModel = {
    _id: rubricLevelOneCId,
    nameI18n: rubricCName,
    slug: generateDefaultLangSlug(rubricCName),
    variantId: rubricVariantAlcohol._id,
    attributesGroups: rubricAttributesGroups(),
    active: true,
    descriptionI18n: description,
    shortDescriptionI18n: description,
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
  };

  const rubricDDefaultName = 'Коньяк';
  const rubricDName = {
    [DEFAULT_LOCALE]: rubricDDefaultName,
    [SECONDARY_LOCALE]: 'Cognac',
  };
  const rubricLevelOneDId = new ObjectId();
  const rubricD: RubricModel = {
    _id: rubricLevelOneDId,
    nameI18n: rubricDName,
    slug: generateDefaultLangSlug(rubricDName),
    variantId: rubricVariantAlcohol._id,
    attributesGroups: rubricAttributesGroups(),
    active: true,
    descriptionI18n: description,
    shortDescriptionI18n: description,
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
