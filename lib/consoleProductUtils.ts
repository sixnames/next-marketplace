import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  CATEGORY_SLUG_PREFIX_SEPARATOR,
  CATEGORY_SLUG_PREFIX_WORD,
  FILTER_SEPARATOR,
  GENDER_HE,
  PAGINATION_DEFAULT_LIMIT,
  SORT_DESC,
} from 'config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getCommonFilterAttribute,
  getPriceAttribute,
} from 'config/constantAttributes';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_COMPANIES,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  brandPipeline,
  filterAttributesPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
  productSeoPipeline,
  shopProductFieldsPipeline,
} from 'db/dao/constantPipelines';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AttributeInterface,
  BrandInterface,
  CategoryInterface,
  CompanyShopProductsPageInterface,
  ConsoleRubricProductsInterface,
  ProductAttributeInterface,
  ProductInterface,
  ProductsAggregationInterface,
  RubricInterface,
  ShopInterface,
  ShopProductInterface,
  ShopProductsAggregationInterface,
} from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { castCatalogueFilters, getCatalogueAttributes } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionsUtils';
import {
  countProductAttributes,
  getCategoryAllAttributes,
  getRubricAllAttributes,
} from 'lib/productAttributesUtils';
import { generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import { ShopAddProductsListRouteReduced } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/products/add/[...filters]';
import { ParsedUrlQuery } from 'querystring';

export interface GetConsoleRubricProductsInputInterface {
  locale: string;
  basePath: string;
  query: ParsedUrlQuery;
  page?: number;
  excludedProductsIds?: ObjectIdModel[] | null;
}

export const getConsoleRubricProducts = async ({
  locale,
  basePath,
  page,
  query,
  excludedProductsIds,
}: GetConsoleRubricProductsInputInterface): Promise<ConsoleRubricProductsInterface> => {
  let fallbackPayload: ConsoleRubricProductsInterface = {
    clearSlug: basePath,
    basePath,
    page: 1,
    totalDocs: 0,
    totalPages: 0,
    docs: [],
    attributes: [],
    selectedAttributes: [],
    categorySlugs: [],
    brandSlugs: [],
  };

  try {
    const { db } = await getDatabase();
    const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
    const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
    const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);
    const [rubricId, ...filters] = alwaysArray(query.filters);
    const search = alwaysString(query.search);

    // get rubric
    const rubric = await rubricsCollection.findOne({
      _id: new ObjectId(rubricId),
    });
    if (!rubric) {
      return fallbackPayload;
    }

    // update fallback payload
    fallbackPayload = {
      ...fallbackPayload,
      rubric,
    };

    // cast selected filters
    const {
      skip,
      limit,
      rubricFilters,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
      photoStage,
    } = castCatalogueFilters({
      filters,
      initialPage: page,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
    });

    // rubric stage
    let rubricStage: Record<any, any> = {
      rubricId: new ObjectId(rubricId),
    };
    if (rubricFilters && rubricFilters.length > 0) {
      rubricStage = {
        rubricSlug: {
          $in: rubricFilters,
        },
      };
    }

    // search stage
    let searchStage = {};
    let searchIds: ObjectIdModel[] = [];
    if (search) {
      searchIds = await getAlgoliaProductsSearch({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        search,
        excludedProductsIds,
      });
      searchStage = {
        _id: {
          $in: searchIds,
        },
      };
    }
    if (search && searchIds.length < 1) {
      return fallbackPayload;
    }

    // excluded ids stage
    const excludedIdsStage =
      excludedProductsIds && excludedProductsIds.length > 0
        ? {
            _id: {
              $nin: excludedProductsIds,
            },
          }
        : {};

    // initial match
    const productsInitialMatch = {
      ...searchStage,
      ...excludedIdsStage,
      ...rubricStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      ...photoStage,
    };

    const productDataAggregationResult = await productsCollection
      .aggregate<ProductsAggregationInterface>([
        // match products
        {
          $match: productsInitialMatch,
        },
        {
          $facet: {
            // docs facet
            docs: [
              {
                $sort: {
                  _id: SORT_DESC,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },

              // get product brand
              ...brandPipeline,

              // get product attributes
              ...productAttributesPipeline,

              // get product brand
              ...brandPipeline,

              // get product categories
              ...productCategoriesPipeline(),

              // get product seo info
              ...productSeoPipeline,

              // count shop products
              {
                $lookup: {
                  from: COL_SHOP_PRODUCTS,
                  as: 'shopsCount',
                  let: { productId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$productId', '$productId'],
                        },
                      },
                    },
                    {
                      $group: {
                        _id: '$shopId',
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  shopsCount: {
                    $size: '$shopsCount',
                  },
                },
              },
            ],

            // prices facet
            prices: [
              {
                $group: {
                  _id: '$minPrice',
                },
              },
            ],

            // category slugs facet
            selectedOptionsSlugs: [
              {
                $unwind: {
                  path: '$selectedOptionsSlugs',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: '$selectedOptionsSlugs',
                },
              },
            ],

            // brand slugs facet
            brandSlugs: [
              {
                $group: {
                  _id: '$brandSlug',
                },
              },
            ],

            // brand collection slugs facet
            brandCollectionSlugs: [
              {
                $group: {
                  _id: '$brandCollectionSlug',
                },
              },
            ],

            // countAllDocs facet
            countAllDocs: [
              {
                $count: 'totalDocs',
              },
            ],

            // rubric facet
            rubric: [
              {
                $group: {
                  _id: '$rubricId',
                },
              },
              {
                $lookup: {
                  from: COL_RUBRICS,
                  as: 'rubric',
                  let: {
                    rubricId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$rubricId'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $arrayElemAt: ['$rubric', 0],
                  },
                },
              },
            ],

            // attributes facet
            attributes: filterAttributesPipeline({
              _id: SORT_DESC,
            }),
          },
        },

        // cast facets
        {
          $addFields: {
            totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
            rubric: { $arrayElemAt: ['$rubric', 0] },
          },
        },
        {
          $addFields: {
            countAllDocs: null,
            totalDocsObject: null,
            totalDocs: '$totalDocsObject.totalDocs',
          },
        },
        {
          $addFields: {
            totalPagesFloat: {
              $divide: ['$totalDocs', limit],
            },
          },
        },
        {
          $addFields: {
            totalPages: {
              $ceil: '$totalPagesFloat',
            },
          },
        },
      ])
      .toArray();
    const productDataAggregation = productDataAggregationResult[0];
    if (!productDataAggregation) {
      return fallbackPayload;
    }

    const {
      totalDocs,
      totalPages,
      attributes,
      prices,
      selectedOptionsSlugs,
      brandCollectionSlugs,
    } = productDataAggregation;

    // get categories
    const categorySlugs = selectedOptionsSlugs
      .filter((slug) => slug._id)
      .reduce((acc: string[], slug) => {
        const slugParts = slug._id.split(CATEGORY_SLUG_PREFIX_SEPARATOR);
        if (slugParts[0] === CATEGORY_SLUG_PREFIX_WORD && slugParts[1]) {
          return [...acc, slug._id];
        }
        return acc;
      }, []);
    const categories = await categoriesCollection
      .aggregate<CategoryInterface>([
        {
          $match: {
            slug: {
              $in: categorySlugs,
            },
          },
        },
        {
          $sort: {
            _id: SORT_DESC,
          },
        },
      ])
      .toArray();

    // get brands
    const brandSlugs = productDataAggregation.brandSlugs
      .filter((slug) => slug._id)
      .map((slug) => slug._id);
    const brands = await brandsCollection
      .aggregate<BrandInterface>([
        {
          $match: {
            slug: {
              $in: brandSlugs,
            },
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
                        $in: ['$slug', brandCollectionSlugs],
                      },
                    },
                  ],
                },
              },
              {
                $sort: {
                  _id: SORT_DESC,
                },
              },
            ],
          },
        },
        {
          $sort: {
            _id: SORT_DESC,
          },
        },
      ])
      .toArray();

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute();

    // category attribute
    let categoryAttribute: AttributeInterface[] = [];
    if (categories && categories.length) {
      categoryAttribute = [
        getCategoryFilterAttribute({
          locale,
          categories,
        }),
      ];
    }

    // brand attribute
    let brandAttribute: AttributeInterface[] = [];
    const showBrandInFilter = search ? true : Boolean(rubric?.showBrandInFilter);
    if (brands && brands.length > 0 && showBrandInFilter) {
      brandAttribute = [
        getBrandFilterAttribute({
          locale,
          brands,
        }),
      ];
    }

    // rubric attributes
    const rubricAttributes = (attributes || []).map((attribute) => {
      return {
        ...attribute,
        options: getTreeFromList({
          list: attribute.options,
          childrenFieldName: 'options',
        }),
      };
    });

    // common attribute
    const commonAttribute = getCommonFilterAttribute();

    // cast attributes
    const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [
        ...categoryAttribute,
        priceAttribute,
        ...brandAttribute,
        ...rubricAttributes,
        commonAttribute,
      ],
      locale,
      filters,
      productsPrices: prices,
      basePath,
      rubricGender: search ? GENDER_HE : rubric.catalogueTitle.gender,
      brands,
    });

    // rubric attributes
    const allRubricAttributes = await getRubricAllAttributes(rubric._id);
    const docs: ProductInterface[] = [];
    for await (const product of productDataAggregation.docs) {
      const cardPrices = {
        _id: new ObjectId(),
        min: `${noNaN(product.cardPrices?.min)}`,
        max: `${noNaN(product.cardPrices?.max)}`,
      };

      const productCategoryAttributes = await getCategoryAllAttributes(
        product.selectedOptionsSlugs,
      );

      // title
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: product.brand,
        rubricName: getFieldStringLocale(rubric.nameI18n, locale),
        showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
        showCategoryInProductTitle: rubric.showCategoryInProductTitle,
        attributes: product.attributes || [],
        categories: product.categories,
        titleCategoriesSlugs: product.titleCategoriesSlugs,
        originalName: product.originalName,
        defaultGender: product.gender,
      });

      const castedProduct: ProductInterface = {
        ...product,
        cardPrices,
        snippetTitle,
        name: getFieldStringLocale(product.nameI18n, locale),
        attributesCount: countProductAttributes(product.attributes),
        totalAttributesCount: allRubricAttributes.length + productCategoryAttributes.length,
      };

      docs.push(castedProduct);
    }

    const payload: ConsoleRubricProductsInterface = {
      clearSlug: basePath,
      categorySlugs,
      brandSlugs,
      basePath,
      page: 1,
      totalDocs,
      totalPages,
      docs,
      attributes: castedAttributes,
      selectedAttributes,
      rubric: {
        ...rubric,
        name: getFieldStringLocale(rubric.nameI18n, locale),
      },
    };

    return payload;
  } catch (e) {
    console.log(e);
    return fallbackPayload;
  }
};

