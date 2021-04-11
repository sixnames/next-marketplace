import { createTestBrands, CreateTestBrandsPayloadInterface } from './createTestBrands';
import {
  ObjectIdModel,
  OptionModel,
  ProductAttributeModel,
  ProductConnectionModel,
  ProductFacetModel,
  ProductModel,
} from 'db/dbModels';
import { generateSlug } from 'lib/slugUtils';
import { COL_PRODUCT_FACETS, COL_PRODUCTS } from 'db/collectionNames';
import {
  ASSETS_DIST_PRODUCTS,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  SECONDARY_LOCALE,
} from 'config/common';
import { ObjectId } from 'mongodb';
import { setCollectionItemId } from 'lib/itemIdUtils';
import { getDatabase } from 'db/mongodb';
import path from 'path';
import { findOrCreateTestAsset } from 'lib/s3';

interface ProductAttributesInterface {
  wineColorOption?: OptionModel;
  wineTypeOption?: OptionModel;
  wineVintageOption?: OptionModel;
}

export interface CreateTestProductsPayloadInterface extends CreateTestBrandsPayloadInterface {
  productA: ProductModel;
  productB: ProductModel;
  productC: ProductModel;
  productD: ProductModel;
  productF: ProductModel;
  connectionProductA: ProductModel;
  connectionProductB: ProductModel;
  connectionProductC: ProductModel;
  allProducts: ProductModel[];
  facetA: ProductFacetModel;
  facetB: ProductFacetModel;
  facetC: ProductFacetModel;
  facetD: ProductFacetModel;
  facetF: ProductFacetModel;
  connectionProductFacetA: ProductFacetModel;
  connectionProductFacetB: ProductFacetModel;
  connectionProductFacetC: ProductFacetModel;
  connectionA: ProductConnectionModel;
}

