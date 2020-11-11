import {
  Attribute,
  AttributeModel,
  AttributePositionInTitleEnum,
  AttributeVariantEnum,
} from '../../entities/Attribute';
import {
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_OUTER_RATING_A,
  MOCK_ATTRIBUTE_OUTER_RATING_B,
  MOCK_ATTRIBUTE_OUTER_RATING_C,
  MOCK_ATTRIBUTE_STRING,
  MOCK_ATTRIBUTE_WINE_COLOR,
  MOCK_ATTRIBUTE_WINE_COMBINATIONS,
  MOCK_ATTRIBUTE_WINE_VARIANT,
  MOCK_ATTRIBUTE_WINE_VINTAGE,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_ATTRIBUTES_GROUP_OUTER_RATING,
  MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
} from '@yagu/mocks';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  DEFAULT_LANG,
  SECONDARY_LANG,
} from '@yagu/config';
import { AttributesGroup, AttributesGroupModel } from '../../entities/AttributesGroup';
import { OptionsGroup } from '../../entities/OptionsGroup';

interface CreateTestAttributesInterface {
  optionsGroupWineVintage: OptionsGroup;
  optionsGroupWineTypes: OptionsGroup;
  optionsGroupColors: OptionsGroup;
  optionsGroupCombination: OptionsGroup;
}

interface CreateTestAttributesPayloadInterface {
  attributeOuterRatingA: Attribute;
  attributeOuterRatingB: Attribute;
  attributeOuterRatingC: Attribute;
  attributeWineCombinations: Attribute;
  attributeWineVintage: Attribute;
  attributeWineColor: Attribute;
  attributeWineType: Attribute;
  attributeString: Attribute;
  attributeNumber: Attribute;
  attributesGroupForDelete: AttributesGroup;
  attributesGroupOuterRating: AttributesGroup;
  attributesGroupWineFeatures: AttributesGroup;
  attributesGroupWhiskeyFeatures: AttributesGroup;
}

export const createTestAttributes = async ({
  optionsGroupWineVintage,
  optionsGroupWineTypes,
  optionsGroupColors,
  optionsGroupCombination,
}: CreateTestAttributesInterface): Promise<CreateTestAttributesPayloadInterface> => {
  const attributeOuterRatingA = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_OUTER_RATING_A,
    variant: MOCK_ATTRIBUTE_OUTER_RATING_A.variant as AttributeVariantEnum,
    positioningInTitle: [],
  });

  const attributeOuterRatingB = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_OUTER_RATING_B,
    variant: MOCK_ATTRIBUTE_OUTER_RATING_B.variant as AttributeVariantEnum,
    positioningInTitle: [],
  });

  const attributeOuterRatingC = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_OUTER_RATING_C,
    variant: MOCK_ATTRIBUTE_OUTER_RATING_C.variant as AttributeVariantEnum,
    positioningInTitle: [],
  });

  const attributeWineCombinations = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_WINE_COMBINATIONS,
    variant: MOCK_ATTRIBUTE_WINE_COMBINATIONS.variant as AttributeVariantEnum,
    optionsGroup: optionsGroupCombination.id,
    positioningInTitle: [],
  });

  const attributeWineVintage = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_WINE_VINTAGE,
    variant: MOCK_ATTRIBUTE_WINE_VINTAGE.variant as AttributeVariantEnum,
    optionsGroup: optionsGroupWineVintage.id,
    positioningInTitle: [
      {
        key: DEFAULT_LANG,
        value: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD as AttributePositionInTitleEnum,
      },
      {
        key: SECONDARY_LANG,
        value: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD as AttributePositionInTitleEnum,
      },
    ],
  });

  const attributeWineColor = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_WINE_COLOR,
    variant: MOCK_ATTRIBUTE_WINE_COLOR.variant as AttributeVariantEnum,
    optionsGroup: optionsGroupColors.id,
    positioningInTitle: [
      {
        key: DEFAULT_LANG,
        value: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleEnum,
      },
      {
        key: SECONDARY_LANG,
        value: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleEnum,
      },
    ],
  });

  const attributeWineType = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_WINE_VARIANT,
    variant: MOCK_ATTRIBUTE_WINE_VARIANT.variant as AttributeVariantEnum,
    optionsGroup: optionsGroupWineTypes.id,
    positioningInTitle: [
      {
        key: DEFAULT_LANG,
        value: ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD as AttributePositionInTitleEnum,
      },
      {
        key: SECONDARY_LANG,
        value: ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD as AttributePositionInTitleEnum,
      },
    ],
  });

  const attributeString = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_STRING,
    variant: MOCK_ATTRIBUTE_STRING.variant as AttributeVariantEnum,
  });

  const attributeNumber = await AttributeModel.create({
    ...MOCK_ATTRIBUTE_NUMBER,
    variant: MOCK_ATTRIBUTE_NUMBER.variant as AttributeVariantEnum,
  });

  const attributesGroupForDelete = await AttributesGroupModel.create({
    ...MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
    attributes: [
      attributeWineColor.id,
      attributeWineType.id,
      attributeString.id,
      attributeNumber.id,
    ],
  });

  const attributesGroupOuterRating = await AttributesGroupModel.create({
    ...MOCK_ATTRIBUTES_GROUP_OUTER_RATING,
    attributes: [attributeOuterRatingA.id, attributeOuterRatingB.id, attributeOuterRatingC.id],
  });

  const attributesGroupWineFeatures = await AttributesGroupModel.create({
    ...MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
    attributes: [
      attributeWineCombinations.id,
      attributeWineVintage.id,
      attributeWineColor.id,
      attributeWineType.id,
      attributeString.id,
      attributeNumber.id,
    ],
  });

  const attributesGroupWhiskeyFeatures = await AttributesGroupModel.create({
    ...MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES,
    attributes: [attributeString.id, attributeNumber.id],
  });

  return {
    attributeOuterRatingA,
    attributeOuterRatingB,
    attributeOuterRatingC,
    attributeWineCombinations,
    attributeWineVintage,
    attributeWineColor,
    attributeWineType,
    attributeString,
    attributeNumber,
    attributesGroupForDelete,
    attributesGroupOuterRating,
    attributesGroupWineFeatures,
    attributesGroupWhiskeyFeatures,
  };
};
