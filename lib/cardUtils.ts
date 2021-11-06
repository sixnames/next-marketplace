import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  FILTER_SEPARATOR,
  DEFAULT_CITY,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  ROUTE_CATALOGUE,
  FILTER_CATEGORY_KEY,
  FILTER_BRAND_KEY,
  FILTER_BRAND_COLLECTION_KEY,
  SORT_DESC,
} from 'config/common';
import { DEFAULT_LAYOUT } from 'config/constantSelects';
import { getConstantTranslation } from 'config/constantTranslations';
import {
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_CARD_CONTENTS,
  COL_PRODUCTS,
  COL_BRAND_COLLECTIONS,
  COL_PRODUCT_CONNECTIONS,
  COL_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_OPTIONS,
  COL_RUBRICS,
  COL_RUBRIC_VARIANTS,
  COL_PRODUCT_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_PRODUCT_SEO,
  COL_PRODUCT_CARD_DESCRIPTIONS,
  COL_ICONS,
} from 'db/collectionNames';
import { productCategoriesPipeline } from 'db/dao/constantPipelines';
import {
  CatalogueBreadcrumbModel,
  ObjectIdModel,
  ProductCardBreadcrumbModel,
  ProductSeoModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CategoryInterface,
  InitialCardDataInterface,
  ProductAttributeInterface,
  ProductAttributesGroupInterface,
  ProductCardContentInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  ShopInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList, sortByName } from 'lib/optionsUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import {
  castProductAttributeForUi,
  getProductCurrentViewCastedAttributes,
} from 'lib/productAttributesUtils';
import { generateCardTitle } from 'lib/titleUtils';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';

interface CastOptionsForBreadcrumbsInterface {
  category: CategoryInterface;
  acc: CatalogueBreadcrumbModel[];
  hrefAcc: string;
}

function castCategoriesForBreadcrumbs({
  category,
  acc,
  hrefAcc,
}: CastOptionsForBreadcrumbsInterface): ProductCardBreadcrumbModel[] {
  const categorySlug = `${FILTER_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`;
  const newAcc = [...acc];
  const href = `${hrefAcc}/${categorySlug}`;
  newAcc.push({
    _id: category._id,
    name: `${category.name}`,
    href,
  });

  if (!category.categories || category.categories.length < 1) {
    return newAcc;
  }

  return category.categories.reduce((innerAcc: ProductCardBreadcrumbModel[], childCategory) => {
    const castedOptionAcc = castCategoriesForBreadcrumbs({
      category: childCategory,
      acc: [],
      hrefAcc: href,
    });
    return [...innerAcc, ...castedOptionAcc];
  }, newAcc);
}

const minAssetsListCount = 2;

export interface GetCardDataInterface {
  locale: string;
  city: string;
  slug: string;
  companySlug: string;
  companyId?: string | ObjectId | null;
  useUniqueConstructor: boolean;
  showAdminUiInCatalogue: boolean;
}

