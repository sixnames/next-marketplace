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
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_TWO,
  SECONDARY_LOCALE,
} from 'config/common';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { COL_RUBRICS } from 'db/collectionNames';
import { ObjectId } from 'mongodb';

export interface CreateTestRubricsPayloadInterface extends CreateTestRubricVariantsInterface {
  rubricLevelOneADefaultName: string;
  rubricLevelOneAName: TranslationModel;
  rubricLevelOneA: RubricModel;

  rubricLevelOneBDefaultName: string;
  rubricLevelOneBName: TranslationModel;
  rubricLevelOneB: RubricModel;

  rubricLevelOneCDefaultName: string;
  rubricLevelOneCName: TranslationModel;
  rubricLevelOneC: RubricModel;

  rubricLevelOneDDefaultName: string;
  rubricLevelOneDName: TranslationModel;
  rubricLevelOneD: RubricModel;

  rubricLevelTwoADefaultName: string;
  rubricLevelTwoAName: TranslationModel;
  rubricLevelTwoA: RubricModel;

  rubricLevelTwoBDefaultName: string;
  rubricLevelTwoBName: TranslationModel;
  rubricLevelTwoB: RubricModel;
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
    attributesGroupWhiskeyFeatures,
    rubricVariantAlcohol,
  } = rubricVariantsPayload;

  const rubricAttributesGroups = (isOwner: boolean): RubricAttributesGroupModel[] => [
    {
      _id: new ObjectId(),
      showInCatalogueFilter: [attributeWineColor._id, attributeWineVariant._id],
      attributesGroupId: attributesGroupWineFeatures._id,
      isOwner,
    },
    {
      _id: new ObjectId(),
      showInCatalogueFilter: [],
      attributesGroupId: attributesGroupOuterRating._id,
      isOwner,
    },
  ];

  const rubricAttributesGroupsB = (isOwner: boolean): RubricAttributesGroupModel[] => [
    {
      _id: new ObjectId(),
      showInCatalogueFilter: [],
      attributesGroupId: attributesGroupWhiskeyFeatures._id,
      isOwner,
    },
    {
      _id: new ObjectId(),
      showInCatalogueFilter: [],
      attributesGroupId: attributesGroupOuterRating._id,
      isOwner,
    },
  ];

  const genderHe = GENDER_HE as GenderModel;
  const genderShe = GENDER_SHE as GenderModel;
  const genderIt = GENDER_IT as GenderModel;

  const description = {
    [DEFAULT_LOCALE]: 'Описание',
    [SECONDARY_LOCALE]: 'description',
  };

  const rubricLevelOneADefaultName = 'Вино';
  const rubricLevelOneAName = {
    [DEFAULT_LOCALE]: rubricLevelOneADefaultName,
    [SECONDARY_LOCALE]: 'Wine',
  };
  const rubricLevelOneAId = new ObjectId();
  const rubricLevelOneA: RubricModel = {
    _id: rubricLevelOneAId,
    nameI18n: rubricLevelOneAName,
    level: RUBRIC_LEVEL_ONE,
    parentId: null,
    slug: generateDefaultLangSlug(rubricLevelOneAName),
    variantId: rubricVariantAlcohol._id,
    attributesGroups: rubricAttributesGroups(true),
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

  const rubricLevelOneBDefaultName = 'Шампанское и игристое';
  const rubricLevelOneBName = {
    [DEFAULT_LOCALE]: rubricLevelOneBDefaultName,
    [SECONDARY_LOCALE]: 'Champagne',
  };
  const rubricLevelOneBId = new ObjectId();
  const rubricLevelOneB: RubricModel = {
    _id: rubricLevelOneBId,
    nameI18n: rubricLevelOneBName,
    level: RUBRIC_LEVEL_ONE,
    parentId: null,
    slug: generateDefaultLangSlug(rubricLevelOneBName),
    variantId: rubricVariantAlcohol._id,
    attributesGroups: rubricAttributesGroups(true),
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

  const rubricLevelOneCDefaultName = 'Виски';
  const rubricLevelOneCName = {
    [DEFAULT_LOCALE]: rubricLevelOneCDefaultName,
    [SECONDARY_LOCALE]: 'Whiskey',
  };
  const rubricLevelOneCId = new ObjectId();
  const rubricLevelOneC: RubricModel = {
    _id: rubricLevelOneCId,
    nameI18n: rubricLevelOneCName,
    level: RUBRIC_LEVEL_ONE,
    parentId: null,
    slug: generateDefaultLangSlug(rubricLevelOneCName),
    variantId: rubricVariantAlcohol._id,
    attributesGroups: rubricAttributesGroups(true),
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

  const rubricLevelOneDDefaultName = 'Коньяк';
  const rubricLevelOneDName = {
    [DEFAULT_LOCALE]: rubricLevelOneDDefaultName,
    [SECONDARY_LOCALE]: 'Cognac',
  };
  const rubricLevelOneDId = new ObjectId();
  const rubricLevelOneD: RubricModel = {
    _id: rubricLevelOneDId,
    nameI18n: rubricLevelOneDName,
    level: RUBRIC_LEVEL_ONE,
    parentId: null,
    slug: generateDefaultLangSlug(rubricLevelOneDName),
    variantId: rubricVariantAlcohol._id,
    attributesGroups: rubricAttributesGroups(true),
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

  const rubricLevelTwoADefaultName = 'levelTwoARu';
  const rubricLevelTwoASecondaryName = 'levelTwoAEn';
  const rubricLevelTwoAName = {
    [DEFAULT_LOCALE]: rubricLevelTwoADefaultName,
    [SECONDARY_LOCALE]: rubricLevelTwoASecondaryName,
  };
  const rubricLevelTwoAId = new ObjectId();
  const rubricLevelTwoA: RubricModel = {
    _id: rubricLevelTwoAId,
    nameI18n: rubricLevelTwoAName,
    level: RUBRIC_LEVEL_TWO,
    slug: generateDefaultLangSlug(rubricLevelTwoAName),
    variantId: rubricVariantAlcohol._id,
    parentId: rubricLevelOneAId,
    attributesGroups: rubricAttributesGroups(false),
    active: true,
    descriptionI18n: description,
    shortDescriptionI18n: description,
    catalogueTitle: {
      defaultTitleI18n: {
        [DEFAULT_LOCALE]: rubricLevelTwoADefaultName,
        [SECONDARY_LOCALE]: rubricLevelTwoASecondaryName,
      },
      prefixI18n: {},
      keywordI18n: {
        [DEFAULT_LOCALE]: 'rubricLevelTwoA',
        [SECONDARY_LOCALE]: 'rubricLevelTwoA',
      },
      gender: genderShe,
    },
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const rubricLevelTwoBDefaultName = 'levelTwoBRu';
  const rubricLevelTwoBSecondaryName = 'levelTwoBEn';
  const rubricLevelTwoBName = {
    [DEFAULT_LOCALE]: rubricLevelTwoBDefaultName,
    [SECONDARY_LOCALE]: rubricLevelTwoBSecondaryName,
  };
  const rubricLevelTwoBId = new ObjectId();
  const rubricLevelTwoB: RubricModel = {
    _id: rubricLevelTwoBId,
    nameI18n: rubricLevelTwoBName,
    level: RUBRIC_LEVEL_TWO,
    slug: generateDefaultLangSlug(rubricLevelTwoBName),
    variantId: rubricVariantAlcohol._id,
    parentId: rubricLevelOneA._id,
    attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(true)],
    active: true,
    descriptionI18n: description,
    shortDescriptionI18n: description,
    catalogueTitle: {
      defaultTitleI18n: {
        [DEFAULT_LOCALE]: rubricLevelTwoBDefaultName,
        [SECONDARY_LOCALE]: rubricLevelTwoBSecondaryName,
      },
      prefixI18n: {},
      keywordI18n: {
        [DEFAULT_LOCALE]: 'rubricLevelTwoB',
        [SECONDARY_LOCALE]: 'rubricLevelTwoB',
      },
      gender: genderHe,
    },
    ...DEFAULT_COUNTERS_OBJECT,
  };

  await rubricsCollection.insertMany([
    rubricLevelOneA,
    rubricLevelOneB,
    rubricLevelOneC,
    rubricLevelOneD,
    rubricLevelTwoA,
    rubricLevelTwoB,
  ]);

  return {
    ...rubricVariantsPayload,
    rubricLevelOneADefaultName,
    rubricLevelOneAName,
    rubricLevelOneA,

    rubricLevelOneBDefaultName,
    rubricLevelOneBName,
    rubricLevelOneB,

    rubricLevelOneCDefaultName,
    rubricLevelOneCName,
    rubricLevelOneC,

    rubricLevelOneDDefaultName,
    rubricLevelOneDName,
    rubricLevelOneD,

    rubricLevelTwoADefaultName,
    rubricLevelTwoAName,
    rubricLevelTwoA,

    rubricLevelTwoBDefaultName,
    rubricLevelTwoBName,
    rubricLevelTwoB,
  };
};
