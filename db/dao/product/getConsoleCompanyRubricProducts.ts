import { ObjectId } from 'mongodb';
import { ParsedUrlQuery } from 'querystring';
import { GENDER_HE, PAGINATION_DEFAULT_LIMIT, SORT_DESC } from '../../../config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getCommonFilterAttribute,
  getPriceAttribute,
} from '../../../config/constantAttributes';
import { alwaysArray, alwaysString } from '../../../lib/arrayUtils';
import { castUrlFilters, getCatalogueAttributes } from '../../../lib/catalogueUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import { noNaN } from '../../../lib/numbers';
import {
  countProductAttributes,
  getCategoryAllAttributes,
  getRubricAllAttributes,
} from '../../../lib/productAttributesUtils';
import { getTreeFromList } from '../../../lib/treeUtils';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_FACETS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../collectionNames';
import { ObjectIdModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import {
  AttributeInterface,
  ConsoleRubricProductsInterface,
  ProductFacetInterface,
  ProductsAggregationInterface,
  RubricInterface,
  ShopProductInterface,
} from '../../uiInterfaces';
import { filterAttributesPipeline } from '../constantPipelines';
import { castProductForUI } from './castProductForUI';

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
    const filters = alwaysArray(query.filters);
    const search = alwaysString(query.search);
    const rubricId = alwaysString(query.rubricId);

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
      searchStage,
      noSearchResults,
    } = await castUrlFilters({
      filters,
      initialPage: props.page,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      searchFieldName: 'productId',
      search: query.search,
      excludedSearchIds: excludedProductsIds,
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
    if (noSearchResults) {
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
      ...rubricStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      companyId: new ObjectId(companyId),
      ...photoStage,
      ...searchStage,
      ...excludedIdsStage,
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
                  from: COL_PRODUCT_FACETS,
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

                    // get product attributes
                    {
                      $lookup: {
                        from: COL_PRODUCT_ATTRIBUTES,
                        as: 'attributes',
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
          showBrandAsAlphabet: Boolean(rubric?.showBrandAsAlphabet),
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
    const docs: ProductFacetInterface[] = [];
    for await (const product of productDataAggregation.docs) {
      const cardPrices = {
        _id: new ObjectId(),
        min: `${noNaN(product.cardPrices?.min)}`,
        max: `${noNaN(product.cardPrices?.max)}`,
      };

      const productCategoryAttributes = await getCategoryAllAttributes(
        product.selectedOptionsSlugs,
      );

      const initialCastedProduct = castProductForUI({
        product,
        attributes,
        brands,
        categories,
        rubric,
        locale,
        getSnippetTitle: true,
      });

      const castedProduct: ProductFacetInterface = {
        ...initialCastedProduct,
        cardPrices,
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