export interface GetConsoleShopProductsInputInterface {
  locale: string;
  basePath: string;
  query: ParsedUrlQuery;
  page?: number;
  excludedProductsIds?: ObjectIdModel[] | null;
}

export const getConsoleShopProducts = async ({
  locale,
  basePath,
  page,
  query,
  excludedProductsIds,
}: GetConsoleShopProductsInputInterface): Promise<CompanyShopProductsPageInterface | null> => {
  try {
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
    const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
    const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);
    const [rubricId, ...filters] = alwaysArray(query.filters);
    const search = alwaysString(query.search);
    const shopId = alwaysString(query.shopId);

    // Get shop
    const shopAggregation = await shopsCollection
      .aggregate<ShopInterface>([
        {
          $match: { _id: new ObjectId(`${shopId}`) },
        },
        {
          $lookup: {
            from: COL_COMPANIES,
            as: 'company',
            foreignField: '_id',
            localField: 'companyId',
          },
        },
        {
          $addFields: {
            company: {
              $arrayElemAt: ['$company', 0],
            },
          },
        },
      ])
      .toArray();
    const shop = shopAggregation[0];
    if (!shop) {
      return null;
    }

    const fallbackPayload: CompanyShopProductsPageInterface = {
      basePath: '',
      rubricSlug: '',
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      docs: [],
      attributes: [],
      selectedAttributes: [],
      categorySlugs: [],
      brandSlugs: [],
      clearSlug: '',
      rubricId: '',
      rubricName: '',
      shop,
    };

    // cast selected filters
    const {
      skip,
      limit,
      rubricFilters,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
      photoStage,
    } = castCatalogueFilters({
      filters,
      initialPage: page,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
    });

    // rubric stage
    let rubricStage: Record<any, any> = {
      rubricId: new ObjectId(rubricId),
    };
    if (rubricFilters && rubricFilters.length > 0) {
      rubricStage = {
        rubricSlug: {
          $in: rubricFilters,
        },
      };
    }

    // search stage
    let searchStage = {};
    let searchIds: ObjectIdModel[] = [];
    if (search) {
      searchIds = await getAlgoliaProductsSearch({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        search,
        excludedProductsIds,
      });
      searchStage = {
        _id: {
          $in: searchIds,
        },
      };
    }
    if (search && searchIds.length < 1) {
      return fallbackPayload;
    }

    // initial match
    const productsInitialMatch = {
      shopId: shop._id,
      ...rubricStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      ...searchStage,
      ...photoStage,
    };

    const shopProductsAggregationResult = await shopProductsCollection
      .aggregate<ShopProductsAggregationInterface>([
        // match products
        {
          $match: productsInitialMatch,
        },

        // facets
        {
          $facet: {
            // docs facet
            docs: [
              {
                $sort: {
                  _id: SORT_DESC,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },

              // get shop product fields
              ...shopProductFieldsPipeline('$productId'),

              // get product attributes
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
                        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
                      },
                    },
                  ],
                },
              },
            ],

            // prices facet
            prices: [
              {
                $group: {
                  _id: '$minPrice',
                },
              },
            ],

            // category slugs facet
            selectedOptionsSlugs: [
              {
                $unwind: {
                  path: '$selectedOptionsSlugs',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: '$selectedOptionsSlugs',
                },
              },
            ],

            // brand slugs facet
            brandSlugs: [
              {
                $group: {
                  _id: '$brandSlug',
                },
              },
            ],

            // brand collection slugs facet
            brandCollectionSlugs: [
              {
                $group: {
                  _id: '$brandCollectionSlug',
                },
              },
            ],

            // countAllDocs facet
            countAllDocs: [
              {
                $count: 'totalDocs',
              },
            ],

            // rubric facet
            rubric: [
              {
                $group: {
                  _id: '$rubricId',
                },
              },
              {
                $lookup: {
                  from: COL_RUBRICS,
                  as: 'rubric',
                  let: {
                    rubricId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$rubricId'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $arrayElemAt: ['$rubric', 0],
                  },
                },
              },
            ],

            // attributes facet
            attributes: filterAttributesPipeline({
              _id: SORT_DESC,
            }),
          },
        },

        // cast facets
        {
          $addFields: {
            totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
            rubric: { $arrayElemAt: ['$rubric', 0] },
          },
        },
        {
          $addFields: {
            countAllDocs: null,
            totalDocsObject: null,
            totalDocs: '$totalDocsObject.totalDocs',
          },
        },
        {
          $addFields: {
            totalPagesFloat: {
              $divide: ['$totalDocs', limit],
            },
          },
        },
        {
          $addFields: {
            totalPages: {
              $ceil: '$totalPagesFloat',
            },
          },
        },
      ])
      .toArray();
    const shopProductsAggregation = shopProductsAggregationResult[0];
    if (!shopProductsAggregation) {
      return fallbackPayload;
    }

    const {
      totalDocs,
      totalPages,
      attributes,
      rubric,
      prices,
      selectedOptionsSlugs,
      brandCollectionSlugs,
    } = shopProductsAggregation;

    if (!rubric) {
      return fallbackPayload;
    }

    // get categories
    const categorySlugs = selectedOptionsSlugs
      .filter((slug) => slug._id)
      .reduce((acc: string[], slug) => {
        const slugParts = slug._id.split(CATEGORY_SLUG_PREFIX_SEPARATOR);
        if (slugParts[0] === CATEGORY_SLUG_PREFIX_WORD && slugParts[1]) {
          return [...acc, slug._id];
        }
        return acc;
      }, []);
    const categories = await categoriesCollection
      .aggregate<CategoryInterface>([
        {
          $match: {
            slug: {
              $in: categorySlugs,
            },
          },
        },
        {
          $sort: {
            _id: SORT_DESC,
          },
        },
      ])
      .toArray();

    // get brands
    const brandSlugs = shopProductsAggregation.brandSlugs
      .filter((slug) => slug._id)
      .map((slug) => slug._id);
    const brands = await brandsCollection
      .aggregate<BrandInterface>([
        {
          $match: {
            slug: {
              $in: brandSlugs,
            },
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
                        $in: ['$slug', brandCollectionSlugs],
                      },
                    },
                  ],
                },
              },
              {
                $sort: {
                  _id: SORT_DESC,
                },
              },
            ],
          },
        },
        {
          $sort: {
            _id: SORT_DESC,
          },
        },
      ])
      .toArray();

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute();

    // category attribute
    let categoryAttribute: AttributeInterface[] = [];
    if (categories && categories.length) {
      categoryAttribute = [
        getCategoryFilterAttribute({
          locale,
          categories,
        }),
      ];
    }

    // brand attribute
    let brandAttribute: AttributeInterface[] = [];
    const showBrandInFilter = search ? true : Boolean(rubric?.showBrandInFilter);
    if (brands && brands.length > 0 && showBrandInFilter) {
      brandAttribute = [
        getBrandFilterAttribute({
          locale,
          brands,
        }),
      ];
    }

    // rubric attributes
    const rubricAttributes = (attributes || []).map((attribute) => {
      return {
        ...attribute,
        options: getTreeFromList({
          list: attribute.options,
          childrenFieldName: 'options',
        }),
      };
    });

    // common attribute
    const commonAttribute = getCommonFilterAttribute();

    // cast attributes
    const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [
        ...categoryAttribute,
        priceAttribute,
        ...brandAttribute,
        ...rubricAttributes,
        commonAttribute,
      ],
      locale,
      filters,
      productsPrices: prices,
      basePath,
      rubricGender: search ? GENDER_HE : rubric.catalogueTitle.gender,
      brands,
    });

    // cast shop products
    const docs: ShopProductInterface[] = [];
    shopProductsAggregation.docs.forEach((shopProduct) => {
      const product = shopProduct.product;
      if (!product) {
        return;
      }

      // product attributes
      const optionSlugs = shopProduct.selectedOptionsSlugs.reduce((acc: string[], selectedSlug) => {
        const slugParts = selectedSlug.split(FILTER_SEPARATOR);
        const optionSlug = slugParts[1];
        if (!optionSlug) {
          return acc;
        }
        return [...acc, optionSlug];
      }, []);

      const productAttributes = (product.attributes || []).reduce(
        (acc: ProductAttributeInterface[], attribute) => {
          const existingAttribute = (attributes || []).find(({ _id }) => {
            return _id.equals(attribute.attributeId);
          });
          if (!existingAttribute) {
            return acc;
          }

          const options = (existingAttribute.options || []).filter(({ slug }) => {
            return optionSlugs.includes(slug);
          });

          const productAttribute: ProductAttributeInterface = {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, locale),
            metric: attribute.metric
              ? {
                  ...attribute.metric,
                  name: getFieldStringLocale(attribute.metric.nameI18n, locale),
                }
              : null,
            options: getTreeFromList({
              list: options,
              childrenFieldName: 'options',
              locale,
            }),
          };
          return [...acc, productAttribute];
        },
        [],
      );

      // product categories
      const initialProductCategories = (categories || []).filter(({ slug }) => {
        return shopProduct.selectedOptionsSlugs.includes(slug);
      });
      const productCategories = getTreeFromList({
        list: initialProductCategories,
        childrenFieldName: 'categories',
        locale,
      });

      // product brand
      const productBrand = shopProduct.brandSlug
        ? (brands || []).find(({ slug }) => {
            return slug === shopProduct.brandSlug;
          })
        : null;

      // snippet title
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: productBrand,
        rubricName: getFieldStringLocale(rubric.nameI18n, locale),
        showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
        showCategoryInProductTitle: rubric.showCategoryInProductTitle,
        attributes: productAttributes,
        categories: productCategories,
        titleCategoriesSlugs: product.titleCategoriesSlugs,
        originalName: product.originalName,
        defaultGender: product.gender,
      });

      docs.push({
        ...shopProduct,
        product: {
          ...product,
          shopsCount: shopProduct.shopsCount,
          name: getFieldStringLocale(product.nameI18n, locale),
          snippetTitle,
        },
      });
    });

    const payload: CompanyShopProductsPageInterface = {
      categorySlugs,
      brandSlugs,
      shop,
      rubricName: getFieldStringLocale(rubric.nameI18n, locale),
      rubricId: rubric._id.toHexString(),
      rubricSlug: rubric.slug,
      clearSlug: basePath,
      basePath,
      page: 1,
      totalDocs,
      totalPages,
      attributes: castedAttributes,
      selectedAttributes,
      docs,
    };

    return payload;
  } catch (e) {
    console.log(e);
    return null;
  }
};

