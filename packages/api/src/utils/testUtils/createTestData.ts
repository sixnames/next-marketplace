import clearTestData from './clearTestData';
import createInitialData from '../initialData/createInitialData';
import { OptionModel } from '../../entities/Option';
import { OptionsGroupModel, OptionsGroupVariantEnum } from '../../entities/OptionsGroup';
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
  MOCK_OPTIONS_VINTAGE,
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
  MOCK_LANGUAGES,
  MOCK_CURRENCIES,
  MOCK_CITIES,
  MOCK_COUNTRIES,
  MOCK_RUBRIC_LEVEL_ONE_B,
  MOCK_RUBRIC_LEVEL_ONE_C,
  MOCK_RUBRIC_LEVEL_ONE_D,
  MOCK_PRODUCT_D,
  MOCK_PRODUCT_E,
  MOCK_OPTIONS_GROUP_WINE_VINTAGE,
  MOCK_ATTRIBUTE_WINE_VINTAGE,
  MOCK_OPTIONS_COMBINATION,
  MOCK_OPTIONS_GROUP_COMBINATIONS,
  MOCK_ATTRIBUTE_WINE_COMBINATIONS,
  MOCK_ATTRIBUTE_OUTER_RATING_A,
  MOCK_ATTRIBUTE_OUTER_RATING_B,
  MOCK_ATTRIBUTE_OUTER_RATING_C,
  MOCK_ATTRIBUTES_GROUP_OUTER_RATING,
} from '@yagu/mocks';
import {
  DEFAULT_LANG,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  SECONDARY_LANG,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
} from '@yagu/config';
import {
  ProductAttributeViewVariantEnum,
  ProductConnectionModel,
  ProductModel,
} from '../../entities/Product';
import { GenderEnum } from '../../entities/common';
import { LanguageModel } from '../../entities/Language';
import { CurrencyModel } from '../../entities/Currency';
import { CityModel } from '../../entities/City';
import { CountryModel } from '../../entities/Country';
import { generateTestProduct } from './generateTestProduct';
import { createProductSlugWithConnections } from '../connectios';

