import { createTestRubrics, CreateTestRubricsPayloadInterface } from './createTestRubrics';
import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  DEFAULT_LANG,
} from '@yagu/config';
import { Product, ProductModel } from '../../entities/Product';
import { generateTestProduct } from './generateTestProduct';
import {
  MOCK_PRODUCT_A,
  MOCK_PRODUCT_B,
  MOCK_PRODUCT_C,
  MOCK_PRODUCT_D,
  MOCK_PRODUCT_E,
  MOCK_PRODUCT_F,
} from '@yagu/mocks';
import { createProductSlugWithConnections } from '../connectios';
import { ProductConnection, ProductConnectionModel } from '../../entities/ProductConnection';
import { ProductAttributeViewVariantEnum } from '../../entities/ProductAttribute';

interface ProductAttributesInterface {
  wineColorOptions?: string;
  wineTypeOptions?: string;
  wineVintageOptions?: string;
}

export interface CreateTestProductsPayloadInterface extends CreateTestRubricsPayloadInterface {
  productA: Product;
  productB: Product;
  productC: Product;
  productD: Product;
  productF: Product;
  connectionProductA: Product;
  connectionProductB: Product;
  connectionProductC: Product;
  connectionA: ProductConnection;
}

export const createTestProducts = async (): Promise<CreateTestProductsPayloadInterface> => {
  const rubricsPayload = await createTestRubrics();
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
  } = rubricsPayload;

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

  const productF = await ProductModel.create(
    await generateTestProduct({
      ...MOCK_PRODUCT_F,
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

  return {
    ...rubricsPayload,
    productA,
    productB,
    productC,
    productD,
    productF,
    connectionProductA: updatedConnectionProductA,
    connectionProductB: updatedConnectionProductB,
    connectionProductC: updatedConnectionProductC,
    connectionA,
  };
};
