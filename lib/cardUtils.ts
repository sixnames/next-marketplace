import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  CATALOGUE_OPTION_SEPARATOR,
  DEFAULT_CITY,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  ROUTE_CATALOGUE,
  SORT_ASC,
  SORT_DESC,
} from 'config/common';
import { LAYOUT_DEFAULT } from 'config/constantSelects';
import { getConstantTranslation } from 'config/constantTranslations';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_OPTIONS,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CARD_CONTENTS,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { ObjectIdModel, ProductCardBreadcrumbModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  InitialCardDataInterface,
  ProductAttributeInterface,
  ProductAttributesGroupInterface,
  ProductCardContentInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  ProductInterface,
  ShopProductInterface,
  ShopProductsGroupInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';

const minAssetsListCount = 2;

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
}: GetCardDataInterface): Promise<InitialCardDataInterface | null> {
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
                productId: '$productId',
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
            as: 'rubric',
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
                $project: {
                  _id: true,
                  slug: true,
                  nameI18n: true,
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
                  $expr: {
                    $eq: ['$$productId', '$productId'],
                  },
                },
              },
            ],
          },
        },

        // Get product assets
        {
          $lookup: {
            from: COL_PRODUCT_ASSETS,
            as: 'assets',
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
                $sort: {
                  index: SORT_ASC,
                },
              },
            ],
          },
        },

        // Get product attributes
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

              // get attributes group
              {
                $lookup: {
                  from: COL_ATTRIBUTES_GROUPS,
                  as: 'attributesGroup',
                  let: {
                    attributesGroupId: '$attributesGroupId',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$attributesGroupId'],
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
              {
                $addFields: {
                  attributesGroup: {
                    $arrayElemAt: ['$attributesGroup', 0],
                  },
                },
              },
              {
                $group: {
                  _id: '$attributesGroupId',
                  nameI18n: {
                    $first: '$attributesGroup.nameI18n',
                  },
                  attributes: {
                    $push: '$$ROOT',
                  },
                },
              },
              {
                $project: {
                  'attributes.attributesGroup': false,
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
            shopsCount: { $size: '$shopProducts' },
            rubric: { $arrayElemAt: ['$rubric', 0] },
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
      shopProducts,
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

    const initialProductAttributes = (attributesGroups || []).reduce(
      (acc: ProductAttributeInterface[], { attributes }) => {
        const visibleAttributes = attributes.filter(({ showInCard, attributeId }) => {
          const excluded = excludedAttributesIds.some((excludedAttributeId) => {
            return excludedAttributeId.equals(attributeId);
          });
          return showInCard && !excluded;
        });

        return [...acc, ...visibleAttributes];
      },
      [],
    );

    // listFeatures
    const listFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      locale,
    });
    // console.log(`listFeatures `, new Date().getTime() - startTime);

    // textFeatures
    const textFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT,
      locale,
    });
    // console.log(`textFeatures `, new Date().getTime() - startTime);

    // tagFeatures
    const tagFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
      locale,
    });
    // console.log(`tagFeatures `, new Date().getTime() - startTime);

    // iconFeatures
    const iconFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON,
      locale,
    });
    // console.log(`iconFeatures `, new Date().getTime() - startTime);

    // ratingFeatures
    const ratingFeatures = getProductCurrentViewCastedAttributes({
      attributes: initialProductAttributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
      locale,
    });
    // console.log(`ratingFeatures `, new Date().getTime() - startTime);

    // cardShopProducts
    const groupedByShops = (shopProducts || []).reduce(
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

    // cardBreadcrumbs
    const attributesBreadcrumbs: ProductCardBreadcrumbModel[] = [];
    // Collect breadcrumbs configs for all product attributes
    // that have showAsBreadcrumb option enabled
    for await (const productAttribute of initialProductAttributes || []) {
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

    const name = getFieldStringLocale(restProduct.nameI18n, locale);
    const description = getFieldStringLocale(restProduct.descriptionI18n, locale);
    const shopsCount = finalShopProducts.length;
    const isShopless = noNaN(shopsCount) < 1;
    const cardAssets = assets ? assets.assets : [];
    const cardAttributesGroups = (attributesGroups || []).reduce(
      (acc: ProductAttributesGroupInterface[], attributesGroup) => {
        const visibleAttributes = attributesGroup.attributes.filter(
          ({ showInCard, attributeId }) => {
            const excluded = excludedAttributesIds.some((excludedAttributeId) => {
              return excludedAttributeId.equals(attributeId);
            });
            return showInCard && !excluded;
          },
        );

        if (visibleAttributes.length > 0) {
          return [
            ...acc,
            {
              ...attributesGroup,
              attributes: visibleAttributes,
            },
          ];
        }

        return acc;
      },
      [],
    );

    const shopsCounterPostfix =
      noNaN(shopsCount) > 1
        ? getConstantTranslation(`shops.plural.${locale}`)
        : getConstantTranslation(`shops.single.${locale}`);

    return {
      product: {
        ...restProduct,
        name,
        description: description === LOCALE_NOT_FOUND_FIELD_MESSAGE ? name : description,
      },
      cardPrices,
      rubric,
      cardLayout: rubric?.variant?.cardLayout || LAYOUT_DEFAULT,
      connections: cardConnections,
      listFeatures,
      textFeatures,
      tagFeatures,
      iconFeatures,
      ratingFeatures,
      cardShopProducts,
      cardBreadcrumbs,
      shopsCount,
      isShopless,
      shopProducts: finalShopProducts,
      cardContent: castedCardContent,
      shopsCounterPostfix,
      attributesGroups: cardAttributesGroups,
      assets: cardAssets,
      isSingleImage: cardAssets.length < minAssetsListCount,
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
