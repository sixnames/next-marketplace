import { createTestBrands, CreateTestBrandsPayloadInterface } from './createTestBrands';
import {
  ObjectIdModel,
  OptionModel,
  ProductAttributeModel,
  ProductConnectionModel,
  ProductModel,
} from 'db/dbModels';
import { generateSlug } from 'lib/slugUtils';
import { COL_PRODUCTS } from 'db/collectionNames';
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
            attributeId: attributeWineVintage._id,
            attributeSlug: attributeWineVintage.slug,
            attributeNameI18n: attributeWineVintage.nameI18n,
            attributeViewVariant: attributeWineVintage.viewVariant,
            attributeVariant: attributeWineVintage.variant,
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
            attributeId: attributeWineColor._id,
            attributeSlug: attributeWineColor.slug,
            attributeNameI18n: attributeWineColor.nameI18n,
            attributeViewVariant: attributeWineColor.viewVariant,
            attributeVariant: attributeWineColor.variant,
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
            attributeId: attributeWineVariant._id,
            attributeSlug: attributeWineVariant.slug,
            attributeNameI18n: attributeWineVariant.nameI18n,
            attributeViewVariant: attributeWineVariant.viewVariant,
            attributeVariant: attributeWineVariant.variant,
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
          attributeId: attributeString._id,
          attributeSlug: attributeString.slug,
          attributeNameI18n: attributeString.nameI18n,
          attributeViewVariant: attributeString.viewVariant,
          attributeVariant: attributeString.variant,
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
          attributeId: attributeWineCombinations._id,
          attributeSlug: attributeWineCombinations.slug,
          attributeNameI18n: attributeWineCombinations.nameI18n,
          attributeViewVariant: attributeWineCombinations.viewVariant,
          attributeVariant: attributeWineCombinations.variant,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: optionsSlugsCombination,
          selectedOptions: optionsCombination,
        },
        {
          attributeId: attributeNumber._id,
          attributeSlug: attributeNumber.slug,
          attributeNameI18n: attributeNumber.nameI18n,
          attributeViewVariant: attributeNumber.viewVariant,
          attributeVariant: attributeNumber.variant,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          selectedOptions: [],
          number: 99,
        },

        // Outer rating attributes
        {
          attributeId: attributeOuterRatingA._id,
          attributeSlug: attributeOuterRatingA.slug,
          attributeNameI18n: attributeOuterRatingA.nameI18n,
          attributeViewVariant: attributeOuterRatingA.viewVariant,
          attributeVariant: attributeOuterRatingA.variant,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          selectedOptions: [],
          number: 18,
        },
        {
          attributeId: attributeOuterRatingB._id,
          attributeSlug: attributeOuterRatingB.slug,
          attributeNameI18n: attributeOuterRatingB.nameI18n,
          attributeViewVariant: attributeOuterRatingB.viewVariant,
          attributeVariant: attributeOuterRatingB.variant,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          selectedOptions: [],
          number: 89,
        },
        {
          attributeId: attributeOuterRatingC._id,
          attributeSlug: attributeOuterRatingC.slug,
          attributeNameI18n: attributeOuterRatingC.nameI18n,
          attributeViewVariant: attributeOuterRatingC.viewVariant,
          attributeVariant: attributeOuterRatingC.variant,
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
    _id?: ObjectIdModel;
    rubricsIds: ObjectIdModel[];
    brandSlug?: string;
    brandCollectionSlug?: string;
    manufacturerSlug?: string;
    active?: boolean;
    defaultLocaleName: string;
    secondaryLocaleName: string;
    itemId: string;
    connections?: ProductConnectionModel[];
  }

  async function createTestProduct({
    _id = new ObjectId(),
    wineColorOption,
    wineTypeOption,
    wineVintageOption,
    rubricsIds,
    brandSlug,
    brandCollectionSlug,
    manufacturerSlug,
    defaultLocaleName,
    secondaryLocaleName,
    active = true,
    connections = [],
    itemId,
  }: CreateTestProductInterface): Promise<ProductModel> {
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

    return {
      _id,
      archive: false,
      itemId,
      updatedAt: new Date(),
      createdAt: new Date(),
      nameI18n: {
        [DEFAULT_LOCALE]: defaultLocaleName,
        [SECONDARY_LOCALE]: secondaryLocaleName,
      },
      ...DEFAULT_COUNTERS_OBJECT,
      descriptionI18n: {
        [DEFAULT_LOCALE]: defaultDescription,
        [SECONDARY_LOCALE]: secondaryDescription,
      },
      originalName: defaultLocaleName,
      assets: [assetA],
      shopProductsIds: [],
      shopProductsCountCities: {},
      minPriceCities: {},
      maxPriceCities: {},
      selectedOptionsSlugs,
      slug,
      connections,
      rubricsIds,
      brandSlug,
      brandCollectionSlug,
      manufacturerSlug,
      active,
      ...productAttributes({
        wineColorOption,
        wineTypeOption,
        wineVintageOption,
      }),
    };
  }

  const productA = await createTestProduct({
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[2],
    rubricsIds: [rubricA._id],
    brandSlug: brandA.slug,
    brandCollectionSlug: brandCollectionA.slug,
    manufacturerSlug: manufacturerA.slug,
    defaultLocaleName: `Product A ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product A ${SECONDARY_LOCALE}`,
    itemId: '1',
  });

  const productB = await createTestProduct({
    wineColorOption: attributeWineColor.options[2],
    wineTypeOption: attributeWineVariant.options[2],
    rubricsIds: [rubricA._id],
    brandSlug: brandB.slug,
    brandCollectionSlug: brandCollectionB.slug,
    manufacturerSlug: manufacturerB.slug,
    active: false,
    defaultLocaleName: `Product B ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product B ${SECONDARY_LOCALE}`,
    itemId: '2',
  });

  const productC = await createTestProduct({
    wineColorOption: attributeWineColor.options[0],
    wineTypeOption: attributeWineVariant.options[0],
    rubricsIds: [rubricB._id],
    brandSlug: brandA.slug,
    brandCollectionSlug: brandCollectionA.slug,
    manufacturerSlug: manufacturerA.slug,
    defaultLocaleName: `Product C ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product C ${SECONDARY_LOCALE}`,
    itemId: '3',
  });

  const productD = await createTestProduct({
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    rubricsIds: [rubricA._id],
    brandSlug: brandB.slug,
    brandCollectionSlug: brandCollectionB.slug,
    manufacturerSlug: manufacturerB.slug,
    defaultLocaleName: `Product D ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product D ${SECONDARY_LOCALE}`,
    itemId: '4',
  });

  const productF = await createTestProduct({
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    rubricsIds: [rubricA._id],
    manufacturerSlug: manufacturerA.slug,
    defaultLocaleName: `Product F ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product F ${SECONDARY_LOCALE}`,
    itemId: '5',
  });

  const connectionProductAId = new ObjectId();
  const connectionProductBId = new ObjectId();
  const connectionProductCId = new ObjectId();
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

  const connectionProductA = await createTestProduct({
    _id: connectionProductAId,
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    wineVintageOption: attributeWineVintage.options[0],
    connections: [connectionA],
    rubricsIds: [rubricA._id],
    brandSlug: brandC.slug,
    brandCollectionSlug: brandCollectionC.slug,
    manufacturerSlug: manufacturerC.slug,
    defaultLocaleName: `Connection Product ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Connection Product ${SECONDARY_LOCALE}`,
    itemId: '6',
  });

  const connectionProductB = await createTestProduct({
    _id: connectionProductBId,
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    wineVintageOption: attributeWineVintage.options[1],
    connections: [connectionA],
    rubricsIds: [rubricA._id],
    brandSlug: brandC.slug,
    brandCollectionSlug: brandCollectionC.slug,
    manufacturerSlug: manufacturerC.slug,
    defaultLocaleName: `Connection Product ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Connection Product ${SECONDARY_LOCALE}`,
    itemId: '7',
  });

  const connectionProductC = await createTestProduct({
    _id: connectionProductCId,
    wineColorOption: attributeWineColor.options[1],
    wineTypeOption: attributeWineVariant.options[1],
    wineVintageOption: attributeWineVintage.options[2],
    connections: [connectionA],
    rubricsIds: [rubricA._id],
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
    connectionA,
    allProducts,
  };
};
