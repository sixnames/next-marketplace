import { getDatabase } from 'db/mongodb';
import { ObjectId } from 'mongodb';
import { createTestOptions, CreateTestOptionsInterface } from 'tests/createTestOptions';
import {
  AttributeModel,
  AttributePositionInTitleModel,
  AttributesGroupModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
} from 'db/dbModels';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  SECONDARY_LOCALE,
} from 'config/common';
import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS } from 'db/collectionNames';

export interface CreateTestAttributesPayloadInterface extends CreateTestOptionsInterface {
  attributeOuterRatingA: AttributeModel;
  attributeOuterRatingB: AttributeModel;
  attributeOuterRatingC: AttributeModel;
  attributeWineCombinations: AttributeModel;
  attributeWineVintage: AttributeModel;
  attributeWineColor: AttributeModel;
  attributeWineVariant: AttributeModel;
  attributeString: AttributeModel;
  attributeNumber: AttributeModel;
  attributesGroupForDelete: AttributesGroupModel;
  attributesGroupOuterRating: AttributesGroupModel;
  attributesGroupWineFeatures: AttributesGroupModel;
  attributesGroupWhiskeyFeatures: AttributesGroupModel;
}

export const createTestAttributes = async (): Promise<CreateTestAttributesPayloadInterface> => {
  const db = await getDatabase();
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

  const optionsPayload = await createTestOptions();
  const {
    optionsGroupWineVintage,
    optionsGroupWineVariants,
    optionsGroupColors,
    optionsGroupCombination,
    optionsIdsCombination,
    optionsIdsColor,
    optionsIdsVintage,
    optionsIdsWineVariant,
  } = optionsPayload;

  const attributeVariantNumber = ATTRIBUTE_VARIANT_NUMBER as AttributeVariantModel;
  const attributeVariantSelect = ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel;
  const attributeVariantString = ATTRIBUTE_VARIANT_STRING as AttributeVariantModel;
  const attributeVariantMultipleSelect = ATTRIBUTE_VARIANT_MULTIPLE_SELECT as AttributeVariantModel;

  const attributePositionInTitleBeforeKeyword = ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel;
  const attributePositionInTitleAfterKeyword = ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD as AttributePositionInTitleModel;
  const attributePositionInTitleReplaceKeyword = ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD as AttributePositionInTitleModel;

  const attributeViewVariantList = ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel;
  const attributeViewVariantText = ATTRIBUTE_VIEW_VARIANT_TEXT as AttributeViewVariantModel;
  const attributeViewVariantTag = ATTRIBUTE_VIEW_VARIANT_TAG as AttributeViewVariantModel;
  const attributeViewVariantIcon = ATTRIBUTE_VIEW_VARIANT_ICON as AttributeViewVariantModel;
  const attributeViewVariantOuterRating = ATTRIBUTE_VIEW_VARIANT_OUTER_RATING as AttributeViewVariantModel;

  // Outer rating
  const attributeOuterRatingAId = new ObjectId();
  const attributeOuterRatingA: AttributeModel = {
    _id: attributeOuterRatingAId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'vivino',
      [SECONDARY_LOCALE]: 'vivino',
    },
    slug: 'vivino',
    variant: attributeVariantNumber,
    viewVariant: attributeViewVariantOuterRating,
    optionsIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributeOuterRatingBId = new ObjectId();
  const attributeOuterRatingB: AttributeModel = {
    _id: attributeOuterRatingBId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'pr',
      [SECONDARY_LOCALE]: 'pr',
    },
    slug: 'pr',
    variant: attributeVariantNumber,
    viewVariant: attributeViewVariantOuterRating,
    optionsIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributeOuterRatingCId = new ObjectId();
  const attributeOuterRatingC: AttributeModel = {
    _id: attributeOuterRatingCId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'ws',
      [SECONDARY_LOCALE]: 'ws',
    },
    slug: 'ws',
    variant: attributeVariantNumber,
    viewVariant: attributeViewVariantOuterRating,
    optionsIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributesGroupOuterRatingId = new ObjectId();
  const attributesGroupOuterRating: AttributesGroupModel = {
    _id: attributesGroupOuterRatingId,
    attributesIds: [attributeOuterRatingAId, attributeOuterRatingBId, attributeOuterRatingCId],
    nameI18n: {
      [DEFAULT_LOCALE]: 'Внешний рейтинг',
      [SECONDARY_LOCALE]: 'Outer rating',
    },
  };

  // Wine features
  const attributeWineCombinationsId = new ObjectId();
  const attributeWineCombinations: AttributeModel = {
    _id: attributeWineCombinationsId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Сочетание',
      [SECONDARY_LOCALE]: 'Combinations',
    },
    slug: 'combinations',
    variant: attributeVariantMultipleSelect,
    viewVariant: attributeViewVariantIcon,
    optionsGroupId: optionsGroupCombination._id,
    optionsIds: optionsIdsCombination,
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributeWineVintageId = new ObjectId();
  const attributeWineVintage: AttributeModel = {
    _id: attributeWineVintageId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Винтаж вина',
      [SECONDARY_LOCALE]: 'Wine vintage',
    },
    slug: 'vintaz_vina',
    variant: attributeVariantSelect,
    viewVariant: attributeViewVariantList,
    optionsGroupId: optionsGroupWineVintage._id,
    optionsIds: optionsIdsVintage,
    positioningInTitle: {
      [DEFAULT_LOCALE]: attributePositionInTitleAfterKeyword,
      [SECONDARY_LOCALE]: attributePositionInTitleAfterKeyword,
    },
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributeWineColorId = new ObjectId();
  const attributeWineColor: AttributeModel = {
    _id: attributeWineColorId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Цвет вина',
      [SECONDARY_LOCALE]: 'Wine color',
    },
    slug: 'tsvet_vina',
    variant: attributeVariantMultipleSelect,
    viewVariant: attributeViewVariantTag,
    optionsGroupId: optionsGroupColors._id,
    optionsIds: optionsIdsColor,
    positioningInTitle: {
      [DEFAULT_LOCALE]: attributePositionInTitleBeforeKeyword,
      [SECONDARY_LOCALE]: attributePositionInTitleBeforeKeyword,
    },
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributeWineVariantId = new ObjectId();
  const attributeWineVariant: AttributeModel = {
    _id: attributeWineVariantId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Тип вина',
      [SECONDARY_LOCALE]: 'Wine type',
    },
    slug: 'tip_vina',
    variant: attributeVariantSelect,
    viewVariant: attributeViewVariantList,
    optionsGroupId: optionsGroupWineVariants._id,
    optionsIds: optionsIdsWineVariant,
    positioningInTitle: {
      [DEFAULT_LOCALE]: attributePositionInTitleReplaceKeyword,
      [SECONDARY_LOCALE]: attributePositionInTitleReplaceKeyword,
    },
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributeStringId = new ObjectId();
  const attributeString: AttributeModel = {
    _id: attributeStringId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Атрибут строка',
      [SECONDARY_LOCALE]: 'Attribute string',
    },
    slug: 'attribute_stroka',
    variant: attributeVariantString,
    viewVariant: attributeViewVariantText,
    optionsIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributeNumberId = new ObjectId();
  const attributeNumber: AttributeModel = {
    _id: attributeNumberId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Атрибут число',
      [SECONDARY_LOCALE]: 'Attribute number',
    },
    slug: 'attribute_chislo',
    variant: attributeVariantNumber,
    viewVariant: attributeViewVariantText,
    optionsIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const attributesGroupWineFeatures: AttributesGroupModel = {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: 'Характеристики вина',
      [SECONDARY_LOCALE]: 'Wine features',
    },
    attributesIds: [
      attributeWineCombinationsId,
      attributeWineVintageId,
      attributeWineColorId,
      attributeWineVariantId,
      attributeStringId,
      attributeNumberId,
    ],
  };

  const attributesGroupForDelete: AttributesGroupModel = {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: 'Группа атрибутов для удаления',
      [SECONDARY_LOCALE]: 'Group for delete',
    },
    attributesIds: [],
  };

  const attributesGroupWhiskeyFeatures: AttributesGroupModel = {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: 'Характеристики виски',
      [SECONDARY_LOCALE]: 'Whiskey features',
    },
    attributesIds: [],
  };

  // Insert all
  await attributesCollection.insertMany([
    attributeOuterRatingA,
    attributeOuterRatingB,
    attributeOuterRatingC,
    attributeWineCombinations,
    attributeWineVintage,
    attributeWineColor,
    attributeWineVariant,
    attributeString,
    attributeNumber,
  ]);

  await attributesGroupsCollection.insertMany([
    attributesGroupOuterRating,
    attributesGroupWineFeatures,
    attributesGroupForDelete,
    attributesGroupWhiskeyFeatures,
  ]);

  return {
    ...optionsPayload,
    attributeOuterRatingA,
    attributeOuterRatingB,
    attributeOuterRatingC,
    attributeWineCombinations,
    attributeWineVintage,
    attributeWineColor,
    attributeWineVariant,
    attributeString,
    attributeNumber,
    attributesGroupForDelete,
    attributesGroupOuterRating,
    attributesGroupWineFeatures,
    attributesGroupWhiskeyFeatures,
  };
};