interface GetAddShopProductSsrDataInterface extends GetConsoleRubricProductsInputInterface {
  locale: string;
  basePath: string;
}

export async function getAddShopProductSsrData({
  locale,
  basePath,
  query,
}: GetAddShopProductSsrDataInterface): Promise<ShopAddProductsListRouteReduced | null> {
  const { db } = await getDatabase();
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
  const shopId = alwaysString(query.shopId);

  // console.log(' ');
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  // console.log('CompanyShopProductsList props ');
  // const startTime = new Date().getTime();

  // Get shop
  const shopAggregation = await shopsCollection
    .aggregate<ShopInterface>([
      {
        $match: { _id: new ObjectId(`${shopId}`) },
      },

      // get company
      {
        $lookup: {
          from: COL_COMPANIES,
          as: 'company',
          foreignField: '_id',
          localField: 'companyId',
        },
      },
      {
        $addFields: {
          company: {
            $arrayElemAt: ['$company', 0],
          },
        },
      },

      // get shop products
      {
        $lookup: {
          from: COL_SHOP_PRODUCTS,
          as: 'shopProducts',
          let: {
            shopId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$shopId', '$$shopId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const shop = shopAggregation[0];
  if (!shop) {
    return null;
  }
  const excludedProductsIds = (shop.shopProducts || []).map(({ productId }) => productId);

  const {
    selectedAttributes,
    page,
    docs,
    clearSlug,
    attributes,
    totalPages,
    totalDocs,
    rubric,
    categorySlugs,
    brandSlugs,
  } = await getConsoleRubricProducts({
    excludedProductsIds,
    query,
    locale,
    basePath,
  });

  if (!rubric) {
    return null;
  }

  const payload: ShopAddProductsListRouteReduced = {
    shop,
    rubricId: rubric._id.toHexString(),
    rubricName: getFieldStringLocale(rubric.nameI18n, locale),
    rubricSlug: rubric.slug,
    clearSlug,
    basePath,
    totalDocs,
    totalPages,
    attributes,
    selectedAttributes,
    page,
    docs,
    categorySlugs,
    brandSlugs,
  };

  return payload;
}
