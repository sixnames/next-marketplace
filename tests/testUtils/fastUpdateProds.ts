import { Db, ObjectId } from 'mongodb';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  CATEGORY_SLUG_PREFIX,
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
import { getPercentage } from '../../lib/numbers';
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
  AddressModel,
  BaseModel,
  ContactsModel,
  CountersModel,
  EmailAddressModel,
  GenderModel,
  IdCounterModel,
  MapMarkerModel,
  ObjectIdModel,
  PageStateModel,
  PhoneNumberModel,
  ProductFacetModel,
  ProductSummaryAttributeModel,
  ProductSummaryModel,
  ProductVariantItemModel,
  ProductVariantModel,
  PromoBaseInterface,
  RubricModel,
  ShopProductModel,
  ShopProductOldPriceModel,
  TimestampModel,
  TranslationModel,
  UserCashbackModel,
  UserNotificationsModel,
  UserPaybackModel,
} from '../../db/dbModels';
require('dotenv').config();

export interface AssetModel {
  url: string;
  index: number;
}

export interface OldCompanyModel extends BaseModel, TimestampModel {
  name: string;
  slug: string;
  logo: AssetModel;
  ownerId: ObjectIdModel;
  staffIds: ObjectIdModel[];
  contacts: ContactsModel;
  shopsIds: ObjectIdModel[];
  domain?: string | null;
}

export interface OldShopModel extends BaseModel, TimestampModel {
  name: string;
  slug: string;
  citySlug: string;
  logo: AssetModel;
  assets: AssetModel[];
  contacts: ContactsModel;
  address: AddressModel;
  companyId: ObjectIdModel;
  companySlug: string;
  mainImage: string;
  token?: string | null;
  rating?: number | null;
  mapMarker?: MapMarkerModel | null;
  license?: string | null;
  priceWarningI18n?: TranslationModel | null;
}

export interface OldUserModel extends BaseModel, TimestampModel {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: EmailAddressModel;
  phone: PhoneNumberModel;
  password: string;
  avatar?: AssetModel | null;
  roleId: ObjectIdModel;
  cartId?: ObjectIdModel | null;
  notifications: UserNotificationsModel;
  categoryIds: ObjectIdModel[];
  cashback?: UserCashbackModel[] | null;
  payback?: UserPaybackModel[] | null;
}

export interface OldPromoModel extends TimestampModel, PromoBaseInterface {
  _id: ObjectIdModel;
  slug: string;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;

  // ui configs
  showAsPromoPage: boolean;
  assetKeys: string[];
  content: string;

  // main banner
  showAsMainBanner: boolean;
  mainBanner?: AssetModel | null;
  mainBannerMobile?: AssetModel | null;
  mainBannerTextColor: string;
  mainBannerVerticalTextAlign: string;
  mainBannerHorizontalTextAlign: string;
  mainBannerTextAlign: string;
  mainBannerTextPadding: number;
  mainBannerTextMaxWidth: number;

  //secondary banner
  showAsSecondaryBanner: boolean;
  secondaryBanner?: AssetModel | null;
  secondaryBannerTextColor: string;
  secondaryBannerVerticalTextAlign: string;
  secondaryBannerHorizontalTextAlign: string;
  secondaryBannerTextAlign: string;
  secondaryBannerTextPadding: number;
  secondaryBannerTextMaxWidth: number;
}

export interface OldPageModel extends TimestampModel {
  _id: ObjectIdModel;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
  index: number;
  slug: string;
  citySlug: string;
  assetKeys: string[];
  pagesGroupId: ObjectIdModel;
  content: string;
  state: PageStateModel;
  companySlug: string;
  pageScreenshot?: AssetModel | null;
  mainBanner?: AssetModel | null;
  mainBannerMobile?: AssetModel | null;
  showAsMainBanner?: boolean | null;
  mainBannerTextColor?: string | null;
  mainBannerVerticalTextAlign?: string | null;
  mainBannerHorizontalTextAlign?: string | null;
  mainBannerTextAlign?: string | null;
  mainBannerTextPadding?: number | null;
  mainBannerTextMaxWidth?: number | null;
  secondaryBanner?: AssetModel | null;
  showAsSecondaryBanner?: boolean | null;
  secondaryBannerTextColor?: string | null;
  secondaryBannerVerticalTextAlign?: string | null;
  secondaryBannerHorizontalTextAlign?: string | null;
  secondaryBannerTextAlign?: string | null;
  secondaryBannerTextPadding?: number | null;
  secondaryBannerTextMaxWidth?: number | null;
}

export interface OldProductConnectionItemModel {
  _id: ObjectIdModel;
  optionId: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
  connectionId: ObjectIdModel;
}

export interface OldProductConnectionModel {
  _id: ObjectIdModel;
  attributeId: ObjectIdModel;
  attributeSlug: string;
  productsIds: ObjectIdModel[];
}

