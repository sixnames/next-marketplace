import { get } from 'lodash';
import { ObjectId } from 'mongodb';
import {
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
  FILTER_CATEGORY_KEY,
  FILTER_SEPARATOR,
  GENDER_PLURAL,
  ROUTE_CATALOGUE,
  SORT_DESC,
} from '../config/common';
import { DEFAULT_LAYOUT } from '../config/constantSelects';
import { getConstantTranslation } from '../config/constantTranslations';
import {
  COL_ATTRIBUTES,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_PRODUCT_SUMMARIES,
  COL_ATTRIBUTES_GROUPS,
} from '../db/collectionNames';
import { castAttributeForUI } from '../db/dao/attributes/castAttributesGroupForUI';
import {
  ignoreNoImageStage,
  productAttributesPipeline,
  productCategoriesPipeline,
} from '../db/dao/constantPipelines';
import { castOptionForUI } from '../db/dao/options/castOptionForUI';
import { castSummaryForUI } from '../db/dao/product/castSummaryForUI';
import {
  AttributesGroupModel,
  CatalogueBreadcrumbModel,
  ObjectIdModel,
  ProductCardBreadcrumbModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import {
  CategoryInterface,
  InitialCardDataInterface,
  ProductAttributeInterface,
  ProductAttributesGroupInterface,
  ProductVariantInterface,
  ProductVariantItemInterface,
  ShopInterface,
  ProductSummaryInterface,
  ShopProductInterface,
  AttributeInterface,
  OptionInterface,
} from '../db/uiInterfaces';
import { sortObjectsByField } from './arrayUtils';
import { getFieldStringLocale } from './i18n';
import { noNaN } from './numbers';
import { phoneToRaw, phoneToReadable } from './phoneUtils';
import {
  castProductAttributeForUi,
  getProductCurrentViewCastedAttributes,
} from './productAttributesUtils';
import { getProductSeoContent } from './seoContentUtils';
import { getTreeFromList } from './treeUtils';

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

export interface GetCardDataBaseInterface {
  locale: string;
  city: string;
  companyId?: string | ObjectId | null;
}

interface GetCardVariantsInterface extends GetCardDataBaseInterface {
  variants: ProductVariantInterface[];
}

async function getCardVariants({
  city,
  companyId,
  locale,
  variants,
}: GetCardVariantsInterface): Promise<ProductVariantInterface[]> {
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const attributesCollection = db.collection<AttributeInterface>(COL_ATTRIBUTES);
  const optionsCollection = db.collection<OptionInterface>(COL_OPTIONS);
  const productSummariesCollection = db.collection<ProductSummaryInterface>(COL_PRODUCT_SUMMARIES);
  const companyMatch = companyId ? { companyId: new ObjectId(companyId) } : {};

  const productVariants: ProductVariantInterface[] = [];
  for await (const variant of variants) {
    // get attribute
    const attribute = await attributesCollection.findOne({
      _id: variant.attributeId,
    });
    if (!attribute) {
      continue;
    }

    const variantProducts: ProductVariantItemInterface[] = [];

    // get products and options
    for await (const variantProduct of variantProducts) {
      // option
      const option = await optionsCollection.findOne({ _id: variantProduct.optionId });
      if (!option) {
        continue;
      }

      // summary
      const summary = await productSummariesCollection.findOne({ _id: variantProduct.productId });
      if (!summary) {
        continue;
      }

      // shop products
      const shopProducts = await shopProductsCollection
        .aggregate<ShopProductInterface>([
          {
            $match: {
              citySlug: city,
              ...companyMatch,
              productId: summary._id,
              ...ignoreNoImageStage,
            },
          },
        ])
        .toArray();

      variantProducts.push({
        ...variantProduct,
        option: castOptionForUI({ option, locale, gender: summary.gender }),
        summary: castSummaryForUI({
          summary: {
            ...summary,
            shopProducts,
          },
          locale,
        }),
      });
    }

    productVariants.push({
      ...variant,
      attribute: castAttributeForUI({ attribute, locale }),
      products: variantProducts,
    });
  }

  return productVariants;
}

const minAssetsListCount = 2;

export interface GetCardDataInterface extends GetCardDataBaseInterface {
  slug: string;
  companySlug: string;
}

export async function getCardData({
  locale,
  city,
  slug,
  companyId,
  ...props
}: GetCardDataInterface): Promise<InitialCardDataInterface | null> {
  try {
    // const startTime = new Date().getTime();
    const { db } = await getDatabase();
    const productSummariesCollection =
      db.collection<ProductSummaryInterface>(COL_PRODUCT_SUMMARIES);
    const attributeGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
    const companyMatch = companyId ? { companyId: new ObjectId(companyId) } : {};
    const companySlug = props.companySlug;
    const shopProductsMatch = {
      citySlug: city,
      ...companyMatch,
    };

    // const shopProductsStartTime = new Date().getTime();
    const shopProductsAggregation = await productSummariesCollection
      .aggregate<ProductSummaryInterface>([
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

        // get product categories
        ...productCategoriesPipeline(),

        // get product attributes
        ...productAttributesPipeline({ getOptionIcon: true }),

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
            minPrice: '$minPrice',
            maxPrice: '$maxPrice',
            shopsCount: { $size: '$shops' },
            rubric: { $arrayElemAt: ['$rubric', 0] },
            brand: { $arrayElemAt: ['$brand', 0] },
            brandCollection: { $arrayElemAt: ['$brandCollection', 0] },
            manufacturer: { $arrayElemAt: ['$manufacturer', 0] },
            assets: { $arrayElemAt: ['$assets', 0] },
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
      attributes,
      brand,
      brandCollection,
      manufacturer,
      categories,
      shops,
      ...restProduct
    } = product;

    // card connections
    const excludedAttributesIds: ObjectIdModel[] = [];
    const cardVariants = await getCardVariants({
      variants: product.variants,
      locale,
      companyId,
      city,
    });
    cardVariants.forEach(({ attributeId }) => {
      excludedAttributesIds.push(attributeId);
    });

    const initialProductAttributes = attributes.filter((productAttribute) => {
      const excluded = excludedAttributesIds.some((excludedAttributeId) => {
        return excludedAttributeId.equals(productAttribute.attributeId);
      });
      return !productAttribute.attribute?.showInCard && !excluded;
    });

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
    const shopProductIds: string[] = [];
    let maxAvailable = 0;
    const finalCardShops = (shops || []).reduce((acc: ShopInterface[], shop) => {
      if (!shop.cardShopProduct) {
        return acc;
      }

      prices.push(shop.cardShopProduct.price);
      shopProductIds.push(`${shop.cardShopProduct._id}`);

      if (shop.cardShopProduct.available > maxAvailable) {
        maxAvailable = shop.cardShopProduct.available;
      }

      return [
        ...acc,
        {
          ...shop,
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
    // console.log(`cardShopProducts `, new Date().getTime() - startTime);

    // card seo content
    const cardContent = await getProductSeoContent({
      companySlug,
      citySlug: city,
      productId: product._id,
      productSlug: product.slug,
      rubricSlug: product.rubricSlug,
      locale,
    });

    // cardBreadcrumbs
    const attributesBreadcrumbs: ProductCardBreadcrumbModel[] = [];

    // category breadcrumbs
    const cardCategoriesTree = getTreeFromList({
      list: categories,
      childrenFieldName: 'categories',
      locale,
      gender: GENDER_PLURAL,
    });
    const breadcrumbCategories = cardCategoriesTree.reduce(
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
        !productAttribute.optionSlugs ||
        productAttribute.optionSlugs.length < 1
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
      const variant = get(firstSelectedOption, `variants.${GENDER_PLURAL}.${locale}`);
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

    // get attribute groups
    const productAttributesGroups: ProductAttributesGroupInterface[] = [];
    const attributeGroupsIds: ObjectIdModel[] = [];
    initialProductAttributes.forEach(({ attribute }) => {
      if (!attribute) {
        return;
      }
      const exist = attributeGroupsIds.some((_id) => _id.equals(attribute.attributesGroupId));
      if (!exist) {
        attributeGroupsIds.push(attribute.attributesGroupId);
      }
    });
    const attributesGroups = await attributeGroupsCollection
      .find({
        _id: {
          $in: attributeGroupsIds,
        },
      })
      .toArray();
    attributesGroups.forEach((attributesGroup) => {
      const groupAttributes = initialProductAttributes.reduce(
        (acc: ProductAttributeInterface[], productAttribute) => {
          if (!productAttribute.attribute?.attributesGroupId.equals(attributesGroup._id)) {
            return acc;
          }
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

      productAttributesGroups.push({
        ...attributesGroup,
        name: getFieldStringLocale(attributesGroup.nameI18n, locale),
        attributes: sortObjectsByField(groupAttributes),
      });
    });

    const isSingleImage = restProduct.assets.length < minAssetsListCount;
    const showCardImagesSlider = !isSingleImage && Boolean(rubric?.variant?.showCardImagesSlider);
    const showCardBrands = Boolean(rubric?.variant?.showCardBrands);
    const showArticle = Boolean(rubric?.variant?.showCardArticle);
    const cardBrandsLabel = getFieldStringLocale(rubric?.variant?.cardBrandsLabelI18n, locale);

    const shopsCounterPostfix =
      noNaN(shopsCount) > 1
        ? getConstantTranslation(`shops.plural.${locale}`)
        : getConstantTranslation(`shops.single.${locale}`);

    // title
    const cardTitle = getFieldStringLocale(restProduct.cardTitleI18n, locale);

    return {
      product: {
        ...restProduct,
        name,
        shopProductIds,
        description: description || cardTitle,
        variants: cardVariants,
        attributes: [],
        minPrice,
        maxPrice,
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
      maxAvailable,
      cardTitle,
      rubric,
      cardLayout: rubric?.variant?.cardLayout || DEFAULT_LAYOUT,
      listFeatures,
      textFeatures,
      tagFeatures,
      iconFeatures,
      ratingFeatures,
      attributesGroups: sortObjectsByField(productAttributesGroups),
      cardShops: finalCardShops,
      cardBreadcrumbs,
      shopsCount,
      isShopless,
      cardContent,
      shopsCounterPostfix,
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
