import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  DEFAULT_CURRENCY,
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
  COL_CITIES,
  COL_COMPANIES,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import {
  filterAttributesPipeline,
  productSeoPipeline,
  shopProductSupplierProductsPipeline,
} from 'db/dao/constantPipelines';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AttributeInterface,
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
import { castSupplierProductsList } from 'lib/productUtils';
import { generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import { ShopAddProductsListRouteReduced } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/products/add/[...filters]';
import { ParsedUrlQuery } from 'querystring';

export interface GetConsoleRubricProductsInputInterface {
  locale: string;
  basePath: string;
  currency: string;
  query: ParsedUrlQuery;
  page?: number;
  excludedProductsIds?: ObjectIdModel[] | null;
  companySlug: string;
}

export const getConsoleRubricProducts = async ({
  locale,
  basePath,
  query,
  currency,
  excludedProductsIds,
  companySlug,
  ...props
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
    companySlug,
  };

  try {
    const { db } = await getDatabase();
    const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
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
      page,
      limit,
      rubricFilters,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
      photoStage,
    } = castCatalogueFilters({
      filters,
      initialPage: props.page,
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
                      },
                    },
                  ],
                },
              },

              // get product seo info
              ...productSeoPipeline(companySlug),

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

            // categories facet
            categories: [
              {
                $unwind: {
                  path: '$selectedOptionsSlugs',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: null,
                  rubricId: { $first: '$rubricId' },
                  selectedOptionsSlugs: {
                    $addToSet: '$selectedOptionsSlugs',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_CATEGORIES,
                  as: 'categories',
                  let: {
                    rubricId: '$rubricId',
                    selectedOptionsSlugs: '$selectedOptionsSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $and: [
                          {
                            $expr: {
                              $eq: ['$rubricId', '$$rubricId'],
                            },
                          },
                          {
                            $expr: {
                              $in: ['$slug', '$$selectedOptionsSlugs'],
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
                $unwind: {
                  path: '$categories',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $match: {
                  categories: {
                    $exists: true,
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$categories',
                },
              },
            ],

            // brands facet
            brands: [
              {
                $group: {
                  _id: '$brandSlug',
                  collectionSlugs: {
                    $addToSet: '$brandCollectionSlug',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_BRANDS,
                  as: 'brand',
                  let: {
                    itemId: '$_id',
                    collectionSlugs: '$collectionSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$itemId', '$$itemId'],
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
                                    $in: ['$itemId', '$$collectionSlugs'],
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
                  ],
                },
              },
              {
                $addFields: {
                  brand: {
                    $arrayElemAt: ['$brand', 0],
                  },
                },
              },
              {
                $match: {
                  brand: {
                    $exists: true,
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$brand',
                },
              },
              {
                $sort: {
                  _id: SORT_DESC,
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

    const { totalDocs, totalPages, attributes, prices, brands, categories } =
      productDataAggregation;

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute(currency);

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
      rubricGender: search ? GENDER_HE : rubric.gender,
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

      // product attributes
      const productAttributes = (product.attributes || []).reduce(
        (acc: ProductAttributeInterface[], attribute) => {
          const existingAttribute = (attributes || []).find(({ _id }) => {
            return _id.equals(attribute.attributeId);
          });
          if (!existingAttribute) {
            return acc;
          }

          const optionSlugs = product.selectedOptionsSlugs.reduce((acc: string[], selectedSlug) => {
            const slugParts = selectedSlug.split(FILTER_SEPARATOR);
            const attributeSlug = slugParts[0];
            const optionSlug = slugParts[1];
            if (!optionSlug || attributeSlug !== existingAttribute.slug) {
              return acc;
            }
            return [...acc, optionSlug];
          }, []);

          const options = (existingAttribute.options || []).filter(({ slug }) => {
            return optionSlugs.includes(slug);
          });

          const productAttribute: ProductAttributeInterface = {
            ...attribute,
            attribute: {
              ...existingAttribute,
              name: getFieldStringLocale(existingAttribute.nameI18n, locale),
              metric: existingAttribute.metric
                ? {
                    ...existingAttribute.metric,
                    name: getFieldStringLocale(existingAttribute.metric.nameI18n, locale),
                  }
                : null,
              options: getTreeFromList({
                list: options,
                childrenFieldName: 'options',
                locale,
              }),
            },
          };
          return [...acc, productAttribute];
        },
        [],
      );

      // product categories
      const initialProductCategories = (categories || []).filter(({ slug }) => {
        return product.selectedOptionsSlugs.includes(slug);
      });
      const productCategories = getTreeFromList({
        list: initialProductCategories,
        childrenFieldName: 'categories',
        locale,
      });

      // product brand
      const productBrand = product.brandSlug
        ? (brands || []).find(({ itemId }) => {
            return itemId === product.brandSlug;
          })
        : null;

      // title
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: productBrand
          ? {
              ...productBrand,
              collections: (productBrand.collections || []).filter((collection) => {
                return collection.itemId === product.brandCollectionSlug;
              }),
            }
          : null,
        rubricName: getFieldStringLocale(rubric.nameI18n, locale),
        showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
        showCategoryInProductTitle: rubric.showCategoryInProductTitle,
        attributes: productAttributes,
        categories: productCategories,
        titleCategoriesSlugs: product.titleCategoriesSlugs,
        originalName: product.originalName,
        defaultGender: product.gender,
      });

      const castedProduct: ProductInterface = {
        ...product,
        cardPrices,
        snippetTitle,
        name: getFieldStringLocale(product.nameI18n, locale),
        attributesCount: countProductAttributes(productAttributes),
        totalAttributesCount: allRubricAttributes.length + productCategoryAttributes.length,
      };

      docs.push(castedProduct);
    }

    const payload: ConsoleRubricProductsInterface = {
      clearSlug: basePath,
      companySlug,
      basePath,
      page,
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

export interface GetConsoleCompanyRubricProductsInputInterface {
  locale: string;
  basePath: string;
  currency: string;
  query: ParsedUrlQuery;
  page?: number;
  excludedProductsIds?: ObjectIdModel[] | null;
  companySlug: string;
  companyId: string;
}

export const getConsoleCompanyRubricProducts = async ({
  locale,
  basePath,
  query,
  currency,
  excludedProductsIds,
  companySlug,
  companyId,
  ...props
}: GetConsoleCompanyRubricProductsInputInterface): Promise<ConsoleRubricProductsInterface> => {
  let fallbackPayload: ConsoleRubricProductsInterface = {
    clearSlug: basePath,
    basePath,
    page: 1,
    totalDocs: 0,
    totalPages: 0,
    docs: [],
    attributes: [],
    selectedAttributes: [],
    companySlug,
  };

  try {
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
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
      page,
      limit,
      rubricFilters,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
      photoStage,
    } = castCatalogueFilters({
      filters,
      initialPage: props.page,
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
        productId: {
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
      companyId: new ObjectId(companyId),
      ...searchStage,
      ...excludedIdsStage,
      ...rubricStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      ...photoStage,
    };

    const productDataAggregationResult = await shopProductsCollection
      .aggregate<ProductsAggregationInterface>([
        // match shop products
        {
          $match: productsInitialMatch,
        },

        // unwind selectedOptionsSlugs field
        {
          $unwind: {
            path: '$selectedOptionsSlugs',
            preserveNullAndEmptyArrays: true,
          },
        },

        // group by productId
        {
          $group: {
            _id: '$productId',
            rubricId: { $first: '$rubricId' },
            rubricSlug: { $first: `$rubricSlug` },
            brandSlug: { $first: '$brandSlug' },
            brandCollectionSlug: { $first: '$brandCollectionSlug' },
            minPrice: {
              $min: '$price',
            },
            maxPrice: {
              $min: '$price',
            },
            available: {
              $max: '$available',
            },
            selectedOptionsSlugs: {
              $addToSet: '$selectedOptionsSlugs',
            },
            shopsIds: {
              $addToSet: '$shopId',
            },
          },
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
              {
                $lookup: {
                  from: COL_PRODUCTS,
                  as: 'product',
                  let: {
                    productId: '$_id',
                  },
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
                  product: { $arrayElemAt: ['$product', 0] },
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$product',
                },
              },

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

              // get product seo info
              ...productSeoPipeline(companySlug),
            ],

            // prices facet
            prices: [
              {
                $group: {
                  _id: '$minPrice',
                },
              },
            ],

            // categories facet
            categories: [
              {
                $unwind: {
                  path: '$selectedOptionsSlugs',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: null,
                  rubricId: { $first: '$rubricId' },
                  selectedOptionsSlugs: {
                    $addToSet: '$selectedOptionsSlugs',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_CATEGORIES,
                  as: 'categories',
                  let: {
                    rubricId: '$rubricId',
                    selectedOptionsSlugs: '$selectedOptionsSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $and: [
                          {
                            $expr: {
                              $eq: ['$rubricId', '$$rubricId'],
                            },
                          },
                          {
                            $expr: {
                              $in: ['$slug', '$$selectedOptionsSlugs'],
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
                $unwind: {
                  path: '$categories',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $match: {
                  categories: {
                    $exists: true,
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$categories',
                },
              },
            ],

            // brands facet
            brands: [
              {
                $group: {
                  _id: '$brandSlug',
                  collectionSlugs: {
                    $addToSet: '$brandCollectionSlug',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_BRANDS,
                  as: 'brand',
                  let: {
                    itemId: '$_id',
                    collectionSlugs: '$collectionSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$itemId', '$$itemId'],
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
                                    $in: ['$itemId', '$$collectionSlugs'],
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
                  ],
                },
              },
              {
                $addFields: {
                  brand: {
                    $arrayElemAt: ['$brand', 0],
                  },
                },
              },
              {
                $match: {
                  brand: {
                    $exists: true,
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$brand',
                },
              },
              {
                $sort: {
                  _id: SORT_DESC,
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

    const { totalDocs, totalPages, attributes, prices, brands, categories } =
      productDataAggregation;

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute(currency);

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
      rubricGender: search ? GENDER_HE : rubric.gender,
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

      // product attributes
      const productAttributes = (product.attributes || []).reduce(
        (acc: ProductAttributeInterface[], attribute) => {
          const existingAttribute = (attributes || []).find(({ _id }) => {
            return _id.equals(attribute.attributeId);
          });
          if (!existingAttribute) {
            return acc;
          }

          const optionSlugs = product.selectedOptionsSlugs.reduce((acc: string[], selectedSlug) => {
            const slugParts = selectedSlug.split(FILTER_SEPARATOR);
            const attributeSlug = slugParts[0];
            const optionSlug = slugParts[1];
            if (!optionSlug || attributeSlug !== existingAttribute.slug) {
              return acc;
            }
            return [...acc, optionSlug];
          }, []);

          const options = (existingAttribute.options || []).filter(({ slug }) => {
            return optionSlugs.includes(slug);
          });

          const productAttribute: ProductAttributeInterface = {
            ...attribute,
            attribute: {
              ...existingAttribute,
              name: getFieldStringLocale(existingAttribute.nameI18n, locale),
              metric: existingAttribute.metric
                ? {
                    ...existingAttribute.metric,
                    name: getFieldStringLocale(existingAttribute.metric.nameI18n, locale),
                  }
                : null,
              options: getTreeFromList({
                list: options,
                childrenFieldName: 'options',
                locale,
              }),
            },
          };
          return [...acc, productAttribute];
        },
        [],
      );

      // product categories
      const initialProductCategories = (categories || []).filter(({ slug }) => {
        return product.selectedOptionsSlugs.includes(slug);
      });
      const productCategories = getTreeFromList({
        list: initialProductCategories,
        childrenFieldName: 'categories',
        locale,
      });

      // product brand
      const productBrand = product.brandSlug
        ? (brands || []).find(({ itemId }) => {
            return itemId === product.brandSlug;
          })
        : null;

      // title
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: productBrand
          ? {
              ...productBrand,
              collections: (productBrand.collections || []).filter((collection) => {
                return collection.itemId === product.brandCollectionSlug;
              }),
            }
          : null,
        rubricName: getFieldStringLocale(rubric.nameI18n, locale),
        showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
        showCategoryInProductTitle: rubric.showCategoryInProductTitle,
        attributes: productAttributes,
        categories: productCategories,
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
      companySlug,
      basePath,
      page,
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
  currency: string;
  query: ParsedUrlQuery;
  page?: number;
  excludedProductsIds?: ObjectIdModel[] | null;
  companySlug: string;
}

export const getConsoleShopProducts = async ({
  locale,
  basePath,
  query,
  currency,
  excludedProductsIds,
  companySlug,
  ...props
}: GetConsoleShopProductsInputInterface): Promise<CompanyShopProductsPageInterface | null> => {
  try {
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
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
          $lookup: {
            from: COL_CITIES,
            as: 'city',
            foreignField: 'slug',
            localField: 'citySlug',
          },
        },
        {
          $addFields: {
            company: {
              $arrayElemAt: ['$company', 0],
            },
            city: {
              $arrayElemAt: ['$city', 0],
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
      rubricId,
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      docs: [],
      attributes: [],
      selectedAttributes: [],
      clearSlug: '',
      rubricName: '',
      currency: DEFAULT_CURRENCY,
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
      page,
    } = castCatalogueFilters({
      filters,
      initialPage: props.page,
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
              {
                $lookup: {
                  from: COL_PRODUCTS,
                  as: 'product',
                  let: {
                    productId: '$productId',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$productId', '$_id'],
                        },
                      },
                    },

                    // get product seo info
                    ...productSeoPipeline(companySlug),
                  ],
                },
              },
              {
                $addFields: {
                  product: { $arrayElemAt: ['$product', 0] },
                },
              },

              // get supplier products
              ...shopProductSupplierProductsPipeline,
            ],

            // prices facet
            prices: [
              {
                $group: {
                  _id: '$minPrice',
                },
              },
            ],

            // categories facet
            categories: [
              {
                $unwind: {
                  path: '$selectedOptionsSlugs',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: null,
                  rubricId: { $first: '$rubricId' },
                  selectedOptionsSlugs: {
                    $addToSet: '$selectedOptionsSlugs',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_CATEGORIES,
                  as: 'categories',
                  let: {
                    rubricId: '$rubricId',
                    selectedOptionsSlugs: '$selectedOptionsSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $and: [
                          {
                            $expr: {
                              $eq: ['$rubricId', '$$rubricId'],
                            },
                          },
                          {
                            $expr: {
                              $in: ['$slug', '$$selectedOptionsSlugs'],
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
                $unwind: {
                  path: '$categories',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $match: {
                  categories: {
                    $exists: true,
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$categories',
                },
              },
            ],

            // brands facet
            brands: [
              {
                $group: {
                  _id: '$brandSlug',
                  collectionSlugs: {
                    $addToSet: '$brandCollectionSlug',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_BRANDS,
                  as: 'brand',
                  let: {
                    itemId: '$_id',
                    collectionSlugs: '$collectionSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$itemId', '$$itemId'],
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
                                    $in: ['$itemId', '$$collectionSlugs'],
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
                  ],
                },
              },
              {
                $addFields: {
                  brand: {
                    $arrayElemAt: ['$brand', 0],
                  },
                },
              },
              {
                $match: {
                  brand: {
                    $exists: true,
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: '$brand',
                },
              },
              {
                $sort: {
                  _id: SORT_DESC,
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

    const { totalDocs, totalPages, attributes, rubric, prices, brands, categories } =
      shopProductsAggregation;

    if (!rubric) {
      return fallbackPayload;
    }

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute(currency);

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
      rubricGender: search ? GENDER_HE : rubric.gender,
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
      const productAttributes = (product.attributes || []).reduce(
        (acc: ProductAttributeInterface[], productAttribute) => {
          const existingAttribute = (attributes || []).find(({ _id }) => {
            return _id.equals(productAttribute.attributeId);
          });
          if (!existingAttribute) {
            return acc;
          }

          const optionSlugs = product.selectedOptionsSlugs.reduce((acc: string[], selectedSlug) => {
            const slugParts = selectedSlug.split(FILTER_SEPARATOR);
            const attributeSlug = slugParts[0];
            const optionSlug = slugParts[1];
            if (!optionSlug || attributeSlug !== existingAttribute.slug) {
              return acc;
            }
            return [...acc, optionSlug];
          }, []);

          const options = (existingAttribute.options || []).filter(({ slug }) => {
            return optionSlugs.includes(slug);
          });

          const resultProductAttribute: ProductAttributeInterface = {
            ...productAttribute,
            attribute: {
              ...existingAttribute,
              name: getFieldStringLocale(existingAttribute.nameI18n, locale),
              metric: existingAttribute.metric
                ? {
                    ...existingAttribute.metric,
                    name: getFieldStringLocale(existingAttribute.metric.nameI18n, locale),
                  }
                : null,
              options: getTreeFromList({
                list: options,
                childrenFieldName: 'options',
                locale,
              }),
            },
          };
          return [...acc, resultProductAttribute];
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
        ? (brands || []).find(({ itemId }) => {
            return itemId === shopProduct.brandSlug;
          })
        : null;

      // snippet title
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: productBrand
          ? {
              ...productBrand,
              collections: (productBrand.collections || []).filter(({ itemId }) => {
                return itemId === shopProduct.brandCollectionSlug;
              }),
            }
          : null,
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
        supplierProducts: castSupplierProductsList({
          supplierProducts: shopProduct.supplierProducts,
          locale,
        }),
        product: {
          ...product,
          shopsCount: shopProduct.shopsCount,
          name: getFieldStringLocale(product.nameI18n, locale),
          snippetTitle,
        },
      });
    });

    const payload: CompanyShopProductsPageInterface = {
      shop,
      currency: shop.city?.currency || DEFAULT_CURRENCY,
      rubricName: getFieldStringLocale(rubric.nameI18n, locale),
      rubricId: rubric._id.toHexString(),
      rubricSlug: rubric.slug,
      clearSlug: basePath,
      basePath,
      page,
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

interface GetAddShopProductSsrDataInterface extends GetConsoleRubricProductsInputInterface {}

export async function getAddShopProductSsrData({
  locale,
  basePath,
  query,
  currency,
  companySlug,
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

  const { selectedAttributes, page, docs, clearSlug, attributes, totalPages, totalDocs, rubric } =
    await getConsoleRubricProducts({
      excludedProductsIds,
      query,
      locale,
      basePath,
      currency,
      companySlug,
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
    companySlug,
  };

  return payload;
}
