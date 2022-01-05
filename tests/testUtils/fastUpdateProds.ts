import { Db, ObjectId } from 'mongodb';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  ID_COUNTER_STEP,
  IMAGE_FALLBACK,
} from '../../config/common';
import {
  BrandInterface,
  CategoryInterface,
  ProductAttributeInterface,
} from '../../db/uiInterfaces';
import { getAttributeReadableValue } from '../../lib/productAttributesUtils';
import {
  generateCardTitle,
  GenerateCardTitleInterface,
  generateSnippetTitle,
} from '../../lib/titleUtils';
import { getTreeFromList } from '../../lib/treeUtils';
import { dbsConfig, getProdDb } from './getProdDb';
import {
  COL_ATTRIBUTES,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_ID_COUNTERS,
  COL_OPTIONS,
  COL_RUBRICS,
} from '../../db/collectionNames';
import {
  BaseModel,
  CountersModel,
  GenderModel,
  IdCounterModel,
  ObjectIdModel,
  RubricModel,
  ShopProductOldPriceModel,
  TimestampModel,
  TranslationModel,
} from '../../db/dbModels';
require('dotenv').config();

export interface AssetModel {
  url: string;
  index: number;
}

export interface ProductConnectionItemModel {
  _id: ObjectIdModel;
  optionId: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
  connectionId: ObjectIdModel;
}

export interface ProductConnectionModel {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  attributeSlug: string;
  productsIds: ObjectIdModel[];
}

export interface ProductAttributeModel {
  _id: ObjectIdModel;
  rubricId: ObjectIdModel;
  rubricSlug: string;
  productSlug: string;
  productId: ObjectIdModel;
  attributeId: ObjectIdModel;
  selectedOptionsSlugs: string[];
  selectedOptionsIds: ObjectIdModel[];
  textI18n?: TranslationModel | null;
  number?: number | null;
}

export interface ProductAssetsModel {
  _id: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
  assets: AssetModel[];
}

interface ProductMainFieldsInterface {
  rubricId: ObjectIdModel;
  rubricSlug: string;
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  manufacturerSlug?: string | null;
  selectedOptionsSlugs: string[];
  barcode?: string[] | null;
  allowDelivery: boolean;
}

export interface ProductModel extends ProductMainFieldsInterface, BaseModel, TimestampModel {
  slug: string;
  active: boolean;
  originalName: string;
  nameI18n?: TranslationModel | null;
  descriptionI18n?: TranslationModel | null;
  mainImage: string;
  gender: GenderModel;
  titleCategoriesSlugs: string[];
  selectedAttributesIds: ObjectId[];
}

export interface ShopProductOldModel
  extends ProductMainFieldsInterface,
    TimestampModel,
    CountersModel {
  _id: ObjectIdModel;
  available: number;
  citySlug: string;
  price: number;
  oldPrice?: number | null;
  oldPrices: ShopProductOldPriceModel[];
  discountedPercent: number;
  itemId: string;
  productId: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
  companySlug: string;
  mainImage: string;
  useCategoryDiscount?: boolean | null;
  useCategoryCashback?: boolean | null;
  useCategoryPayFromCashback?: boolean | null;
}

const COL_PRODUCTS_OLD = 'products';
const COL_PRODUCT_ASSETS_OLD = 'productAssets';
const COL_PRODUCT_ATTRIBUTES_OLD = 'productAttributes';
const COL_PRODUCT_CONNECTIONS_OLD = 'productConnections';
const COL_PRODUCT_CONNECTION_ITEMS_OLD = 'productConnectionItems';
const COL_SHOP_PRODUCTS_OLD = 'shopProducts';

