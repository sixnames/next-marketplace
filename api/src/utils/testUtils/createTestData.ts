import clearTestData from './clearTestData';
import createInitialData from '../initialData/createInitialData';
import { OptionModel } from '../../entities/Option';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import {
  AttributeModel,
  AttributePositionInTitleEnum,
  AttributeVariantEnum,
} from '../../entities/Attribute';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { generateDefaultLangSlug } from '../slug';
import { RubricVariantModel } from '../../entities/RubricVariant';
import { RubricModel } from '../../entities/Rubric';
import {
  MOCK_ATTRIBUTE_WINE_COLOR,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_WINE_VARIANT,
  MOCK_ATTRIBUTE_STRING,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
  MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_GROUP_COLORS,
  MOCK_OPTIONS_GROUP_WINE_VARIANTS,
  MOCK_OPTIONS_WINE_VARIANT,
  MOCK_PRODUCT_A,
  MOCK_PRODUCT_C,
  MOCK_PRODUCT_B,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_RUBRIC_LEVEL_THREE_A_B,
  MOCK_RUBRIC_LEVEL_THREE_B_A,
  MOCK_RUBRIC_LEVEL_THREE_B_B,
  MOCK_RUBRIC_LEVEL_TWO_A,
  MOCK_RUBRIC_LEVEL_TWO_B,
  MOCK_RUBRIC_VARIANT_ALCOHOL,
  MOCK_RUBRIC_VARIANT_JUICE,
  DEFAULT_LANG,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  SECONDARY_LANG,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  MOCK_LANGUAGES,
  MOCK_CURRENCIES,
  MOCK_CITIES,
  MOCK_COUNTRIES,
  MOCK_RUBRIC_LEVEL_ONE_B,
  MOCK_RUBRIC_LEVEL_ONE_C,
  MOCK_RUBRIC_LEVEL_ONE_D,
} from '../../config';
import { ProductModel } from '../../entities/Product';
import { GenderEnum } from '../../entities/common';
import { LanguageModel } from '../../entities/Language';
import { CurrencyModel } from '../../entities/Currency';
import { CityModel } from '../../entities/City';
import { CountryModel } from '../../entities/Country';
import { getProductCities } from './getProductCities';
import { getRubricCities } from './getRubricCities';

