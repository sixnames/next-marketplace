import {
  Attribute,
  AttributeModel,
  AttributePositionInTitleEnum,
  AttributeVariantEnum,
} from '../../entities/Attribute';
import { AttributesGroup, AttributesGroupModel } from '../../entities/AttributesGroup';
import { createTestOptions, CreateTestOptionsInterface } from './createTestOptions';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LANG,
  SECONDARY_LANG,
} from '@yagu/shared';
import { Translation } from '../../entities/Translation';

export interface CreateTestAttributesPayloadInterface extends CreateTestOptionsInterface {
  attributeOuterRatingA: Attribute;
  attributeOuterRatingB: Attribute;
  attributeOuterRatingC: Attribute;
  attributeWineCombinations: Attribute;
  attributeWineVintage: Attribute;
  attributeWineColor: Attribute;
  attributeWineVariant: Attribute;
  attributeString: Attribute;
  attributeNumber: Attribute;
  attributesGroupForDelete: AttributesGroup;
  attributesGroupOuterRating: AttributesGroup;
  attributesGroupWineFeaturesName: Translation[];
  attributesGroupWineFeatures: AttributesGroup;
  attributesGroupWhiskeyFeatures: AttributesGroup;
}

export const createTestAttributes = async (): Promise<CreateTestAttributesPayloadInterface> => {
  const optionsPayload = await createTestOptions();
  const {
    optionsGroupWineVintage,
    optionsGroupWineVariants,
    optionsGroupColors,
    optionsGroupCombination,
  } = optionsPayload;

  const attributeVariantNumber = ATTRIBUTE_VARIANT_NUMBER as AttributeVariantEnum;
  const attributeVariantSelect = ATTRIBUTE_VARIANT_SELECT as AttributeVariantEnum;
  const attributeVariantString = ATTRIBUTE_VARIANT_STRING as AttributeVariantEnum;
  const attributeVariantMultipleSelect = ATTRIBUTE_VARIANT_MULTIPLE_SELECT as AttributeVariantEnum;

  const attributePositionInTitleBeforeKeyword = ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleEnum;
  const attributePositionInTitleAfterKeyword = ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD as AttributePositionInTitleEnum;

  const attributeOuterRatingA = await AttributeModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'vivino' },
      { key: SECONDARY_LANG, value: 'vivino' },
    ],
    views: [],
    priorities: [],
    slug: 'vivino',
    variant: attributeVariantNumber,
    positioningInTitle: [],
  });

  const attributeOuterRatingB = await AttributeModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'pr' },
      { key: SECONDARY_LANG, value: 'pr' },
    ],
    views: [],
    priorities: [],
    slug: 'pr',
    variant: attributeVariantNumber,
    positioningInTitle: [],
  });

  const attributeOuterRatingC = await AttributeModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'ws' },
      { key: SECONDARY_LANG, value: 'ws' },
    ],
    views: [],
    priorities: [],
    slug: 'ws',
    variant: attributeVariantNumber,
    positioningInTitle: [],
  });
  const attributesGroupOuterRating = await AttributesGroupModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Внешний рейтинг' },
      { key: SECONDARY_LANG, value: 'Outer rating' },
    ],
    attributes: [attributeOuterRatingA.id, attributeOuterRatingB.id, attributeOuterRatingC.id],
  });

  const attributeWineCombinations = await AttributeModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Сочетание' },
      { key: SECONDARY_LANG, value: 'Combinations' },
    ],
    views: [],
    priorities: [],
    slug: 'combinations',
    variant: attributeVariantMultipleSelect,
    optionsGroup: optionsGroupCombination.id,
    positioningInTitle: [],
  });

  const attributeWineVintage = await AttributeModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Винтаж вина' },
      { key: SECONDARY_LANG, value: 'Wine vintage' },
    ],
    views: [],
    priorities: [],
    slug: 'vintaz_vina',
    variant: attributeVariantSelect,
    optionsGroup: optionsGroupWineVintage.id,
    positioningInTitle: [
      {
        key: DEFAULT_LANG,
        value: attributePositionInTitleAfterKeyword,
      },
      {
        key: SECONDARY_LANG,
        value: attributePositionInTitleAfterKeyword,
      },
    ],
  });

  const attributeWineColor = await AttributeModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Цвет вина' },
      { key: SECONDARY_LANG, value: 'Wine color' },
    ],
    views: [],
    priorities: [],
    slug: 'tsvet_vina',
    variant: attributeVariantMultipleSelect,
    optionsGroup: optionsGroupColors.id,
    positioningInTitle: [
      {
        key: DEFAULT_LANG,
        value: attributePositionInTitleBeforeKeyword,
      },
      {
        key: SECONDARY_LANG,
        value: attributePositionInTitleBeforeKeyword,
      },
    ],
  });

  const attributeWineVariant = await AttributeModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Тип вина' },
      { key: SECONDARY_LANG, value: 'Wine type' },
    ],
    views: [],
    priorities: [],
    slug: 'tip_vina',
    variant: attributeVariantSelect,
    optionsGroup: optionsGroupWineVariants.id,
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
    name: [
      { key: DEFAULT_LANG, value: 'Атрибут строка' },
      { key: SECONDARY_LANG, value: 'Attribute string' },
    ],
    views: [],
    priorities: [],
    slug: 'attribute_stroka',
    variant: attributeVariantString,
  });

  const attributeNumber = await AttributeModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Атрибут число' },
      { key: SECONDARY_LANG, value: 'Attribute number' },
    ],
    views: [],
    priorities: [],
    slug: 'attribute_chislo',
    variant: attributeVariantNumber,
  });

  const attributesGroupForDelete = await AttributesGroupModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Группа атрибутов для удаления' },
      { key: SECONDARY_LANG, value: 'Group for delete' },
    ],
    attributes: [
      attributeWineColor.id,
      attributeWineVariant.id,
      attributeString.id,
      attributeNumber.id,
    ],
  });

  const attributesGroupWineFeaturesName = [
    { key: DEFAULT_LANG, value: 'Характеристики вина' },
    { key: SECONDARY_LANG, value: 'Wine features' },
  ];
  const attributesGroupWineFeatures = await AttributesGroupModel.create({
    name: attributesGroupWineFeaturesName,
    attributes: [
      attributeWineCombinations.id,
      attributeWineVintage.id,
      attributeWineColor.id,
      attributeWineVariant.id,
      attributeString.id,
      attributeNumber.id,
    ],
  });

  const attributesGroupWhiskeyFeatures = await AttributesGroupModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Характеристики виски' },
      { key: SECONDARY_LANG, value: 'Whiskey features' },
    ],
    attributes: [attributeString.id, attributeNumber.id],
  });

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
    attributesGroupWineFeaturesName,
    attributesGroupWineFeatures,
    attributesGroupWhiskeyFeatures,
  };
};