export interface OldProductAttributeModel {
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

export interface OldProductAssetsModel {
  _id: ObjectIdModel;
  productSlug: string;
  productId: ObjectIdModel;
  assets: AssetModel[];
}

interface OldProductMainFieldsInterface {
  rubricId: ObjectIdModel;
  rubricSlug: string;
  brandSlug?: string | null;
  brandCollectionSlug?: string | null;
  manufacturerSlug?: string | null;
  selectedOptionsSlugs: string[];
  barcode?: string[] | null;
  allowDelivery: boolean;
}

export interface OldProductModel extends OldProductMainFieldsInterface, BaseModel, TimestampModel {
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

export interface OldShopProductModel
  extends OldProductMainFieldsInterface,
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
    const oldProductsCollection = db.collection<OldProductModel>(COL_PRODUCTS_OLD);
    const oldShopProductsCollection = db.collection<OldShopProductModel>(COL_SHOP_PRODUCTS_OLD);
    const oldProductAssetsCollection = db.collection<OldProductAssetsModel>(COL_PRODUCT_ASSETS_OLD);
    const oldProductAttributesCollection = db.collection<OldProductAttributeModel>(
      COL_PRODUCT_ATTRIBUTES_OLD,
    );
    const oldConnectionsCollection = db.collection<OldProductConnectionModel>(
      COL_PRODUCT_CONNECTIONS_OLD,
    );
    const oldConnectionItemsCollection = db.collection<OldProductConnectionItemModel>(
      COL_PRODUCT_CONNECTION_ITEMS_OLD,
    );

    // get old connections
    const connections = await oldConnectionsCollection.find({}).toArray();

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
      const rubricSummaries: ProductSummaryModel[] = [];
      const rubricFacets: ProductFacetModel[] = [];
      const rubricShopProducts: ShopProductModel[] = [];

      for await (const [productIndex, product] of products.entries()) {
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
              filterSlugs: productAttribute.selectedOptionsSlugs || [],
              optionIds: productAttribute.selectedOptionsIds || [],
              number: productAttribute.number,
              textI18n: productAttribute.textI18n,
              readableValueI18n: {},
            };

            if (!productAttribute.attribute) {
              return acc;
            }

