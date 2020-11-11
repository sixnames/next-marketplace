import clearTestData from './clearTestData';
import createInitialData from '../initialData/createInitialData';
import {
  MOCK_PRODUCT_A,
  MOCK_PRODUCT_C,
  MOCK_PRODUCT_B,
  MOCK_PRODUCT_D,
  MOCK_PRODUCT_E,
  MOCK_COMPANY_OWNER,
  MOCK_COMPANY,
  MOCK_COMPANY_MANAGER,
  MOCK_SAMPLE_USER,
  MOCK_SHOP,
} from '@yagu/mocks';
import {
  DEFAULT_LANG,
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
import { createTestAttributes } from './createTestAttributes';
import { createTestRubricVariants } from './createTestRubricVariants';
import { createTestRubrics } from './createTestRubrics';

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
    const attributes = await createTestAttributes({
      optionsGroupWineVintage,
      optionsGroupWineTypes,
      optionsGroupColors,
      optionsGroupCombination,
    });

    const {
      attributesGroupOuterRating,
      attributesGroupWineFeatures,
      attributeOuterRatingA,
      attributeOuterRatingB,
      attributeOuterRatingC,
      attributeWineCombinations,
      attributeWineVintage,
      attributeWineColor,
      attributeWineType,
      attributeString,
      attributeNumber,
    } = attributes;

    // Rubric variants
    const rubricVariants = await createTestRubricVariants();

    // Rubrics
    const rubrics = await createTestRubrics({
      ...rubricVariants,
      ...attributes,
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
