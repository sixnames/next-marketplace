import { createTestBrands, CreateTestBrandsPayloadInterface } from './createTestBrands';
import {
  ObjectIdModel,
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
  wineColorOptionsSlug?: string;
  wineTypeOptionsSlug?: string;
  wineVintageOptionsSlug?: string;
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
    wineColorOptionsSlug,
    wineTypeOptionsSlug,
    wineVintageOptionsSlug,
  }: ProductAttributesInterface): {
    attributes: ProductAttributeModel[];
  } => {
    const vintageAttribute: ProductAttributeModel[] = wineVintageOptionsSlug
      ? [
          {
            attributeId: attributeWineVintage._id,
            attributeSlug: attributeWineVintage.slug,
            showInCard: true,
            showAsBreadcrumb: false,
            selectedOptionsSlugs: [wineVintageOptionsSlug],
            attributeSlugs: [`${attributeWineVintage.slug}-${wineVintageOptionsSlug}`],
          },
        ]
      : [];

    const colorAttribute: ProductAttributeModel[] = wineColorOptionsSlug
      ? [
          {
            attributeId: attributeWineColor._id,
            attributeSlug: attributeWineColor.slug,
            showInCard: true,
            showAsBreadcrumb: true,
            selectedOptionsSlugs: [wineColorOptionsSlug],
            attributeSlugs: [`${attributeWineColor.slug}-${wineColorOptionsSlug}`],
          },
        ]
      : [];

    const wineTypeAttribute: ProductAttributeModel[] = wineTypeOptionsSlug
      ? [
          {
            attributeId: attributeWineVariant._id,
            attributeSlug: attributeWineVariant.slug,
            showInCard: true,
            showAsBreadcrumb: true,
            selectedOptionsSlugs: [wineTypeOptionsSlug],
            attributeSlugs: [`${attributeWineVariant.slug}-${wineTypeOptionsSlug}`],
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
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          attributeSlugs: [],
          textI18n: {
            [DEFAULT_LOCALE]: 'Описание',
            [SECONDARY_LOCALE]: 'description',
          },
        },
        {
          attributeId: attributeWineCombinations._id,
          attributeSlug: attributeWineCombinations.slug,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: optionsSlugsCombination,
          attributeSlugs: optionsSlugsCombination.map((optionSlug) => {
            return `${attributeWineCombinations.slug}-${optionSlug}`;
          }),
        },
        {
          attributeId: attributeNumber._id,
          attributeSlug: attributeNumber.slug,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          attributeSlugs: [],
          number: 99,
        },

        // Outer rating attributes
        {
          attributeId: attributeOuterRatingA._id,
          attributeSlug: attributeOuterRatingA.slug,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          attributeSlugs: [],
          number: 18,
        },
        {
          attributeId: attributeOuterRatingB._id,
          attributeSlug: attributeOuterRatingB.slug,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          attributeSlugs: [],
          number: 89,
        },
        {
          attributeId: attributeOuterRatingC._id,
          attributeSlug: attributeOuterRatingC.slug,
          showInCard: true,
          showAsBreadcrumb: false,
          selectedOptionsSlugs: [],
          attributeSlugs: [],
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
    wineColorOptionsSlug,
    wineTypeOptionsSlug,
    wineVintageOptionsSlug,
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
      `${wineColorOptionsSlug}`,
      `${wineTypeOptionsSlug}`,
      `${wineVintageOptionsSlug}`,
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
        wineColorOptionsSlug,
        wineTypeOptionsSlug,
        wineVintageOptionsSlug,
      }),
    };
  }

  const productA = await createTestProduct({
    wineColorOptionsSlug: attributeWineColor.options[1].slug,
    wineTypeOptionsSlug: attributeWineVariant.options[2].slug,
    rubricsIds: [rubricA._id],
    brandSlug: brandA.slug,
    brandCollectionSlug: brandCollectionA.slug,
    manufacturerSlug: manufacturerA.slug,
    defaultLocaleName: `Product A ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product A ${SECONDARY_LOCALE}`,
    itemId: '1',
  });

  const productB = await createTestProduct({
    wineColorOptionsSlug: attributeWineColor.options[2].slug,
    wineTypeOptionsSlug: attributeWineVariant.options[2].slug,
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
    wineColorOptionsSlug: attributeWineColor.options[0].slug,
    wineTypeOptionsSlug: attributeWineVariant.options[0].slug,
    rubricsIds: [rubricB._id],
    brandSlug: brandA.slug,
    brandCollectionSlug: brandCollectionA.slug,
    manufacturerSlug: manufacturerA.slug,
    defaultLocaleName: `Product C ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product C ${SECONDARY_LOCALE}`,
    itemId: '3',
  });

  const productD = await createTestProduct({
    wineColorOptionsSlug: attributeWineColor.options[1].slug,
    wineTypeOptionsSlug: attributeWineVariant.options[1].slug,
    rubricsIds: [rubricA._id],
    brandSlug: brandB.slug,
    brandCollectionSlug: brandCollectionB.slug,
    manufacturerSlug: manufacturerB.slug,
    defaultLocaleName: `Product D ${DEFAULT_LOCALE}`,
    secondaryLocaleName: `Product D ${SECONDARY_LOCALE}`,
    itemId: '4',
  });

  const productF = await createTestProduct({
    wineColorOptionsSlug: attributeWineColor.options[1].slug,
    wineTypeOptionsSlug: attributeWineVariant.options[1].slug,
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
    attribute: attributeWineVintage,
    connectionProducts: [
      {
        productId: connectionProductAId,
        option: attributeWineVintage.options[0],
      },
      {
        productId: connectionProductBId,
        option: attributeWineVintage.options[1],
      },
      {
        productId: connectionProductCId,
        option: attributeWineVintage.options[2],
      },
    ],
  };

  const connectionProductA = await createTestProduct({
    _id: connectionProductAId,
    wineColorOptionsSlug: attributeWineColor.options[1].slug,
    wineTypeOptionsSlug: attributeWineVariant.options[1].slug,
    wineVintageOptionsSlug: attributeWineVintage.options[0].slug,
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
    wineColorOptionsSlug: attributeWineColor.options[1].slug,
    wineTypeOptionsSlug: attributeWineVariant.options[1].slug,
    wineVintageOptionsSlug: attributeWineVintage.options[1].slug,
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
    wineColorOptionsSlug: attributeWineColor.options[1].slug,
    wineTypeOptionsSlug: attributeWineVariant.options[1].slug,
    wineVintageOptionsSlug: attributeWineVintage.options[2].slug,
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
