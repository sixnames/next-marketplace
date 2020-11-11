import clearTestData from './clearTestData';
import createInitialData from '../initialData/createInitialData';
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
  MOCK_RUBRIC_LEVEL_ONE_B,
  MOCK_RUBRIC_LEVEL_ONE_C,
  MOCK_RUBRIC_LEVEL_ONE_D,
  MOCK_PRODUCT_D,
  MOCK_PRODUCT_E,
  MOCK_ATTRIBUTE_WINE_VINTAGE,
  MOCK_ATTRIBUTE_WINE_COMBINATIONS,
  MOCK_ATTRIBUTE_OUTER_RATING_A,
  MOCK_ATTRIBUTE_OUTER_RATING_B,
  MOCK_ATTRIBUTE_OUTER_RATING_C,
  MOCK_ATTRIBUTES_GROUP_OUTER_RATING,
  MOCK_COMPANY_OWNER,
  MOCK_COMPANY,
  MOCK_COMPANY_MANAGER,
  MOCK_SAMPLE_USER,
  MOCK_SHOP,
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
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
} from '@yagu/config';
import {
  ProductAttributeViewVariantEnum,
  ProductConnectionModel,
  ProductModel,
} from '../../entities/Product';
import { GenderEnum } from '../../entities/common';
import { generateTestProduct } from './generateTestProduct';
import { createProductSlugWithConnections } from '../connectios';
import { UserModel } from '../../entities/User';
import { hash } from 'bcryptjs';
import { CompanyModel } from '../../entities/Company';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_COMPANIES, ASSETS_DIST_SHOPS, ASSETS_DIST_SHOPS_LOGOS } from '../../config';
import { ShopModel } from '../../entities/Shop';
import { ShopProductModel } from '../../entities/ShopProduct';
import { createTestSecondaryCurrency } from './createTestSecondaryCurrency';
import { createTestSecondaryCity } from './createTestSecondaryCity';
import { createTestSecondaryCountry } from './createTestSecondaryCountry';
import { createTestSecondaryLanguage } from './createTestSecondaryLanguage';
import { createTestOptions } from './createTestOptions';

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
    const { initialRolesIds } = await createInitialData();

    // Currencies, countries and cities
    const { secondaryCurrency } = await createTestSecondaryCurrency();
    const { secondaryCity } = await createTestSecondaryCity();
    await createTestSecondaryCountry({
      citiesIds: [secondaryCity.id],
      currencySlug: secondaryCurrency.nameString,
    });

    // Languages
    await createTestSecondaryLanguage();

    // Options
    const {
      optionsGroupWineVintage,
      optionsGroupWineTypes,
      optionsGroupColors,
      optionsGroupCombination,
      optionsSlugsVintage,
      optionsSlugsColor,
      optionsSlugsWineType,
      optionsSlugsCombination,
    } = await createTestOptions();

    // Attributes
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
        showInSiteNav: false,
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
        showInSiteNav: false,
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
            node: attributesGroupOuterRating.id,
            showInCard: true,
            attributes: [
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
            ],
          },
        ],
      };
    };

    const productA = await ProductModel.create(
      await generateTestProduct({
        ...MOCK_PRODUCT_A,
        ...productAttributes({
          wineColorOptions: optionsSlugsColor[1],
          wineTypeOptions: optionsSlugsWineType[1],
        }),
        rubrics: [rubricLevelThreeAA.id],
      }),
    );

    const productB = await ProductModel.create(
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

    const productC = await ProductModel.create(
      await generateTestProduct({
        ...MOCK_PRODUCT_C,
        ...productAttributes({
          wineColorOptions: optionsSlugsColor[0],
          wineTypeOptions: optionsSlugsWineType[0],
        }),
        rubrics: [rubricLevelThreeAB.id],
      }),
    );

    const productD = await ProductModel.create(
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

    // Sample user
    const sampleUserPassword = await hash(MOCK_COMPANY_OWNER.password, 10);
    await UserModel.create({
      ...MOCK_SAMPLE_USER,
      role: initialRolesIds.guestRoleId,
      password: sampleUserPassword,
    });

    // Company owner
    const companyOwnerPassword = await hash(MOCK_COMPANY_OWNER.password, 10);
    const companyOwner = await UserModel.create({
      ...MOCK_COMPANY_OWNER,
      role: initialRolesIds.companyOwnerRoleId,
      password: companyOwnerPassword,
    });

    // Company manager
    const companyManagerPassword = await hash(MOCK_COMPANY_OWNER.password, 10);
    const companyManager = await UserModel.create({
      ...MOCK_COMPANY_MANAGER,
      role: initialRolesIds.companyOwnerRoleId,
      password: companyManagerPassword,
    });

    // Shop products
    const shopAProductA = await ShopProductModel.create({
      available: 1,
      price: 100,
      oldPrices: [],
      product: productA.id,
    });

    const shopAProductB = await ShopProductModel.create({
      available: 3,
      price: 180,
      oldPrices: [],
      product: productB.id,
    });

    const shopAProductC = await ShopProductModel.create({
      available: 12,
      price: 1200,
      oldPrices: [],
      product: productC.id,
    });

    const shopAProductD = await ShopProductModel.create({
      available: 0,
      price: 980,
      oldPrices: [],
      product: productD.id,
    });

    const shopAConnectionProductA = await ShopProductModel.create({
      available: 32,
      price: 480,
      oldPrices: [],
      product: connectionProductA.id,
    });

    const shopAConnectionProductB = await ShopProductModel.create({
      available: 0,
      price: 680,
      oldPrices: [],
      product: connectionProductB.id,
    });

    const shopAConnectionProductC = await ShopProductModel.create({
      available: 45,
      price: 720,
      oldPrices: [],
      product: connectionProductC.id,
    });

    // Company and shop assets
    const shopLogo = await generateTestAsset({
      targetFileName: 'test-company-logo',
      dist: ASSETS_DIST_SHOPS_LOGOS,
      slug: MOCK_SHOP.slug,
    });

    const shopAAssetA = await generateTestAsset({
      targetFileName: 'test-shop-asset-0',
      dist: ASSETS_DIST_SHOPS,
      slug: MOCK_SHOP.slug,
    });

    // Shop
    const shop = await ShopModel.create({
      ...MOCK_SHOP,
      logo: shopLogo,
      assets: [shopAAssetA],
      products: [
        shopAProductA.id,
        shopAProductB.id,
        shopAProductC.id,
        shopAProductD.id,
        shopAConnectionProductA.id,
        shopAConnectionProductB.id,
        shopAConnectionProductC.id,
      ],
    });

    // Company
    const companyLogo = await generateTestAsset({
      targetFileName: 'test-company-logo',
      dist: ASSETS_DIST_COMPANIES,
      slug: MOCK_COMPANY.slug,
    });

    await CompanyModel.create({
      ...MOCK_COMPANY,
      owner: companyOwner.id,
      logo: companyLogo,
      staff: [companyManager.id],
      shops: [shop.id],
    });
  } catch (e) {
    console.log('========== createTestData ERROR ==========', '\n', e);
  }
};

export default createTestData;