export async function getFastNextNumberItemId(collectionName: string, db: Db): Promise<string> {
  const idCountersCollection = db.collection<IdCounterModel>(COL_ID_COUNTERS);

  const updatedCounter = await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $inc: {
        counter: ID_COUNTER_STEP,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  );

  if (!updatedCounter.ok || !updatedCounter.value) {
    throw Error(`${collectionName} id counter update error`);
  }

  return `${updatedCounter.value.counter}`;
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const locale = DEFAULT_LOCALE;
    const { db, client } = await getProdDb(dbConfig);
    // const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
    // const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);
    const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);

    // old collections
    const oldProductsCollection = db.collection<ProductModel>(COL_PRODUCTS_OLD);
    const oldShopProductsCollection = db.collection<ShopProductOldModel>(COL_SHOP_PRODUCTS_OLD);
    const oldProductAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS_OLD);
    const oldProductAttributesCollection = db.collection<ProductAttributeModel>(
      COL_PRODUCT_ATTRIBUTES_OLD,
    );
    const oldConnectionsCollection = db.collection<ProductConnectionModel>(
      COL_PRODUCT_CONNECTIONS_OLD,
    );
    const oldConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
      COL_PRODUCT_CONNECTION_ITEMS_OLD,
    );

    // get rubrics
    const rubrics = await rubricsCollection.find({}).toArray();
    for await (const rubric of rubrics) {
      // get rubric products
      const products = await oldProductsCollection
        .find(
          {
            rubricId: rubric._id,
          },
          { limit: 1 },
        )
        .toArray();
      console.log(rubric.nameI18n.ru, products.length);

      for await (const product of products) {
        // get product brand
        let brand: BrandInterface | null | undefined = null;
        if (product.brandSlug) {
          const brandAggregation = await brandsCollection
            .aggregate<BrandInterface>([
              {
                $match: {
                  itemId: product.brandSlug,
                },
              },
              {
                $lookup: {
                  from: COL_BRAND_COLLECTIONS,
                  as: 'collections',
                  let: {
                    brandId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $and: [
                          {
                            $expr: {
                              $eq: ['$brandId', '$$brandId'],
                            },
                          },
                          {
                            $expr: {
                              $eq: ['$itemId', product.brandCollectionSlug],
                            },
                          },
                        ],
                      },
                    },
                    {
                      $project: {
                        descriptionI18n: false,
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  url: false,
                  descriptionI18n: false,
                  logo: false,
                },
              },
            ])
            .toArray();
          const initialBrand = brandAggregation[0];
          if (initialBrand) {
            brand = {
              ...initialBrand,
            };
          }
        }

        // get product categories
        const categoriesAggregation = await categoriesCollection
          .aggregate<CategoryInterface>([
            {
              $match: {
                rubricId: product.rubricId,
                slug: {
                  $in: product.selectedOptionsSlugs,
                },
              },
            },
          ])
          .toArray();
        const categories = getTreeFromList({
          list: categoriesAggregation,
          childrenFieldName: 'categories',
          locale,
        });

        // get product attributes
        const attributesAggregation = await oldProductAttributesCollection
          .aggregate<any>([
            {
              $match: {
                productId: product._id,
              },
            },
            {
              $lookup: {
                from: COL_ATTRIBUTES,
                as: 'attribute',
                let: {
                  selectedOptionsIds: '$selectedOptionsIds',
                  attributeId: '$attributeId',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$attributeId'],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: COL_OPTIONS,
                      as: 'options',
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $cond: [
                                {
                                  $eq: [
                                    {
                                      $type: '$$selectedOptionsIds',
                                    },
                                    'missing',
                                  ],
                                },
                                {
                                  $eq: ['$_id', null],
                                },
                                {
                                  $in: ['$_id', '$$selectedOptionsIds'],
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                attribute: {
                  $arrayElemAt: ['$attribute', 0],
                },
              },
            },
          ])
          .toArray();
        const attributes = attributesAggregation.reduce(
          (acc: ProductAttributeInterface[], productAttribute) => {
            const newProductAttribute: ProductAttributeInterface = {
              _id: productAttribute._id,
              attribute: productAttribute.attribute,
              attributeId: productAttribute.attributeId,
              filterSlugs: productAttribute.selectedOptionsSlugs,
              optionIds: productAttribute.selectedOptionsIds,
              number: productAttribute.number,
              textI18n: productAttribute.textI18n,
              readableValueI18n: {},
            };

            const readableValue = getAttributeReadableValue({
              gender: product.gender,
              locale,
              productAttribute: newProductAttribute,
            });

            if (
              productAttribute.attribute.variant === ATTRIBUTE_VARIANT_STRING &&
              !productAttribute.textI18n.ru
            ) {
              return acc;
            }
            if (
              productAttribute.attribute.variant === ATTRIBUTE_VARIANT_NUMBER &&
              typeof productAttribute.textI18n.number !== 'number'
            ) {
              return acc;
            }

            if (
              (productAttribute.attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
                productAttribute.attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) &&
              (productAttribute.selectedOptionsIds || []).length < 1
            ) {
              return acc;
            }

            return [
              ...acc,
              {
                ...newProductAttribute,
                readableValueI18n: {
                  [DEFAULT_LOCALE]: readableValue,
                },
              },
            ];
          },
          [],
        );

        // get product titles
        const titleConfig: GenerateCardTitleInterface = {
          locale,
          attributes,
          brand,
          categories,
          currency: DEFAULT_CURRENCY,
          defaultGender: product.gender,
          originalName: product.originalName,
          rubricName: rubric.nameI18n.ru,
          showCategoryInProductTitle: rubric.showCategoryInProductTitle,
          showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
          titleCategorySlugs: product.titleCategoriesSlugs,
        };
        const snippetTitle = generateSnippetTitle(titleConfig);
        const cardTitle = generateCardTitle(titleConfig);

        // get assets
        const initialAssets = await oldProductAssetsCollection.findOne({
          productId: product._id,
        });
        const assets: string[] = initialAssets
          ? initialAssets.assets.map(({ url }) => {
              return url;
            })
          : [IMAGE_FALLBACK];

        /*console.log(
          JSON.stringify(
            {
              ...attributes[0],
              attribute: {
                ...attributes[0].attribute,
              },
            },
            null,
            2,
          ),
        );*/
        console.log({
          snippetTitle,
          cardTitle,
          assets,
          originalName: product.originalName,
        });
      }
    }

    // TODO update shop, company assets
    // TODO update indexes
    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
  }
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
