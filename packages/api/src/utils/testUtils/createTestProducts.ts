import { Product, ProductModel } from '../../entities/Product';
import { createProductSlugWithConnections } from '../connectios';
import { ProductConnection, ProductConnectionModel } from '../../entities/ProductConnection';
import { ProductAttributeViewVariantEnum } from '../../entities/ProductAttribute';
import { createTestBrands, CreateTestBrandsPayloadInterface } from './createTestBrands';
import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  DEFAULT_CITY,
  DEFAULT_LANG,
  SECONDARY_LANG,
} from '@yagu/shared';
import * as faker from 'faker';
import { generateSlug } from '../slug';
import generateTestAsset from './generateTestAsset';
import { ASSETS_DIST_PRODUCTS } from '../../config';

interface ProductAttributesInterface {
  wineColorOptions?: string;
  wineTypeOptions?: string;
  wineVintageOptions?: string;
}

interface CreateTestProductInterface extends ProductAttributesInterface {
  rubrics: string[];
  brand?: string;
  brandCollection?: string;
  manufacturer?: string;
  active?: boolean;
}

export interface CreateTestProductsPayloadInterface extends CreateTestBrandsPayloadInterface {
  productA: Product;
  productB: Product;
  productC: Product;
  productD: Product;
  productF: Product;
  connectionProductA: Product;
  connectionProductB: Product;
  connectionProductC: Product;
  allProducts: Product[];
  connectionA: ProductConnection;
}