const createTestData = async () => {
  try {
    // Clear old test data
    await clearTestData();

    // Initial data
    await createInitialData();

    // Currencies, countries and cities
    const secondaryCurrency = await CurrencyModel.create(MOCK_CURRENCIES[1]);
    const secondaryCity = await CityModel.create(MOCK_CITIES[1]);
    await CountryModel.create({
      ...MOCK_COUNTRIES[1],
      cities: [secondaryCity.id],
      currency: secondaryCurrency.nameString,
    });

    // Languages
    await LanguageModel.create(MOCK_LANGUAGES[1]);

    // Options
    const optionsColor = await OptionModel.insertMany(MOCK_OPTIONS_WINE_COLOR);
    const optionsWineType = await OptionModel.insertMany(MOCK_OPTIONS_WINE_VARIANT);
    const optionsIdsColor = optionsColor.map(({ id }) => id);
    const optionsIdsWineType = optionsWineType.map(({ id }) => id);

    const optionsSlugsColor = optionsColor.map(({ slug }) => slug);
    const optionsSlugsWineType = optionsWineType.map(({ slug }) => slug);

    const optionsGroupWineTypes = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_WINE_VARIANTS,
      options: optionsIdsWineType,
    });

    const optionsGroupColors = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_COLORS,
      options: optionsIdsColor,
    });

    // Attributes
    const attributeWineColor = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_WINE_COLOR,
      variant: MOCK_ATTRIBUTE_WINE_COLOR.variant as AttributeVariantEnum,
      options: optionsGroupColors.id,
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
      options: optionsGroupWineTypes.id,
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

    await AttributesGroupModel.create({
      ...MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
      attributes: [
        attributeWineColor.id,
        attributeWineType.id,
        attributeString.id,
        attributeNumber.id,
      ],
    });

    const attributesGroupWineFeatures = await AttributesGroupModel.create({
      ...MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
      attributes: [
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

    // Rubric types
    const rubricVariantAlcohol = await RubricVariantModel.create(MOCK_RUBRIC_VARIANT_ALCOHOL);
    await RubricVariantModel.create(MOCK_RUBRIC_VARIANT_JUICE);

    // Rubrics
    const rubricAttributesGroups = (isOwner: boolean) => [
      {
        showInCatalogueFilter: [attributeWineColor.id, attributeWineType.id],
        showInSiteNav: true,
        node: attributesGroupWineFeatures.id,
        isOwner,
      },
    ];

    const rubricAttributesGroupsB = (isOwner: boolean) => [
      {
        showInCatalogueFilter: [],
        showInSiteNav: true,
        node: attributesGroupWhiskeyFeatures.id,
        isOwner,
      },
    ];

    const rubricLevelOne = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_ONE,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        attributesGroups: rubricAttributesGroups(true),
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_ONE.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_ONE_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        attributesGroups: rubricAttributesGroups(true),
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_ONE_C,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        attributesGroups: rubricAttributesGroups(true),
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_ONE_D,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        attributesGroups: rubricAttributesGroups(true),
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    const rubricLevelTwoA = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_TWO_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        parent: rubricLevelOne.id,
        attributesGroups: rubricAttributesGroups(false),
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    const rubricLevelThreeAA = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_A_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        parent: rubricLevelTwoA.id,
        attributesGroups: rubricAttributesGroups(false),
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    const rubricLevelThreeAB = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_A_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        parent: rubricLevelTwoA.id,
        attributesGroups: rubricAttributesGroups(false),
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    const rubricLevelTwoB = await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_TWO_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        parent: rubricLevelOne.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(true)],
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_B_A,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        parent: rubricLevelTwoB.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    await RubricModel.create({
      cities: getRubricCities({
        ...MOCK_RUBRIC_LEVEL_THREE_B_B,
        slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle.defaultTitle),
        variant: rubricVariantAlcohol.id,
        parent: rubricLevelTwoB.id,
        attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
        catalogueTitle: {
          ...MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle,
          gender: MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle.gender as GenderEnum,
        },
      }),
    });

    // Products
    const productAttributes = (wineColorOptions: string, wineTypeOptions: string) => ({
      attributesGroups: [
        {
          node: attributesGroupWineFeatures.id,
          showInCard: true,
          attributes: [
            {
              node: attributeWineColor.id,
              showInCard: true,
              key: attributeWineColor.slug,
              value: [wineColorOptions],
            },
            {
              node: attributeWineType.id,
              showInCard: true,
              key: attributeWineType.slug,
              value: [wineTypeOptions],
            },
            {
              node: attributeString.id,
              showInCard: true,
              key: attributeString.slug,
              value: ['string'],
            },
            {
              node: attributeNumber.id,
              showInCard: true,
              key: attributeNumber.slug,
              value: ['123'],
            },
          ],
        },
      ],
    });

    // for delete
    await ProductModel.create({
      cities: await getProductCities(
        {
          ...MOCK_PRODUCT_B,
          ...productAttributes(optionsSlugsColor[2], optionsSlugsWineType[2]),
          rubrics: [rubricLevelThreeAA.id],
        },
        false,
      ),
    });

    // for second rubric in third level
    await ProductModel.create({
      cities: await getProductCities({
        ...MOCK_PRODUCT_C,
        ...productAttributes(optionsSlugsColor[0], optionsSlugsWineType[0]),
        rubrics: [rubricLevelThreeAB.id],
      }),
    });

    // main product
    // const product = await ProductModel.create({
    await ProductModel.create({
      cities: await getProductCities({
        ...MOCK_PRODUCT_A,
        ...productAttributes(optionsSlugsColor[1], optionsSlugsWineType[1]),
        rubrics: [rubricLevelThreeAA.id],
      }),
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
