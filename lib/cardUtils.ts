import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  CATALOGUE_OPTION_SEPARATOR,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  ROUTE_CATALOGUE,
  SORT_DESC,
} from 'config/common';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { ObjectIdModel, ProductCardBreadcrumbModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  ShopProductInterface,
  ShopProductsGroupInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';

export interface GetCardDataInterface {
  locale: string;
  city: string;
  slug: string;
  companyId?: string | ObjectId | null;
}

export async function getCardData({
  locale,
  city,
  slug,
  companyId,
}: GetCardDataInterface): Promise<ProductInterface | null> {
  try {
    // const startTime = new Date().getTime();
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const companyRubricsMatch = companyId ? { companyId: new ObjectId(companyId) } : {};

    // const shopProductsStartTime = new Date().getTime();
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ProductInterface>([
        {
          $match: {
            slug,
            citySlug: city,
            ...companyRubricsMatch,
          },
        },
        {
          $sort: {
            _id: SORT_DESC,
          },
        },

        // Get shops
        {
          $lookup: {
            from: COL_SHOPS,
            as: 'shop',
            let: {
              shopId: '$shopId',
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
            shop: { $arrayElemAt: ['$shop', 0] },
          },
        },
        {
          $group: {
            _id: '$productId',
            itemId: { $first: '$itemId' },
            slug: { $first: '$slug' },
            mainImage: { $first: `$mainImage` },
            originalName: { $first: `$originalName` },
            nameI18n: { $first: `$nameI18n` },
            descriptionI18n: { $first: `descriptionI18n` },
            rubricId: { $first: `$rubricId` },
            rubricSlug: { $first: `$rubricSlug` },
            minPrice: {
              $min: '$price',
            },
            maxPrice: {
              $max: '$price',
            },
            shopProductIds: {
              $addToSet: '$_id',
            },
            shopProducts: {
              $push: {
                _id: '$_id',
                price: '$price',
                available: '$available',
                shopId: '$shopId',
                oldPrices: '$oldPrices',
                shop: '$shop',
                formattedPrice: '$formattedPrice',
                formattedOldPrice: '$formattedOldPrice',
                discountedPercent: '$discountedPercent',
              },
            },
          },
        },

        // Lookup product connection
        {
          $lookup: {
            from: COL_PRODUCT_CONNECTIONS,
            as: 'connections',
            let: {
              productId: '$_id',
            },
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
                  let: {
                    connectionId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$connectionId', '$$connectionId'],
                        },
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
                              citySlug: city,
                            },
                          },
                        ],
                      },
                    },
                    {
                      $addFields: {
                        option: {
                          $arrayElemAt: ['$option', 0],
                        },
                        shopProduct: {
                          $arrayElemAt: ['$shopProduct', 0],
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },

        // Get product rubric
        {
          $lookup: {
            from: COL_RUBRICS,
            as: 'rubrics',
            let: {
              rubricId: '$rubricId',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$rubricId', '$_id'],
                  },
                },
              },
              {
                $project: {
                  _id: true,
                  slug: true,
                  nameI18n: true,
                },
              },
            ],
          },
        },

        // Get product attributes
        {
          $lookup: {
            from: COL_PRODUCT_ATTRIBUTES,
            as: 'attributes',
            let: {
              productId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$productId', '$productId'],
                  },
                  $or: [
                    {
                      showInCard: true,
                    },
                    {
                      showAsBreadcrumb: true,
                    },
                  ],
                },
              },
              {
                $sort: {
                  views: SORT_DESC,
                },
              },

              // get attribute selected options
              {
                $lookup: {
                  from: COL_OPTIONS,
                  as: 'options',
                  let: {
                    selectedOptionsIds: '$selectedOptionsIds',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ['$_id', '$$selectedOptionsIds'],
                        },
                      },
                    },
                    {
                      $sort: {
                        views: SORT_DESC,
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
            cardPrices: {
              min: '$minPrice',
              max: '$maxPrice',
            },
            shopsCount: { $size: '$shopProducts' },
            rubric: { $arrayElemAt: ['$rubrics', 0] },
          },
        },
        {
          $project: {
            rubrics: false,
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

    // card connections
    const excludedAttributesIds: ObjectIdModel[] = [];
    const cardConnections: ProductConnectionInterface[] = [];
    (product.connections || []).forEach(({ attribute, ...connection }) => {
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

    // listFeatures
    const listFeatures = getProductCurrentViewCastedAttributes({
      excludedAttributesIds,
      attributes: product.attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      locale,
    });
    // console.log(`listFeatures `, new Date().getTime() - startTime);

    // textFeatures
    const textFeatures = getProductCurrentViewCastedAttributes({
      excludedAttributesIds,
      attributes: product.attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT,
      locale,
    });
    // console.log(`textFeatures `, new Date().getTime() - startTime);

    // tagFeatures
    const tagFeatures = getProductCurrentViewCastedAttributes({
      excludedAttributesIds,
      attributes: product.attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
      locale,
    });
    // console.log(`tagFeatures `, new Date().getTime() - startTime);

    // iconFeatures
    const iconFeatures = getProductCurrentViewCastedAttributes({
      excludedAttributesIds,
      attributes: product.attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON,
      locale,
    });
    // console.log(`iconFeatures `, new Date().getTime() - startTime);

    // ratingFeatures
    const ratingFeatures = getProductCurrentViewCastedAttributes({
      excludedAttributesIds,
      attributes: product.attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
      locale,
    });
    // console.log(`ratingFeatures `, new Date().getTime() - startTime);

    // cardShopProducts
    const groupedByShops = (product.shopProducts || []).reduce(
      (acc: ShopProductsGroupInterface[], shopProduct) => {
        const existingShopIndex = acc.findIndex(({ _id }) => _id.equals(shopProduct.shopId));
        if (existingShopIndex > -1) {
          acc[existingShopIndex].shopProducts.push(shopProduct);
          return acc;
        }

        return [
          ...acc,
          {
            _id: shopProduct.shopId,
            shopProducts: [shopProduct],
          },
        ];
      },
      [],
    );

    const finalShopProducts: ShopProductInterface[] = [];
    groupedByShops.forEach((group) => {
      const { shopProducts } = group;
      const sortedShopProducts = shopProducts.sort((a, b) => {
        return b.available - a.available;
      });

      const firstShopProduct = sortedShopProducts[0];
      if (firstShopProduct) {
        finalShopProducts.push(firstShopProduct);
      }
    });

    // prices
    const sortedShopProductsByPrice = finalShopProducts.sort((a, b) => {
      return b.price - a.price;
    });
    const minPriceShopProduct = sortedShopProductsByPrice[sortedShopProductsByPrice.length - 1];
    const maxPriceShopProduct = sortedShopProductsByPrice[0];
    const cardPrices = {
      _id: new ObjectId(),
      min: `${minPriceShopProduct.price}`,
      max: `${maxPriceShopProduct.price}`,
    };

    const cardShopProducts: ShopProductInterface[] = [];
    finalShopProducts.forEach((shopProduct) => {
      const { shop } = shopProduct;
      if (!shop) {
        return;
      }

      cardShopProducts.push({
        ...shopProduct,
        shop: {
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
      });
    });
    // console.log(`cardShopProducts `, new Date().getTime() - startTime);

    // cardBreadcrumbs
    const { rubric, ...restProduct } = product;
    const attributesBreadcrumbs: ProductCardBreadcrumbModel[] = [];
    // Collect breadcrumbs configs for all product attributes
    // that have showAsBreadcrumb option enabled
    for await (const productAttribute of product.attributes || []) {
      if (!productAttribute.showAsBreadcrumb) {
        continue;
      }

      if (
        !productAttribute.selectedOptionsSlugs ||
        productAttribute.selectedOptionsSlugs.length < 1
      ) {
        continue;
      }

      // Get all selected options
      const options = productAttribute.options || [];

      // Get first selected option
      const firstSelectedOption = options[0];
      if (!firstSelectedOption) {
        continue;
      }

      // Get option name
      const filterNameString = getFieldStringLocale(firstSelectedOption.nameI18n, locale);

      // Push breadcrumb config to the list
      attributesBreadcrumbs.push({
        _id: productAttribute.attributeId,
        name: filterNameString,
        href: `${ROUTE_CATALOGUE}/${rubric.slug}/${productAttribute.slug}${CATALOGUE_OPTION_SEPARATOR}${firstSelectedOption.slug}`,
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

    const name = getFieldStringLocale(product.nameI18n, locale);
    const description = getFieldStringLocale(product.descriptionI18n, locale);

    return {
      ...restProduct,
      connections: cardConnections,
      name,
      description: description === LOCALE_NOT_FOUND_FIELD_MESSAGE ? name : description,
      cardPrices,
      listFeatures,
      textFeatures,
      tagFeatures,
      iconFeatures,
      ratingFeatures,
      cardShopProducts,
      cardBreadcrumbs,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