export async function getCardData({
  locale,
  city,
  slug,
  companyId,
  showAdminUiInCatalogue,
  ...props
}: // companySlug,
// useUniqueConstructor,
GetCardDataInterface): Promise<InitialCardDataInterface | null> {
  try {
    // const startTime = new Date().getTime();
    const { db } = await getDatabase();
    const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
    const productSeoCollection = db.collection<ProductSeoModel>(COL_PRODUCT_SEO);
    const companyMatch = companyId ? { companyId: new ObjectId(companyId) } : {};
    const companySlug = props.companySlug;
    const shopProductsMatch = {
      citySlug: city,
      ...companyMatch,
    };

    // const shopProductsStartTime = new Date().getTime();
    const shopProductsAggregation = await productsCollection
      .aggregate<ProductInterface>([
        {
          $match: {
            slug,
          },
        },

        // Lookup product rubric
        {
          $lookup: {
            from: COL_RUBRICS,
            as: 'rubric',
            let: {
              rubricId: '$rubricId',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$rubricId'],
                  },
                },
              },

              // get rubric variant
              {
                $lookup: {
                  from: COL_RUBRIC_VARIANTS,
                  as: 'variant',
                  let: {
                    variantId: '$variantId',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$variantId', '$_id'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  variant: {
                    $arrayElemAt: ['$variant', 0],
                  },
                },
              },
            ],
          },
        },

        // Get product card content
        {
          $lookup: {
            from: COL_PRODUCT_CARD_CONTENTS,
            as: 'cardContent',
            let: {
              productId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  companySlug,
                  $expr: {
                    $eq: ['$$productId', '$productId'],
                  },
                },
              },
            ],
          },
        },

        // get product assets
        {
          $lookup: {
            from: COL_PRODUCT_ASSETS,
            as: 'assets',
            localField: '_id',
            foreignField: 'productId',
          },
        },

        // get seo text
        {
          $lookup: {
            from: COL_PRODUCT_CARD_DESCRIPTIONS,
            as: 'cardDescription',
            let: {
              productId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  companySlug,
                  $expr: {
                    $eq: ['$$productId', '$productId'],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            cardDescription: {
              $arrayElemAt: ['$cardDescription', 0],
            },
          },
        },

        // get product categories
        ...productCategoriesPipeline(),

        // get product connection
        {
          $lookup: {
            from: COL_PRODUCT_CONNECTIONS,
            as: 'connections',
            let: { productId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$$productId', '$productsIds'],
                  },
                },
              },
              {
                $lookup: {
                  from: COL_ATTRIBUTES,
                  as: 'attribute',
                  let: { attributeId: '$attributeId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$attributeId', '$_id'],
                        },
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
              {
                $lookup: {
                  from: COL_PRODUCT_CONNECTION_ITEMS,
                  as: 'connectionProducts',
                  let: { connectionId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$connectionId', '$connectionId'],
                        },
                      },
                    },
                    {
                      $sort: {
                        _id: SORT_DESC,
                      },
                    },
                    {
                      $lookup: {
                        from: COL_OPTIONS,
                        as: 'option',
                        let: { optionId: '$optionId' },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$$optionId', '$_id'],
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      $lookup: {
                        from: COL_SHOP_PRODUCTS,
                        as: 'shopProduct',
                        let: { productId: '$productId' },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$$productId', '$productId'],
                              },
                            },
                          },
                          {
                            $lookup: {
                              from: COL_PRODUCTS,
                              as: 'product',
                              let: { productId: '$productId' },
                              pipeline: [
                                {
                                  $match: {
                                    $expr: {
                                      $eq: ['$$productId', '$_id'],
                                    },
                                  },
                                },
                              ],
                            },
                          },
                          {
                            $addFields: {
                              product: {
                                $arrayElemAt: ['$product', 0],
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      $addFields: {
                        shopProduct: {
                          $arrayElemAt: ['$shopProduct', 0],
                        },
                        option: {
                          $arrayElemAt: ['$option', 0],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },

        // get product attributes
        {
          $lookup: {
            from: COL_PRODUCT_ATTRIBUTES,
            as: 'attributesGroups',
            let: {
              productId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$productId', '$productId'],
                  },
                },
              },
              {
                $lookup: {
                  from: COL_ATTRIBUTES,
                  as: 'attribute',
                  let: {
                    attributeId: '$attributeId',
                    selectedOptionsIds: '$selectedOptionsIds',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$attributeId', '$_id'],
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
                                $and: [
                                  {
                                    $in: ['$_id', '$$selectedOptionsIds'],
                                  },
                                ],
                              },
                            },
                          },
                          {
                            $lookup: {
                              from: COL_ICONS,
                              as: 'icon',
                              let: {
                                documentId: '$_id',
                              },
                              pipeline: [
                                {
                                  $match: {
                                    collectionName: COL_OPTIONS,
                                    $expr: {
                                      $eq: ['$documentId', '$$documentId'],
                                    },
                                  },
                                },
                              ],
                            },
                          },
                          {
                            $addFields: {
                              icon: {
                                $arrayElemAt: ['$icon', 0],
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
              {
                $match: {
                  attribute: {
                    $exists: true,
                  },
                },
              },
              {
                $addFields: {
                  attributesGroupId: '$attribute.attributesGroupId',
                },
              },
              {
                $group: {
                  _id: '$attributesGroupId',
                  attributes: {
                    $addToSet: '$$ROOT',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_ATTRIBUTES_GROUPS,
                  as: 'attributesGroup',
                  let: {
                    attributesGroupId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$attributesGroupId', '$_id'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  attributesGroup: {
                    $arrayElemAt: ['$attributesGroup', 0],
                  },
                },
              },
              {
                $match: {
                  attributesGroup: {
                    $exists: true,
                  },
                },
              },
              {
                $addFields: {
                  nameI18n: '$attributesGroup.nameI18n',
                  attributesGroup: null,
                },
              },
            ],
          },
        },

        // get product manufacturer
        {
          $lookup: {
            from: COL_MANUFACTURERS,
            as: 'manufacturer',
            localField: 'manufacturerSlug',
            foreignField: 'itemId',
          },
        },

        // get product brand
        {
          $lookup: {
            from: COL_BRANDS,
            as: 'brand',
            localField: 'brandSlug',
            foreignField: 'itemId',
          },
        },

        // get product brand collection
        {
          $lookup: {
            from: COL_BRAND_COLLECTIONS,
            as: 'brandCollection',
            localField: 'brandCollectionSlug',
            foreignField: 'itemId',
          },
        },

        // get shop products and shops
        {
          $lookup: {
            from: COL_SHOP_PRODUCTS,
            as: 'shops',
            let: {
              productId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$productId', '$productId'],
                  },
                  ...shopProductsMatch,
                },
              },
              {
                $sort: {
                  _id: SORT_DESC,
                },
              },
              {
                $group: {
                  _id: '$shopId',
                  shopProducts: {
                    $push: '$$ROOT',
                  },
                },
              },

              // get product shops
              {
                $lookup: {
                  from: COL_SHOPS,
                  as: 'shop',
                  let: {
                    shopId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$shopId', '$_id'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  shop: {
                    $arrayElemAt: ['$shop', 0],
                  },
                },
              },
              {
                $addFields: {
                  'shop.shopProducts': '$shopProducts',
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$shop',
                },
              },
              {
                $sort: {
                  _id: SORT_DESC,
                },
              },
              {
                $addFields: {
                  shopProducts: null,
                  cardShopProduct: {
                    $arrayElemAt: ['$shopProducts', 0],
                  },
                },
              },
            ],
          },
        },

        // final fields
        {
          $addFields: {
            cardPrices: {
              min: '$minPrice',
              max: '$maxPrice',
            },
            shopsCount: { $size: '$shops' },
            rubric: { $arrayElemAt: ['$rubric', 0] },
            brand: { $arrayElemAt: ['$brand', 0] },
            brandCollection: { $arrayElemAt: ['$brandCollection', 0] },
            manufacturer: { $arrayElemAt: ['$manufacturer', 0] },
            assets: { $arrayElemAt: ['$assets', 0] },
            cardContent: { $arrayElemAt: ['$cardContent', 0] },
          },
        },
      ])
      .toArray();
    const product = shopProductsAggregation[0];

    if (!product || !product.rubric) {
      return null;
    }
    // console.log(shopProductsAggregationResult);
    // console.log(JSON.stringify(product, null, 2));
    // console.log(`Shop products `, new Date().getTime() - shopProductsStartTime);

    const {
      rubric,
      cardContent,
      assets,
      connections,
      attributesGroups,
      brand,
      brandCollection,
      manufacturer,
      categories,
      shops,
      cardDescription,
      ...restProduct
    } = product;

    // card connections
    const excludedAttributesIds: ObjectIdModel[] = [];
    const cardConnections: ProductConnectionInterface[] = [];
    (connections || []).forEach(({ attribute, ...connection }) => {
      const connectionProducts = (connection.connectionProducts || []).reduce(
        (acc: ProductConnectionItemInterface[], connectionProduct) => {
          if (!connectionProduct.shopProduct) {
            return acc;
          }

          return [
            ...acc,
            {
              ...connectionProduct,
              option: connectionProduct.option
                ? {
                    ...connectionProduct.option,
                    name: getFieldStringLocale(connectionProduct.option?.nameI18n, locale),
                  }
                : null,
            },
          ];
        },
        [],
      );

      if (connectionProducts.length < 1 || !attribute) {
        return;
      }

      excludedAttributesIds.push(attribute._id);
      cardConnections.push({
        ...connection,
        connectionProducts,
        attribute: {
          ...attribute,
          name: getFieldStringLocale(attribute?.nameI18n, locale),
          metric: attribute.metric
            ? {
                ...attribute.metric,
                name: getFieldStringLocale(attribute.metric.nameI18n, locale),
              }
            : null,
        },
      });
    });
    // console.log(`card connections `, new Date().getTime() - startTime);

    const allProductAttributes = (attributesGroups || []).reduce(
      (acc: ProductAttributeInterface[], { attributes }) => {
        return [...acc, ...attributes];
      },
      [],
    );

    const initialProductAttributes = (attributesGroups || []).reduce(
      (acc: ProductAttributeInterface[], { attributes }) => {
        const visibleAttributes = attributes.filter(({ attribute, attributeId }) => {
          if (!attribute) {
            return false;
          }
          const excluded = excludedAttributesIds.some((excludedAttributeId) => {
            return excludedAttributeId.equals(attributeId);
          });
          return attribute.showInCard && !excluded;
        });

        return [...acc, ...visibleAttributes];
      },
      [],
    );

    // listFeatures
    const listFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      gender: product.gender,
      locale,
    });
    // console.log(`listFeatures `, new Date().getTime() - startTime);

    // textFeatures
    const textFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT,
      gender: product.gender,
      locale,
    });
    // console.log(`textFeatures `, new Date().getTime() - startTime);

    // tagFeatures
    const tagFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
      gender: product.gender,
      locale,
    });
    // console.log(`tagFeatures `, new Date().getTime() - startTime);

    // iconFeatures
    const iconFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON,
      gender: product.gender,
      locale,
    });
    // console.log(`iconFeatures `, new Date().getTime() - startTime);

    // ratingFeatures
    const ratingFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
      gender: product.gender,
      locale,
    });
    // console.log(`ratingFeatures `, new Date().getTime() - startTime);

    // cast shops and get card prices
    const prices: number[] = [];
    const finalCardShops = (shops || []).reduce((acc: ShopInterface[], shop) => {
      if (!shop.cardShopProduct) {
        return acc;
      }

      prices.push(shop.cardShopProduct.price);

      return [
        ...acc,
        {
          ...shop,
          address: {
            ...shop.address,
            formattedCoordinates: {
              lat: shop.address.point.coordinates[1],
              lng: shop.address.point.coordinates[0],
            },
          },
          contacts: {
            ...shop.contacts,
            formattedPhones: shop.contacts.phones.map((phone) => {
              return {
                raw: phoneToRaw(phone),
                readable: phoneToReadable(phone),
              };
            }),
          },
        },
      ];
    }, []);
    const sortedPrices = prices.sort((a, b) => {
      return a - b;
    });
    const minPrice = sortedPrices[0];
    const maxPrice = sortedPrices[sortedPrices.length - 1];
    const cardPrices = {
      _id: new ObjectId(),
      min: `${noNaN(minPrice)}`,
      max: `${noNaN(maxPrice)}`,
    };
    // console.log(`cardShopProducts `, new Date().getTime() - startTime);

    // card content
    let castedCardContent: ProductCardContentInterface | null = null;
    if (cardContent) {
      let contentCityValue = cardContent.content[city];
      if (!contentCityValue) {
        contentCityValue = cardContent.content[DEFAULT_CITY];
      }
      if (contentCityValue === PAGE_EDITOR_DEFAULT_VALUE_STRING) {
        contentCityValue = null;
      }
      castedCardContent = {
        ...cardContent,
        value: contentCityValue,
      };
    }

    const cardCategories = getTreeFromList({
      list: categories,
      childrenFieldName: 'categories',
      locale,
      gender: restProduct.gender,
    });

    // cardBreadcrumbs
    const attributesBreadcrumbs: ProductCardBreadcrumbModel[] = [];

    // category breadcrumbs
    const breadcrumbCategories = cardCategories.reduce(
      (acc: ProductCardBreadcrumbModel[], category) => {
        const categoryList = castCategoriesForBreadcrumbs({
          category,
          acc: [],
          hrefAcc: `${ROUTE_CATALOGUE}/${rubric.slug}`,
        });
        return [...acc, ...categoryList];
      },
      [],
    );
    breadcrumbCategories.forEach((breadcrumb) => {
      attributesBreadcrumbs.push(breadcrumb);
    });

    // brand breadcrumb
    if (brand?.showAsBreadcrumb) {
      attributesBreadcrumbs.push({
        _id: brand._id,
        name: getFieldStringLocale(brand.nameI18n, locale),
        href: `${ROUTE_CATALOGUE}/${rubric.slug}/${FILTER_BRAND_KEY}${FILTER_SEPARATOR}${brand.itemId}`,
      });
    }

    // brand collection breadcrumb
    if (brandCollection?.showAsBreadcrumb) {
      attributesBreadcrumbs.push({
        _id: brandCollection._id,
        name: getFieldStringLocale(brandCollection.nameI18n, locale),
        href: `${ROUTE_CATALOGUE}/${rubric.slug}/${FILTER_BRAND_COLLECTION_KEY}${FILTER_SEPARATOR}${brandCollection.itemId}`,
      });
    }

    // Collect breadcrumbs configs for all product attributes
    // that have showAsBreadcrumb option enabled
    for await (const productAttribute of initialProductAttributes || []) {
      const { attribute } = productAttribute;
      if (!attribute) {
        continue;
      }
      if (
        !attribute.showAsBreadcrumb ||
        !productAttribute.selectedOptionsSlugs ||
        productAttribute.selectedOptionsSlugs.length < 1
      ) {
        continue;
      }

      // Get all selected options
      const options = attribute.options || [];

      // Get first selected option
      const firstSelectedOption = options[0];
      if (!firstSelectedOption) {
        continue;
      }

      // Get option name
      const metricValue = attribute.metric
        ? ` ${getFieldStringLocale(attribute.metric.nameI18n, locale)}`
        : '';
      const variant = get(firstSelectedOption, `variants.${restProduct.gender}.${locale}`);
      const name = getFieldStringLocale(firstSelectedOption.nameI18n, locale);
      let optionValue = name;
      if (variant) {
        optionValue = variant;
      }

      // Push breadcrumb config to the list
      attributesBreadcrumbs.push({
        _id: productAttribute.attributeId,
        name: `${optionValue}${metricValue}`,
        href: `${ROUTE_CATALOGUE}/${rubric.slug}/${attribute.slug}${FILTER_SEPARATOR}${firstSelectedOption.slug}`,
      });
    }

    // Returns all config [rubric, ...attributes]
    const cardBreadcrumbs: ProductCardBreadcrumbModel[] = [
      {
        _id: rubric._id,
        name: getFieldStringLocale(rubric.nameI18n, locale),
        href: `${ROUTE_CATALOGUE}/${rubric.slug}`,
      },
      ...attributesBreadcrumbs,
    ];
    // console.log(`cardBreadcrumbs `, new Date().getTime() - startTime);

    const name = getFieldStringLocale(restProduct.nameI18n, locale);
    const description = getFieldStringLocale(restProduct.descriptionI18n, locale);
    const shopsCount = finalCardShops.length;
    const isShopless = noNaN(shopsCount) < 1;
    const cardAssets = assets ? assets.assets : [];
    const cardAttributesGroups = (attributesGroups || []).reduce(
      (acc: ProductAttributesGroupInterface[], attributesGroup) => {
        const visibleAttributes = attributesGroup.attributes.filter(
          ({ attributeId, attribute }) => {
            if (!attribute) {
              return false;
            }
            const isListViewAttribute = attribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_LIST;
            const excluded = excludedAttributesIds.some((excludedAttributeId) => {
              return excludedAttributeId.equals(attributeId);
            });
            return attribute.showInCard && !excluded && isListViewAttribute;
          },
        );

        if (visibleAttributes.length > 0) {
          const groupAttributes = visibleAttributes.reduce(
            (acc: ProductAttributeInterface[], productAttribute) => {
              const castedAttribute = castProductAttributeForUi({
                productAttribute,
                locale,
                gender: product.gender,
              });
              if (!castedAttribute) {
                return acc;
              }
              return [...acc, castedAttribute];
            },
            [],
          );

          return [
            ...acc,
            {
              ...attributesGroup,
              name: getFieldStringLocale(attributesGroup.nameI18n, locale),
              attributes: sortByName(groupAttributes),
            },
          ];
        }

        return acc;
      },
      [],
    );

    const isSingleImage = cardAssets.length < minAssetsListCount;
    const showCardImagesSlider = !isSingleImage && Boolean(rubric?.variant?.showCardImagesSlider);
    const showCardBrands = Boolean(rubric?.variant?.showCardBrands);
    const showArticle = Boolean(rubric?.variant?.showCardArticle);
    const cardBrandsLabel = getFieldStringLocale(rubric?.variant?.cardBrandsLabelI18n, locale);

    const shopsCounterPostfix =
      noNaN(shopsCount) > 1
        ? getConstantTranslation(`shops.plural.${locale}`)
        : getConstantTranslation(`shops.single.${locale}`);

    // title
    const cardTitle = generateCardTitle({
      locale,
      brand: brand
        ? {
            ...brand,
            collections: brandCollection ? [brandCollection] : [],
          }
        : null,
      rubricName: getFieldStringLocale(rubric.nameI18n, locale),
      showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
      showCategoryInProductTitle: rubric.showCategoryInProductTitle,
      attributes: allProductAttributes,
      titleCategoriesSlugs: restProduct.titleCategoriesSlugs,
      originalName: restProduct.originalName,
      defaultGender: restProduct.gender,
      categories: cardCategories,
    });

    // admin data
    let productSeo = null;
    if (showAdminUiInCatalogue) {
      productSeo = await productSeoCollection.findOne({
        productId: restProduct._id,
        companySlug,
      });
    }

    return {
      product: {
        ...restProduct,
        name,
        cardDescription: cardDescription
          ? {
              ...cardDescription,
              text: getFieldStringLocale(cardDescription.textI18n, locale),
              seo: productSeo,
            }
          : null,
        description: description || cardTitle,
        brand: brand
          ? {
              ...brand,
              mainUrl: (brand.url || []).length > 0 ? (brand.url || [])[0] : null,
              name: getFieldStringLocale(brand.nameI18n, locale),
              description: getFieldStringLocale(brand.descriptionI18n, locale),
            }
          : null,
        brandCollection: brandCollection
          ? {
              ...brandCollection,
              name: getFieldStringLocale(brandCollection.nameI18n, locale),
              description: getFieldStringLocale(brandCollection.descriptionI18n, locale),
            }
          : null,
        manufacturer: manufacturer
          ? {
              ...manufacturer,
              mainUrl: (manufacturer.url || []).length > 0 ? (manufacturer.url || [])[0] : null,
              name: getFieldStringLocale(manufacturer.nameI18n, locale),
              description: getFieldStringLocale(manufacturer.descriptionI18n, locale),
            }
          : null,
      },
      cardTitle,
      cardPrices,
      rubric,
      cardLayout: rubric?.variant?.cardLayout || DEFAULT_LAYOUT,
      connections: cardConnections,
      listFeatures,
      textFeatures,
      tagFeatures,
      iconFeatures,
      ratingFeatures,
      cardShops: finalCardShops,
      cardBreadcrumbs,
      shopsCount,
      isShopless,
      cardContent: castedCardContent,
      shopsCounterPostfix,
      attributesGroups: sortByName(cardAttributesGroups),
      assets: cardAssets,
      showArticle,
      isSingleImage,
      showCardImagesSlider,
      showCardBrands,
      cardBrandsLabel,
      showFeaturesSection:
        iconFeatures.length > 0 ||
        tagFeatures.length > 0 ||
        textFeatures.length > 0 ||
        ratingFeatures.length > 0,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
