import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  ROUTE_CATALOGUE,
} from 'config/common';
import { COL_PRODUCTS, COL_RUBRICS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ProductCardBreadcrumbModel, ProductModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getCurrencyString, getFieldStringLocale } from 'lib/i18n';
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
}: GetCardDataInterface): Promise<ProductModel | null> {
  try {
    // const startTime = new Date().getTime();
    const db = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const companyRubricsMatch = companyId ? { companyId: new ObjectId(companyId) } : {};

    // const shopProductsStartTime = new Date().getTime();
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ProductModel>([
        {
          $match: {
            slug,
            citySlug: city,
            ...companyRubricsMatch,
          },
        },
        // Get shops
        {
          $lookup: {
            from: COL_SHOPS,
            as: 'shops',
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
            shop: { $arrayElemAt: ['$shops', 0] },
          },
        },
        {
          $project: {
            shops: false,
          },
        },
        {
          $group: {
            _id: '$productId',
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
        // Get product rubric
        {
          $lookup: {
            from: COL_PRODUCTS,
            as: 'products',
            let: {
              productId: '$_id',
              shopProducts: '$shopProducts',
              shopProductIds: '$shopProductIds',
              minPrice: '$minPrice',
              maxPrice: '$maxPrice',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$productId', '$_id'],
                  },
                },
              },
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
              {
                $addFields: {
                  cardPrices: {
                    min: '$$minPrice',
                    max: '$$maxPrice',
                  },
                  shopsCount: { $size: '$$shopProducts' },
                  shopProducts: '$$shopProducts',
                  shopProductIds: '$$shopProductIds',
                  rubric: { $arrayElemAt: ['$rubrics', 0] },
                },
              },
              {
                $project: {
                  rubrics: false,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            product: { $arrayElemAt: ['$products', 0] },
          },
        },
        {
          $project: {
            products: false,
          },
        },
        { $replaceRoot: { newRoot: '$product' } },
      ])
      .toArray();
    const product = shopProductsAggregation[0];
    if (!product || !product.rubric) {
      return null;
    }
    // console.log(shopProductsAggregationResult);
    // console.log(JSON.stringify(product, null, 2));
    // console.log(`Shop products `, new Date().getTime() - shopProductsStartTime);

    // prices
    const cardPrices = {
      min: getCurrencyString(product.cardPrices?.min),
      max: getCurrencyString(product.cardPrices?.max),
    };

    // image
    const sortedAssets = product.assets.sort((assetA, assetB) => {
      return assetA.index - assetB.index;
    });
    const firstAsset = sortedAssets[0];
    let mainImage = `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;

    if (firstAsset) {
      mainImage = firstAsset.url;
    }
    // console.log(`image `, new Date().getTime() - startTime);

    // listFeatures
    const listFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      locale,
    });
    // console.log(`listFeatures `, new Date().getTime() - startTime);

    // textFeatures
    const textFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT,
      locale,
    });
    // console.log(`textFeatures `, new Date().getTime() - startTime);

    // tagFeatures
    const tagFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
      locale,
    });
    // console.log(`tagFeatures `, new Date().getTime() - startTime);

    // iconFeatures
    const iconFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON,
      locale,
    });
    // console.log(`iconFeatures `, new Date().getTime() - startTime);

    // ratingFeatures
    const ratingFeatures = getProductCurrentViewCastedAttributes({
      attributes: product.attributes,
      viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
      locale,
    });
    // console.log(`ratingFeatures `, new Date().getTime() - startTime);

    // cardShopProducts
    const cardShopProducts: ShopProductModel[] = [];
    (product.shopProducts || []).forEach((shopProduct) => {
      const { shop } = shopProduct;
      if (!shop) {
        return;
      }
      console.log(shopProduct);
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
    for await (const productAttribute of product.attributes) {
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
      const options = productAttribute.selectedOptions;

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
        href: `${ROUTE_CATALOGUE}/${rubric.slug}/${firstSelectedOption.slug}`,
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

    return {
      ...restProduct,
      name: getFieldStringLocale(product.nameI18n, locale),
      description: getFieldStringLocale(product.descriptionI18n, locale),
      cardPrices,
      mainImage,
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