export const createTestProducts = async (): Promise<CreateTestProductsPayloadInterface> => {
  const brandsPayload = await createTestBrands();
  const {
    attributeWineVintage,
    attributeWineColor,
    attributeWineType,
    attributesGroupOuterRating,
    attributeOuterRatingA,
    attributeOuterRatingB,
    attributeOuterRatingC,
    attributesGroupWineFeatures,
    attributeString,
    attributeWineCombinations,
    optionsSlugsCombination,
    attributeNumber,
    optionsSlugsColor,
    optionsSlugsWineType,
    rubricLevelThreeAA,
    rubricLevelThreeAB,
    optionsSlugsVintage,
    brandA,
    brandB,
    brandC,
    manufacturerA,
    manufacturerB,
    manufacturerC,
    brandCollectionA,
    brandCollectionB,
    brandCollectionC,
  } = brandsPayload;

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
            showAsBreadcrumb: false,
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
            showAsBreadcrumb: true,
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
            showAsBreadcrumb: true,
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
              showAsBreadcrumb: false,
              value: ['4.2'],
              viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING as ProductAttributeViewVariantEnum,
            },
            {
              node: attributeOuterRatingB.id,
              showInCard: true,
              key: attributeOuterRatingB.slug,
              showAsBreadcrumb: false,
              value: ['88'],
              viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING as ProductAttributeViewVariantEnum,
            },
            {
              node: attributeOuterRatingC.id,
              showInCard: true,
              key: attributeOuterRatingC.slug,
              showAsBreadcrumb: false,
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
              showAsBreadcrumb: false,
              value: [
                'Very long string attribute. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet architecto consectetur, consequatur cumque cupiditate enim laborum nihil nisi obcaecati officia perspiciatis quidem quos rem similique sunt ut voluptatum! Deleniti, provident!',
              ],
              viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT as ProductAttributeViewVariantEnum,
            },
            {
              node: attributeWineCombinations.id,
              showInCard: true,
              key: attributeWineCombinations.slug,
              showAsBreadcrumb: false,
              value: optionsSlugsCombination,
              viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON as ProductAttributeViewVariantEnum,
            },
            {
              node: attributeNumber.id,
              showInCard: true,
              key: attributeNumber.slug,
              showAsBreadcrumb: false,
              value: ['123'],
              viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT as ProductAttributeViewVariantEnum,
            },
          ],
        },
      ],
    };
  };

  async function createTestProduct({
    wineColorOptions,
    wineTypeOptions,
    wineVintageOptions,
    rubrics,
    brand,
    brandCollection,
    manufacturer,
    active = true,
  }: CreateTestProductInterface) {
    const name = faker.commerce.productName();
    const cardName = `Card name ${name}`;
    const description = faker.commerce.productDescription();
    const slug = generateSlug(cardName);

    const assetA = await generateTestAsset({
      targetFileName: 'test-image-0',
      dist: ASSETS_DIST_PRODUCTS,
      slug,
    });

    const product = await ProductModel.create({
      name: [
        { key: DEFAULT_LANG, value: name },
        { key: SECONDARY_LANG, value: name },
      ],
      cardName: [
        { key: DEFAULT_LANG, value: cardName },
        { key: SECONDARY_LANG, value: cardName },
      ],
      views: [{ key: DEFAULT_CITY, counter: faker.random.number(20) }],
      priorities: [{ key: DEFAULT_CITY, counter: faker.random.number(20) }],
      description: [
        { key: DEFAULT_LANG, value: description },
        { key: SECONDARY_LANG, value: description },
      ],
      originalName: name,
      assets: [assetA],
      rubrics,
      brand,
      brandCollection,
      manufacturer,
      slug,
      active,
      ...productAttributes({
        wineColorOptions,
        wineTypeOptions,
        wineVintageOptions,
      }),
    });
    if (!product) {
      throw Error('Error in createTestProduct');
    }
    return product;
  }

  const productA = await createTestProduct({
    wineColorOptions: optionsSlugsColor[1],
    wineTypeOptions: optionsSlugsWineType[2],
    rubrics: [rubricLevelThreeAA.id],
    brand: brandA.slug,
    brandCollection: brandCollectionA.slug,
    manufacturer: manufacturerA.slug,
  });

  const productB = await createTestProduct({
    wineColorOptions: optionsSlugsColor[2],
    wineTypeOptions: optionsSlugsWineType[2],
    rubrics: [rubricLevelThreeAA.id],
    brand: brandB.slug,
    brandCollection: brandCollectionB.slug,
    manufacturer: manufacturerB.slug,
    active: false,
  });

  const productC = await createTestProduct({
    wineColorOptions: optionsSlugsColor[0],
    wineTypeOptions: optionsSlugsWineType[0],
    rubrics: [rubricLevelThreeAB.id],
    brand: brandA.slug,
    brandCollection: brandCollectionA.slug,
    manufacturer: manufacturerA.slug,
  });

  const productD = await createTestProduct({
    wineColorOptions: optionsSlugsColor[1],
    wineTypeOptions: optionsSlugsWineType[1],
    rubrics: [rubricLevelThreeAA.id],
    brand: brandB.slug,
    brandCollection: brandCollectionB.slug,
    manufacturer: manufacturerB.slug,
  });

  const productF = await createTestProduct({
    wineColorOptions: optionsSlugsColor[1],
    wineTypeOptions: optionsSlugsWineType[1],
    rubrics: [rubricLevelThreeAA.id],
    manufacturer: manufacturerA.slug,
  });

  const connectionProductA = await createTestProduct({
    wineColorOptions: optionsSlugsColor[1],
    wineTypeOptions: optionsSlugsWineType[1],
    wineVintageOptions: optionsSlugsVintage[0],
    rubrics: [rubricLevelThreeAA.id],
    brand: brandC.slug,
    brandCollection: brandCollectionC.slug,
    manufacturer: manufacturerC.slug,
  });

  const connectionProductB = await createTestProduct({
    wineColorOptions: optionsSlugsColor[1],
    wineTypeOptions: optionsSlugsWineType[1],
    wineVintageOptions: optionsSlugsVintage[1],
    rubrics: [rubricLevelThreeAA.id],
    brand: brandC.slug,
    brandCollection: brandCollectionC.slug,
    manufacturer: manufacturerC.slug,
  });

  const connectionProductC = await createTestProduct({
    wineColorOptions: optionsSlugsColor[1],
    wineTypeOptions: optionsSlugsWineType[1],
    wineVintageOptions: optionsSlugsVintage[2],
    rubrics: [rubricLevelThreeAA.id],
    brand: brandC.slug,
    brandCollection: brandCollectionC.slug,
    manufacturer: manufacturerC.slug,
  });

  // Product connections
  const connectionA = await ProductConnectionModel.create({
    attributeId: attributeWineVintage.id,
    attributesGroupId: attributesGroupWineFeatures.id,
    productsIds: [connectionProductA.id, connectionProductB.id, connectionProductC.id],
  });

  // Get updated slugs for products in connection
  const connectionProductASlug = await createProductSlugWithConnections({
    product: connectionProductA,
    lang: DEFAULT_LANG,
  });
  const updatedConnectionProductA = await ProductModel.findByIdAndUpdate(
    connectionProductA.id,
    {
      slug: connectionProductASlug.slug,
    },
    { new: true },
  );
  if (!updatedConnectionProductA) {
    throw Error('updatedConnectionProductA error');
  }

  const connectionProductBSlug = await createProductSlugWithConnections({
    product: connectionProductB,
    lang: DEFAULT_LANG,
  });
  const updatedConnectionProductB = await ProductModel.findByIdAndUpdate(
    connectionProductB.id,
    {
      slug: connectionProductBSlug.slug,
    },
    { new: true },
  );
  if (!updatedConnectionProductB) {
    throw Error('updatedConnectionProductB error');
  }

  const connectionProductCSlug = await createProductSlugWithConnections({
    product: connectionProductC,
    lang: DEFAULT_LANG,
  });
  const updatedConnectionProductC = await ProductModel.findByIdAndUpdate(
    connectionProductC.id,
    {
      slug: connectionProductCSlug.slug,
    },
    { new: true },
  );
  if (!updatedConnectionProductC) {
    throw Error('updatedConnectionProductC error');
  }

  const allProducts = [
    productA,
    productB,
    productC,
    productD,
    productF,
    connectionProductA,
    connectionProductB,
    connectionProductC,
  ];

  return {
    ...brandsPayload,
    productA,
    productB,
    productC,
    productD,
    productF,
    connectionProductA: updatedConnectionProductA,
    connectionProductB: updatedConnectionProductB,
    connectionProductC: updatedConnectionProductC,
    connectionA,
    allProducts,
  };
};