            if (
              productAttribute.attribute.variant === ATTRIBUTE_VARIANT_STRING &&
              !productAttribute.textI18n.ru
            ) {
              return acc;
            }
            if (
              productAttribute.attribute.variant === ATTRIBUTE_VARIANT_NUMBER &&
              typeof productAttribute.number !== 'number'
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

            const readableValue = getAttributeReadableValue({
              gender: product.gender,
              locale,
              productAttribute: newProductAttribute,
            });

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
        const castedAttributes: ProductSummaryAttributeModel[] = attributes.map(
          (oldProductAttribute) => {
            const payload: ProductSummaryAttributeModel = {
              _id: oldProductAttribute._id,
              readableValueI18n: oldProductAttribute.readableValueI18n,
              textI18n: oldProductAttribute.textI18n,
              number: oldProductAttribute.number,
              optionIds: oldProductAttribute.optionIds,
              filterSlugs: oldProductAttribute.filterSlugs,
              attributeId: oldProductAttribute.attributeId,
            };
            return payload;
          },
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

        // get product assets
        const initialAssets = await oldProductAssetsCollection.findOne({
          productId: product._id,
        });
        const assets: string[] = initialAssets
          ? initialAssets.assets.map(({ url }) => {
              return url;
            })
          : [IMAGE_FALLBACK];

        // get product connections
        const variants: ProductVariantModel[] = [];
        const connectionItems = await oldConnectionItemsCollection
          .find({ productId: product._id })
          .toArray();
        for await (const connectionItem of connectionItems) {
          const variantItem: ProductVariantItemModel = {
            _id: connectionItem._id,
            optionId: connectionItem.optionId,
            productId: connectionItem.productId,
            productSlug: connectionItem.productSlug,
          };

          const variant = variants.find(({ _id }) => {
            return connectionItem.connectionId.equals(_id);
          });
          if (variant) {
            variant.products.push(variantItem);
            continue;
          }

          const connection = connections.find(({ _id }) => {
            return connectionItem.connectionId.equals(_id);
          });
          if (connection) {
            const newVariant: ProductVariantModel = {
              _id: connection._id,
              attributeId: connection.attributeId,
              attributeSlug: connection.attributeSlug,
              products: [variantItem],
            };
            variants.push(newVariant);
          }
        }

        // cast to summary
        const categorySlugs = product.selectedOptionsSlugs.filter((slug) => {
          return slug.indexOf(CATEGORY_SLUG_PREFIX) === 0;
        });
        const initialFilterSlugs = castedAttributes.reduce((acc: string[], productAttribute) => {
          return [...acc, ...productAttribute.filterSlugs];
        }, []);
        const attributeIds = castedAttributes.reduce((acc: ObjectIdModel[], productAttribute) => {
          return [...acc, productAttribute.attributeId];
        }, []);
        const filterSlugs = [...initialFilterSlugs, ...categorySlugs];
        const titleCategorySlugs = (product.titleCategoriesSlugs || []).filter((slug) => {
          return filterSlugs.includes(slug);
        });
        const summary: ProductSummaryModel = {
          _id: product._id,
          itemId: product.itemId,
          slug: product.slug,
          gender: product.gender,
          active: product.active,
          rubricId: product.rubricId,
          rubricSlug: product.rubricSlug,
          brandSlug: product.brandSlug,
          brandCollectionSlug: product.brandCollectionSlug,
          manufacturerSlug: product.manufacturerSlug,
          filterSlugs,
          barcode: product.barcode || [],
          allowDelivery: product.allowDelivery,
          mainImage: product.mainImage,
          attributes: castedAttributes,
          attributeIds,
          variants,
          assets,
          nameI18n: product.nameI18n,
          descriptionI18n: product.descriptionI18n,
          titleCategorySlugs,
          originalName: product.originalName,
          cardTitleI18n: {
            [DEFAULT_LOCALE]: cardTitle,
          },
          snippetTitleI18n: {
            [DEFAULT_LOCALE]: snippetTitle,
          },
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
        rubricSummaries.push(summary);

        // get facet
        const facet: ProductFacetModel = {
          _id: summary._id,
          filterSlugs: summary.filterSlugs,
          attributeIds: summary.attributeIds,
          slug: summary.slug,
          active: summary.active,
          rubricId: summary.rubricId,
          rubricSlug: summary.rubricSlug,
          itemId: summary.itemId,
          allowDelivery: summary.allowDelivery,
          brandCollectionSlug: summary.brandCollectionSlug,
          brandSlug: summary.brandSlug,
          manufacturerSlug: summary.manufacturerSlug,
          barcode: summary.barcode,
          mainImage: summary.mainImage,
        };
        rubricFacets.push(facet);

        // get shop products
        const oldShopProducts = await oldShopProductsCollection
          .find({
            productId: product._id,
          })
          .toArray();

        oldShopProducts.forEach((oldShopProduct) => {
          const lastOldPrice =
            oldShopProduct.oldPrices.length > 0
              ? oldShopProduct.oldPrices[oldShopProduct.oldPrices.length - 1]
              : null;
          const currentPrice = oldShopProduct.price;
          const discountedPercent =
            lastOldPrice && lastOldPrice.price > oldShopProduct.price
              ? getPercentage({
                  fullValue: lastOldPrice.price,
                  partialValue: currentPrice,
                })
              : 0;
          const oldPrice = lastOldPrice ? lastOldPrice.price : oldShopProduct.price;

          const shopProduct: ShopProductModel = {
            _id: oldShopProduct._id,
            updatedAt: oldShopProduct.updatedAt,
            createdAt: oldShopProduct.createdAt,
            barcode: oldShopProduct.barcode,
            available: oldShopProduct.available,
            oldPrices: oldShopProduct.oldPrices,
            citySlug: oldShopProduct.citySlug,
            companyId: oldShopProduct.companyId,
            companySlug: oldShopProduct.companySlug,
            views: oldShopProduct.views,
            shopId: oldShopProduct.shopId,
            useCategoryCashback: oldShopProduct.useCategoryCashback,
            useCategoryDiscount: oldShopProduct.useCategoryDiscount,
            useCategoryPayFromCashback: oldShopProduct.useCategoryPayFromCashback,
            price: currentPrice,
            discountedPercent,
            oldPrice,
            productId: facet._id,
            itemId: facet.itemId,
            filterSlugs: facet.filterSlugs,
            manufacturerSlug: facet.manufacturerSlug,
            brandCollectionSlug: facet.brandCollectionSlug,
            brandSlug: facet.brandSlug,
            rubricSlug: facet.rubricSlug,
            rubricId: facet.rubricId,
            mainImage: facet.mainImage,
            allowDelivery: facet.allowDelivery,
          };
          rubricShopProducts.push(shopProduct);
        });

        // log counter for each 100 product
        if (productIndex % 100 === 0) {
          console.log(`${productIndex} of ${products.length} ${snippetTitle}`);
        }
      }

      // TODO save all
      console.log({
        rubricSummaries: rubricSummaries.length,
        rubricFacets: rubricFacets.length,
        rubricShopProducts: rubricShopProducts.length,
      });
    }

    // update asset fields
    // CompanyModel logo
    // ShopModel logo, assets
    // UserModel avatar
    // PromoModel mainBanner, mainBannerMobile, secondaryBanner
    // PageModel pageScreenshot, mainBanner, secondaryBanner,

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