interface ProductAttributesInterface {
  wineColorOptions?: string;
  wineTypeOptions?: string;
  wineVintageOptions?: string;
}

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
    const optionsVintage = await OptionModel.insertMany(MOCK_OPTIONS_VINTAGE);
    const optionsColor = await OptionModel.insertMany(MOCK_OPTIONS_WINE_COLOR);
    const optionsWineType = await OptionModel.insertMany(MOCK_OPTIONS_WINE_VARIANT);
    const optionsCombination = await OptionModel.insertMany(MOCK_OPTIONS_COMBINATION);

    const optionsIdsVintage = optionsVintage.map(({ id }) => id);
    const optionsIdsColor = optionsColor.map(({ id }) => id);
    const optionsIdsWineType = optionsWineType.map(({ id }) => id);
    const optionsIdsCombination = optionsCombination.map(({ id }) => id);

    const optionsSlugsVintage = optionsVintage.map(({ slug }) => slug);
    const optionsSlugsColor = optionsColor.map(({ slug }) => slug);
    const optionsSlugsWineType = optionsWineType.map(({ slug }) => slug);
    const optionsSlugsCombination = optionsCombination.map(({ slug }) => slug);

    const optionsGroupWineVintage = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_WINE_VINTAGE,
      options: optionsIdsVintage,
    });

    const optionsGroupWineTypes = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_WINE_VARIANTS,
      options: optionsIdsWineType,
    });

    const optionsGroupColors = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_COLORS,
      options: optionsIdsColor,
      variant: OPTIONS_GROUP_VARIANT_COLOR as OptionsGroupVariantEnum,
    });

    const optionsGroupCombination = await OptionsGroupModel.create({
      ...MOCK_OPTIONS_GROUP_COMBINATIONS,
      options: optionsIdsCombination,
      variant: OPTIONS_GROUP_VARIANT_ICON as OptionsGroupVariantEnum,
    });

    // Attributes
    const attributeOuterRatingA = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_OUTER_RATING_A,
      variant: MOCK_ATTRIBUTE_OUTER_RATING_A.variant as AttributeVariantEnum,
      optionsGroup: optionsGroupCombination.id,
      positioningInTitle: [],
    });

    const attributeOuterRatingB = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_OUTER_RATING_B,
      variant: MOCK_ATTRIBUTE_OUTER_RATING_B.variant as AttributeVariantEnum,
      optionsGroup: optionsGroupCombination.id,
      positioningInTitle: [],
    });

    const attributeOuterRatingC = await AttributeModel.create({
      ...MOCK_ATTRIBUTE_OUTER_RATING_C,
      variant: MOCK_ATTRIBUTE_OUTER_RATING_C.variant as AttributeVariantEnum,
      optionsGroup: optionsGroupCombination.id,
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

    await AttributesGroupModel.create({
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

    // Rubric variants
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
      {
        showInCatalogueFilter: [],
        showInSiteNav: true,
        node: attributesGroupOuterRating.id,
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
      {
        showInCatalogueFilter: [],
        showInSiteNav: true,
        node: attributesGroupOuterRating.id,
        isOwner,
      },
    ];

    const rubricLevelOne = await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_ONE,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      attributesGroups: rubricAttributesGroups(true),
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_ONE.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.gender as GenderEnum,
      },
    });

    await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_ONE_B,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      attributesGroups: rubricAttributesGroups(true),
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_ONE_B.catalogueTitle.gender as GenderEnum,
      },
    });

    await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_ONE_C,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      attributesGroups: rubricAttributesGroups(true),
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_ONE_C.catalogueTitle.gender as GenderEnum,
      },
    });

    await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_ONE_D,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      attributesGroups: rubricAttributesGroups(true),
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_ONE_D.catalogueTitle.gender as GenderEnum,
      },
    });

    const rubricLevelTwoA = await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_TWO_A,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      parent: rubricLevelOne.id,
      attributesGroups: rubricAttributesGroups(false),
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_TWO_A.catalogueTitle.gender as GenderEnum,
      },
    });

    const rubricLevelThreeAA = await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_THREE_A_A,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      parent: rubricLevelTwoA.id,
      attributesGroups: rubricAttributesGroups(false),
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_THREE_A_A.catalogueTitle.gender as GenderEnum,
      },
    });

    const rubricLevelThreeAB = await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_THREE_A_B,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      parent: rubricLevelTwoA.id,
      attributesGroups: rubricAttributesGroups(false),
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_THREE_A_B.catalogueTitle.gender as GenderEnum,
      },
    });

    const rubricLevelTwoB = await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_TWO_B,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      parent: rubricLevelOne.id,
      attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(true)],
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_TWO_B.catalogueTitle.gender as GenderEnum,
      },
    });

    await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_THREE_B_A,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      parent: rubricLevelTwoB.id,
      attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_THREE_B_A.catalogueTitle.gender as GenderEnum,
      },
    });

    await RubricModel.create({
      ...MOCK_RUBRIC_LEVEL_THREE_B_B,
      views: [],
      priorities: [],
      slug: generateDefaultLangSlug(MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle.defaultTitle),
      variant: rubricVariantAlcohol.id,
      parent: rubricLevelTwoB.id,
      attributesGroups: [...rubricAttributesGroups(false), ...rubricAttributesGroupsB(false)],
      catalogueTitle: {
        ...MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle,
        gender: MOCK_RUBRIC_LEVEL_THREE_B_B.catalogueTitle.gender as GenderEnum,
      },
    });

    // Products
    const productAttributes = ({
      wineColorOptions,
      wineTypeOptions,
      wineVintageOptions,
    }: ProductAttributesInterface) => {
      const vintageAttribute = wineVintageOptions
        ? [
            {
              node: attributeWineVintage.id,
              showInCard: true,
              key: attributeWineVintage.slug,
              value: [wineVintageOptions],
              viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as ProductAttributeViewVariantEnum,
            },
          ]
        : [];

      const colorAttribute = wineColorOptions
        ? [
            {
              node: attributeWineColor.id,
              showInCard: true,
              key: attributeWineColor.slug,
              value: [wineColorOptions],
              viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG as ProductAttributeViewVariantEnum,
            },
          ]
        : [];

      const wineTypeAttribute = wineTypeOptions
        ? [
            {
              node: attributeWineType.id,
              showInCard: true,
              key: attributeWineType.slug,
              value: [wineTypeOptions],
              viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as ProductAttributeViewVariantEnum,
            },
          ]
        : [];

      return {
        attributesGroups: [
          {
            node: attributesGroupWineFeatures.id,
            showInCard: true,
            attributes: [
              ...vintageAttribute,
              ...colorAttribute,
              ...wineTypeAttribute,
              {
                node: attributeString.id,
                showInCard: true,
                key: attributeString.slug,
                value: [
                  'Very long string attribute. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet architecto consectetur, consequatur cumque cupiditate enim laborum nihil nisi obcaecati officia perspiciatis quidem quos rem similique sunt ut voluptatum! Deleniti, provident!',
                ],
                viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT as ProductAttributeViewVariantEnum,
              },
              {
                node: attributeWineCombinations.id,
                showInCard: true,
                key: attributeWineCombinations.slug,
                value: optionsSlugsCombination,
                viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON as ProductAttributeViewVariantEnum,
              },
              {
                node: attributeNumber.id,
                showInCard: true,
                key: attributeNumber.slug,
                value: ['123'],
                viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT as ProductAttributeViewVariantEnum,
              },
              {
                node: attributeOuterRatingA.id,
                showInCard: true,
                key: attributeOuterRatingA.slug,
                value: ['4.2'],
                viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING as ProductAttributeViewVariantEnum,
              },
              {
                node: attributeOuterRatingB.id,
                showInCard: true,
                key: attributeOuterRatingB.slug,
                value: ['88'],
                viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING as ProductAttributeViewVariantEnum,
              },
              {
                node: attributeOuterRatingC.id,
                showInCard: true,
                key: attributeOuterRatingC.slug,
                value: ['22'],
                viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING as ProductAttributeViewVariantEnum,
              },
            ],
          },
        ],
      };
    };

    await ProductModel.create(
      await generateTestProduct({
        ...MOCK_PRODUCT_A,
        ...productAttributes({
          wineColorOptions: optionsSlugsColor[1],
          wineTypeOptions: optionsSlugsWineType[1],
        }),
        rubrics: [rubricLevelThreeAA.id],
      }),
    );

    await ProductModel.create(
      await generateTestProduct(
        {
          ...MOCK_PRODUCT_B,
          ...productAttributes({
            wineColorOptions: optionsSlugsColor[2],
            wineTypeOptions: optionsSlugsWineType[2],
          }),
          rubrics: [rubricLevelThreeAA.id],
        },
        false,
      ),
    );

    await ProductModel.create(
      await generateTestProduct({
        ...MOCK_PRODUCT_C,
        ...productAttributes({
          wineColorOptions: optionsSlugsColor[0],
          wineTypeOptions: optionsSlugsWineType[0],
        }),
        rubrics: [rubricLevelThreeAB.id],
      }),
    );

    await ProductModel.create(
      await generateTestProduct({
        ...MOCK_PRODUCT_D,
        ...productAttributes({
          wineColorOptions: optionsSlugsColor[1],
          wineTypeOptions: optionsSlugsWineType[1],
        }),
        rubrics: [rubricLevelThreeAA.id],
      }),
    );

    const connectionProductA = await ProductModel.create(
      await generateTestProduct({
        ...MOCK_PRODUCT_E,
        ...productAttributes({
          wineColorOptions: optionsSlugsColor[1],
          wineTypeOptions: optionsSlugsWineType[1],
          wineVintageOptions: optionsSlugsVintage[0],
        }),
        rubrics: [rubricLevelThreeAA.id],
      }),
    );

    const connectionProductB = await ProductModel.create(
      await generateTestProduct({
        ...MOCK_PRODUCT_E,
        price: 300,
        ...productAttributes({
          wineColorOptions: optionsSlugsColor[1],
          wineTypeOptions: optionsSlugsWineType[1],
          wineVintageOptions: optionsSlugsVintage[1],
        }),
        rubrics: [rubricLevelThreeAA.id],
      }),
    );

    const connectionProductC = await ProductModel.create(
      await generateTestProduct({
        ...MOCK_PRODUCT_E,
        price: 100,
        ...productAttributes({
          wineColorOptions: optionsSlugsColor[1],
          wineTypeOptions: optionsSlugsWineType[1],
          wineVintageOptions: optionsSlugsVintage[2],
        }),
        rubrics: [rubricLevelThreeAA.id],
      }),
    );

    // Product connections
    await ProductConnectionModel.create({
      attributeId: attributeWineVintage.id,
      attributesGroupId: attributesGroupWineFeatures.id,
      productsIds: [connectionProductA.id, connectionProductB.id, connectionProductC.id],
    });

    // Get updated slugs for products in connection
    const connectionProductASlug = await createProductSlugWithConnections({
      product: connectionProductA,
      lang: DEFAULT_LANG,
    });
    await ProductModel.findByIdAndUpdate(connectionProductA.id, {
      slug: connectionProductASlug.slug,
    });
    const connectionProductBSlug = await createProductSlugWithConnections({
      product: connectionProductB,
      lang: DEFAULT_LANG,
    });
    await ProductModel.findByIdAndUpdate(connectionProductB.id, {
      slug: connectionProductBSlug.slug,
    });
    const connectionProductCSlug = await createProductSlugWithConnections({
      product: connectionProductC,
      lang: DEFAULT_LANG,
    });
    await ProductModel.findByIdAndUpdate(connectionProductC.id, {
      slug: connectionProductCSlug.slug,
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