export const createTestProducts = async (): Promise<CreateTestProductsPayloadInterface> => {
  const brandsPayload = await createTestBrands();
  const {
    attributeWineVintage,
    attributeWineColor,
    attributeWineVariant,
    attributeOuterRatingA,
    attributeOuterRatingB,
    attributeOuterRatingC,
    attributeString,
    attributeWineCombinations,
    optionsSlugsCombination,
    optionsCombination,
    attributeNumber,
    rubricA,
    rubricB,
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
    wineColorOption,
    wineTypeOption,
    wineVintageOption,
  }: ProductAttributesInterface): {
    attributes: ProductAttributeModel[];
  } => {
    const vintageAttribute: ProductAttributeModel[] = wineVintageOption
      ? [
          {
            _id: attributeWineVintage._id,
            attributeId: attributeWineVintage._id,
            attributeSlug: attributeWineVintage.slug,
            attributeNameI18n: attributeWineVintage.nameI18n,
            attributeViewVariant: attributeWineVintage.viewVariant,
            attributeVariant: attributeWineVintage.variant,
            attributeMetric: attributeWineVintage.metric,
            showInCard: true,
            showAsBreadcrumb: false,
            selectedOptions: [wineVintageOption],
            selectedOptionsSlugs: [wineVintageOption.slug],
          },
        ]
      : [];

    const colorAttribute: ProductAttributeModel[] = wineColorOption
      ? [
          {
            _id: attributeWineColor._id,
            attributeId: attributeWineColor._id,
            attributeSlug: attributeWineColor.slug,
            attributeNameI18n: attributeWineColor.nameI18n,
            attributeViewVariant: attributeWineColor.viewVariant,
            attributeVariant: attributeWineColor.variant,
            attributeMetric: attributeWineColor.metric,
            showInCard: true,
            showAsBreadcrumb: true,
            selectedOptions: [wineColorOption],
            selectedOptionsSlugs: [wineColorOption.slug],
          },
        ]
      : [];

    const wineTypeAttribute: ProductAttributeModel[] = wineTypeOption
      ? [
          {
            _id: attributeWineVariant._id,
            attributeId: attributeWineVariant._id,
            attributeSlug: attributeWineVariant.slug,
            attributeNameI18n: attributeWineVariant.nameI18n,
            attributeViewVariant: attributeWineVariant.viewVariant,
            attributeVariant: attributeWineVariant.variant,
            attributeMetric: attributeWineVariant.metric,
            showInCard: true,
            showAsBreadcrumb: true,
            selectedOptions: [wineTypeOption],
            selectedOptionsSlugs: [wineTypeOption.slug],
          },
        ]
      : [];

    return {
      attributes: [
        // Wine features attributes
        ...vintageAttribute,
        ...colorAttribute,
        ...wineTypeAttribute,
        {
          _id: attributeString._id,
          attributeId: attributeString._id,
          attributeSlug: attributeString.slug,
          attributeNameI18n: attributeString.nameI18n,
          attributeViewVariant: attributeString.viewVariant,
          attributeVariant: attributeString.variant,
          attributeMetric: attributeString.metric,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          selectedOptions: [],
          textI18n: {
            [DEFAULT_LOCALE]: 'Описание',
            [SECONDARY_LOCALE]: 'description',
          },
        },
        {
          _id: attributeWineCombinations._id,
          attributeId: attributeWineCombinations._id,
          attributeSlug: attributeWineCombinations.slug,
          attributeNameI18n: attributeWineCombinations.nameI18n,
          attributeViewVariant: attributeWineCombinations.viewVariant,
          attributeVariant: attributeWineCombinations.variant,
          attributeMetric: attributeWineCombinations.metric,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: optionsSlugsCombination,
          selectedOptions: optionsCombination,
        },
        {
          _id: attributeNumber._id,
          attributeId: attributeNumber._id,
          attributeSlug: attributeNumber.slug,
          attributeNameI18n: attributeNumber.nameI18n,
          attributeViewVariant: attributeNumber.viewVariant,
          attributeVariant: attributeNumber.variant,
          attributeMetric: attributeNumber.metric,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          selectedOptions: [],
          number: 99,
        },

        // Outer rating attributes
        {
          _id: attributeOuterRatingA._id,
          attributeId: attributeOuterRatingA._id,
          attributeSlug: attributeOuterRatingA.slug,
          attributeNameI18n: attributeOuterRatingA.nameI18n,
          attributeViewVariant: attributeOuterRatingA.viewVariant,
          attributeVariant: attributeOuterRatingA.variant,
          attributeMetric: attributeOuterRatingA.metric,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          selectedOptions: [],
          number: 18,
        },
        {
          _id: attributeOuterRatingB._id,
          attributeId: attributeOuterRatingB._id,
          attributeSlug: attributeOuterRatingB.slug,
          attributeNameI18n: attributeOuterRatingB.nameI18n,
          attributeViewVariant: attributeOuterRatingB.viewVariant,
          attributeVariant: attributeOuterRatingB.variant,
          attributeMetric: attributeOuterRatingB.metric,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          selectedOptions: [],
          number: 89,
        },
        {
          _id: attributeOuterRatingC._id,
          attributeId: attributeOuterRatingC._id,
          attributeSlug: attributeOuterRatingC.slug,
          attributeNameI18n: attributeOuterRatingC.nameI18n,
          attributeViewVariant: attributeOuterRatingC.viewVariant,
          attributeVariant: attributeOuterRatingC.variant,
          attributeMetric: attributeOuterRatingC.metric,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          selectedOptions: [],
          number: 4,
        },
      ],
    };
  };

  interface CreateTestProductInterface extends ProductAttributesInterface {
    _id: ObjectIdModel;
    rubricId: ObjectIdModel;
    brandSlug?: string;
    brandCollectionSlug?: string;
    manufacturerSlug?: string;
    active?: boolean;
    defaultLocaleName: string;
    secondaryLocaleName: string;
    itemId: string;
    connections?: ProductConnectionModel[];
  }

  interface CreateTestProductPayloadInterface {
    product: ProductModel;
    facet: ProductFacetModel;
  }

  async function createTestProduct({
    _id,
    wineColorOption,
    wineTypeOption,
    wineVintageOption,
    rubricId,
    brandSlug,
    brandCollectionSlug,
    manufacturerSlug,
    defaultLocaleName,
    secondaryLocaleName,
    active = true,
    connections = [],
    itemId,
  }: CreateTestProductInterface): Promise<CreateTestProductPayloadInterface> {
    const defaultDescription = 'defaultDescription';
    const secondaryDescription = 'secondaryDescription';
    const slug = generateSlug(defaultLocaleName);

    const selectedOptionsSlugs = [
      `${wineColorOption?.slug}`,
      `${wineTypeOption?.slug}`,
      `${wineVintageOption?.slug}`,
    ];

    const localFilePath = path.join(process.cwd(), 'tests', 'mockAssets', 'test-product-0.png');
    const s3Url = await findOrCreateTestAsset({
      localFilePath,
      dist: `${ASSETS_DIST_PRODUCTS}/${itemId}`,
      fileName: itemId,
    });

    const assetA = {
      url: s3Url,
      index: 0,
    };

    const product: ProductModel = {
      _id,
      active,
      itemId,
      originalName: defaultLocaleName,
      nameI18n: {
        [DEFAULT_LOCALE]: defaultLocaleName,
        [SECONDARY_LOCALE]: secondaryLocaleName,
      },
      descriptionI18n: {
        [DEFAULT_LOCALE]: defaultDescription,
        [SECONDARY_LOCALE]: secondaryDescription,
      },
      assets: [assetA],
      mainImage: assetA.url,
      slug,
      connections,
      rubricId,
      brandSlug,
      brandCollectionSlug,
      manufacturerSlug,
      updatedAt: new Date(),
      createdAt: new Date(),
      ...DEFAULT_COUNTERS_OBJECT,
      ...productAttributes({
        wineColorOption,
        wineTypeOption,
        wineVintageOption,
      }),
    };

    const facet: ProductFacetModel = {
      _id,
      itemId,
      slug,
      mainImage: assetA.url,
      originalName: defaultLocaleName,
      nameI18n: {
        [DEFAULT_LOCALE]: defaultLocaleName,
        [SECONDARY_LOCALE]: secondaryLocaleName,
      },
      active,
      rubricId,
      brandSlug,
      brandCollectionSlug,
      manufacturerSlug,
      selectedOptionsSlugs,
    };

    return {
      product,
      facet,
    };
  }

  const { product: productA, facet: facetA } = await createTestProduct({
    _id: new ObjectId('604cad83b604c1c320c3289b'),
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[2],
    rubricId: rubricA._id,
    brandSlug: brandA.slug,
    brandCollectionSlug: brandCollectionA.slug,
    manufacturerSlug: manufacturerA.slug,
    defaultLocaleName: `Product A ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product A ${SECONDARY_LOCALE}`,
    itemId: '1',
  });

  const { product: productB, facet: facetB } = await createTestProduct({
    _id: new ObjectId('604cad83b604c1c320c3289c'),
    wineColorOption: attributeWineColor.options[2],
    wineTypeOption: attributeWineVariant.options[2],
    rubricId: rubricA._id,
    brandSlug: brandB.slug,
    brandCollectionSlug: brandCollectionB.slug,
    manufacturerSlug: manufacturerB.slug,
    active: false,
    defaultLocaleName: `Product B ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product B ${SECONDARY_LOCALE}`,
    itemId: '2',
  });

  const { product: productC, facet: facetC } = await createTestProduct({
    _id: new ObjectId('604cad83b604c1c320c3289d'),
    wineColorOption: attributeWineColor.options[0],
    wineTypeOption: attributeWineVariant.options[0],
    rubricId: rubricB._id,
    brandSlug: brandA.slug,
    brandCollectionSlug: brandCollectionA.slug,
    manufacturerSlug: manufacturerA.slug,
    defaultLocaleName: `Product C ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product C ${SECONDARY_LOCALE}`,
    itemId: '3',
  });

  const { product: productD, facet: facetD } = await createTestProduct({
    _id: new ObjectId('604cad84b604c1c320c3289e'),
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    rubricId: rubricA._id,
    brandSlug: brandB.slug,
    brandCollectionSlug: brandCollectionB.slug,
    manufacturerSlug: manufacturerB.slug,
    defaultLocaleName: `Product D ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product D ${SECONDARY_LOCALE}`,
    itemId: '4',
  });

  const { product: productF, facet: facetF } = await createTestProduct({
    _id: new ObjectId('604cad84b604c1c320c3289f'),
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    rubricId: rubricA._id,
    manufacturerSlug: manufacturerA.slug,
    defaultLocaleName: `Product F ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product F ${SECONDARY_LOCALE}`,
    itemId: '5',
  });

  const connectionProductAId = new ObjectId('604cad84b604c1c320c328a0');
  const connectionProductBId = new ObjectId('604cad84b604c1c320c328a1');
  const connectionProductCId = new ObjectId('604cad84b604c1c320c328a2');
  const connectionA: ProductConnectionModel = {
    _id: new ObjectId(),
    attributeId: attributeWineVintage._id,
    attributeSlug: attributeWineVintage.slug,
    attributeNameI18n: attributeWineVintage.nameI18n,
    attributeVariant: attributeWineVintage.variant,
    attributeViewVariant: attributeWineVintage.viewVariant,
    connectionProducts: [
      {
        _id: connectionProductAId,
        productId: connectionProductAId,
        option: attributeWineVintage.options[0],
      },
      {
        _id: connectionProductBId,
        productId: connectionProductBId,
        option: attributeWineVintage.options[1],
      },
      {
        _id: connectionProductCId,
        productId: connectionProductCId,
        option: attributeWineVintage.options[2],
      },
    ],
  };

  const { product: connectionProductA, facet: connectionProductFacetA } = await createTestProduct({
    _id: connectionProductAId,
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    wineVintageOption: attributeWineVintage.options[0],
    connections: [connectionA],
    rubricId: rubricA._id,
    brandSlug: brandC.slug,
    brandCollectionSlug: brandCollectionC.slug,
    manufacturerSlug: manufacturerC.slug,
    defaultLocaleName: `Connection Product ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Connection Product ${SECONDARY_LOCALE}`,
    itemId: '6',
  });

  const { product: connectionProductB, facet: connectionProductFacetB } = await createTestProduct({
    _id: connectionProductBId,
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    wineVintageOption: attributeWineVintage.options[1],
    connections: [connectionA],
    rubricId: rubricA._id,
    brandSlug: brandC.slug,
    brandCollectionSlug: brandCollectionC.slug,
    manufacturerSlug: manufacturerC.slug,
    defaultLocaleName: `Connection Product ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Connection Product ${SECONDARY_LOCALE}`,
    itemId: '7',
  });

  const { product: connectionProductC, facet: connectionProductFacetC } = await createTestProduct({
    _id: connectionProductCId,
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    wineVintageOption: attributeWineVintage.options[2],
    connections: [connectionA],
    rubricId: rubricA._id,
    brandSlug: brandC.slug,
    brandCollectionSlug: brandCollectionC.slug,
    manufacturerSlug: manufacturerC.slug,
    defaultLocaleName: `Connection Product ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Connection Product ${SECONDARY_LOCALE}`,
    itemId: '8',
  });

  await setCollectionItemId(COL_PRODUCTS, 8);

  // Product connections
  const db = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  await productsCollection.insertMany([
    productA,
    productB,
    productC,
    productD,
    productF,
    connectionProductA,
    connectionProductB,
    connectionProductC,
  ]);
  await productFacetsCollection.insertMany([
    facetA,
    facetB,
    facetC,
    facetD,
    facetF,
    connectionProductFacetA,
    connectionProductFacetB,
    connectionProductFacetC,
  ]);

  // Get updated slugs for products in connection
  // A
  const connectionProductASlug = 'connectionProductASlug';
  const updatedConnectionProductAOperation = await productsCollection.findOneAndUpdate(
    { _id: connectionProductA._id },
    {
      $set: {
        slug: connectionProductASlug,
      },
    },
    {
      returnOriginal: false,
    },
  );
  if (!updatedConnectionProductAOperation.ok || !updatedConnectionProductAOperation.value) {
    throw Error('updatedConnectionProductA error');
  }
  const updatedConnectionProductA = updatedConnectionProductAOperation.value;

  // B
  const connectionProductBSlug = 'connectionProductBSlug';
  const updatedConnectionProductBOperation = await productsCollection.findOneAndUpdate(
    { _id: connectionProductB._id },
    {
      $set: {
        slug: connectionProductBSlug,
      },
    },
    { returnOriginal: false },
  );
  if (!updatedConnectionProductBOperation.ok || !updatedConnectionProductBOperation.value) {
    throw Error('updatedConnectionProductB error');
  }
  const updatedConnectionProductB = updatedConnectionProductBOperation.value;

  // C
  const connectionProductCSlug = 'connectionProductCSlug';
  const updatedConnectionProductCOperation = await productsCollection.findOneAndUpdate(
    { _id: connectionProductC._id },
    {
      $set: {
        slug: connectionProductCSlug,
      },
    },
    { returnOriginal: false },
  );
  if (!updatedConnectionProductCOperation.ok || !updatedConnectionProductCOperation.value) {
    throw Error('updatedConnectionProductB error');
  }
  const updatedConnectionProductC = updatedConnectionProductCOperation.value;

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
    allProducts,
    facetA,
    facetB,
    facetC,
    facetD,
    facetF,
    connectionProductFacetA,
    connectionProductFacetB,
    connectionProductFacetC,
    connectionA,
  };
};
