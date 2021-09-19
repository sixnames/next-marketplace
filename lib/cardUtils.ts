import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  FILTER_SEPARATOR,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  ROUTE_CATALOGUE,
  SORT_ASC,
  SORT_DESC,
  CATALOGUE_CATEGORY_KEY,
  GENDER_IT,
} from 'config/common';
import { DEFAULT_LAYOUT } from 'config/constantSelects';
import { getConstantTranslation } from 'config/constantTranslations';
import {
  COL_ATTRIBUTES_GROUPS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_ICONS,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CARD_CONTENTS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { productCategoriesPipeline, productConnectionsPipeline } from 'db/dao/constantPipelines';
import {
  CatalogueBreadcrumbModel,
  ObjectIdModel,
  ProductCardBreadcrumbModel,
  ShopProductModel,
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
  ShopProductInterface,
  ShopProductsGroupInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionsUtils';
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
  const categorySlug = `${CATALOGUE_CATEGORY_KEY}${FILTER_SEPARATOR}${category.slug}`;
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
}

export async function getCardData({
  locale,
  city,
  slug,
  companyId,
  companySlug,
  useUniqueConstructor,
}: GetCardDataInterface): Promise<InitialCardDataInterface | null> {
  try {
    // const startTime = new Date().getTime();
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const companyMatch = companyId ? { companyId: new ObjectId(companyId) } : {};

    // const shopProductsStartTime = new Date().getTime();
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ProductInterface>([
        {
          $match: {
            slug,
            citySlug: city,
            ...companyMatch,
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
            gender: { $first: '$gender' },
            mainImage: { $first: `$mainImage` },
            originalName: { $first: `$originalName` },
            nameI18n: { $first: `$nameI18n` },
            descriptionI18n: { $first: `descriptionI18n` },
            rubricId: { $first: `$rubricId` },
            rubricSlug: { $first: `$rubricSlug` },
            manufacturerSlug: { $first: `$manufacturerSlug` },
            brandSlug: { $first: `$brandSlug` },
            titleCategoriesSlugs: { $first: `$titleCategoriesSlugs` },
            brandCollectionSlug: { $first: `$brandCollectionSlug` },
            selectedOptionsSlugs: {
              $first: '$selectedOptionsSlugs',
            },
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
                  showRubricNameInProductTitle: true,
                  showCategoryInProductTitle: true,
                  showBrandInSnippetTitle: true,
                  showBrandInCardTitle: true,
                  catalogueTitle: true,
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
                  companySlug: useUniqueConstructor ? companySlug : DEFAULT_COMPANY_SLUG,
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

        // Lookup product connection
        ...productConnectionsPipeline(city),

        // Lookup product categories
        ...productCategoriesPipeline(),

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

        // Get product manufacturer
        {
          $lookup: {
            from: COL_MANUFACTURERS,
            as: 'manufacturer',
            let: {
              manufacturerSlug: '$manufacturerSlug',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$manufacturerSlug', '$slug'],
                  },
                },
              },
            ],
          },
        },

        // Get product brand
        {
          $lookup: {
            from: COL_BRANDS,
            as: 'brand',
            let: {
              brandSlug: '$brandSlug',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$brandSlug', '$slug'],
                  },
                },
              },
            ],
          },
        },

        // Get product brand collection
        {
          $lookup: {
            from: COL_BRAND_COLLECTIONS,
            as: 'brandCollection',
            let: {
              brandCollectionSlug: '$brandCollectionSlug',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$brandCollectionSlug', '$slug'],
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
            shopsCount: { $size: '$shopProducts' },
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
      shopProducts,
      brand,
      brandCollection,
      manufacturer,
      categories,
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
        const visibleAttributes = attributes.filter(({ showInCard }) => {
          return showInCard;
        });

        return [...acc, ...visibleAttributes];
      },
      [],
    );

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

    const cardCategories = getTreeFromList({
      list: categories,
      childrenFieldName: 'categories',
      locale,
    });

    // cardBreadcrumbs
    const attributesBreadcrumbs: ProductCardBreadcrumbModel[] = [];
    let breadcrumbsGender = rubric?.catalogueTitle.gender || GENDER_IT;
    // Collect breadcrumbs configs for all product categories
    const breadcrumbCategories = cardCategories.reduce(
      (acc: ProductCardBreadcrumbModel[], category) => {
        breadcrumbsGender = category.gender || GENDER_IT;
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

    // Collect breadcrumbs configs for all product attributes
    // that have showAsBreadcrumb option enabled
    for await (const productAttribute of initialProductAttributes || []) {
      if (
        !productAttribute.showAsBreadcrumb ||
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
      const variant = get(firstSelectedOption, `variants.${breadcrumbsGender}.${locale}`);
      const name = getFieldStringLocale(firstSelectedOption.nameI18n, locale);
      let optionValue = name;
      if (variant) {
        optionValue = variant;
      }

      // Push breadcrumb config to the list
      attributesBreadcrumbs.push({
        _id: productAttribute.attributeId,
        name: optionValue,
        href: `${ROUTE_CATALOGUE}/${rubric.slug}/${productAttribute.slug}${FILTER_SEPARATOR}${firstSelectedOption.slug}`,
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
          ({ showInCard, attributeId, viewVariant }) => {
            const isListViewAttribute = viewVariant === ATTRIBUTE_VIEW_VARIANT_LIST;
            const excluded = excludedAttributesIds.some((excludedAttributeId) => {
              return excludedAttributeId.equals(attributeId);
            });
            return showInCard && !excluded && isListViewAttribute;
          },
        );

        if (visibleAttributes.length > 0) {
          return [
            ...acc,
            {
              ...attributesGroup,
              name: getFieldStringLocale(attributesGroup.nameI18n, locale),
              attributes: visibleAttributes.reduce(
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
              ),
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
      brand,
      showBrandNameInProductTitle: rubric.showBrandInCardTitle,
      rubricName: getFieldStringLocale(rubric.nameI18n, locale),
      showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
      showCategoryInProductTitle: rubric.showCategoryInProductTitle,
      attributes: allProductAttributes,
      titleCategoriesSlugs: restProduct.titleCategoriesSlugs,
      nameI18n: restProduct.nameI18n,
      originalName: restProduct.originalName,
      defaultGender: restProduct.gender,
      categories: cardCategories,
    });

    return {
      product: {
        ...restProduct,
        name,
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
      cardShopProducts,
      shopProducts: [],
      cardBreadcrumbs,
      shopsCount,
      isShopless,
      cardContent: castedCardContent,
      shopsCounterPostfix,
      attributesGroups: cardAttributesGroups,
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
