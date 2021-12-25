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
import { getProductAllSeoContents } from '../../../lib/seoContentUtils';
import { getTreeFromList } from '../../../lib/treeUtils';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
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
  ProductSummaryInterface,
  RubricInterface,
  ShopProductInterface,
  ShopProductPricesInterface,
} from '../../uiInterfaces';
import { filterAttributesPipeline, summaryPipeline } from '../constantPipelines';
import { castSummaryForUI } from './castSummaryForUI';

export interface GetConsoleRubricProductsInputInterface {
  locale: string;
  basePath: string;
  currency: string;
  query: ParsedUrlQuery;
  page?: number;
  excludedProductsIds?: ObjectIdModel[] | null;
  attributesIds?: ObjectIdModel[] | null;
  excludedOptionsSlugs?: string[] | null;
  companySlug: string;
  byRubricSlug?: boolean;
}

export const getConsoleRubricProducts = async ({
  locale,
  basePath,
  query,
  currency,
  companySlug,
  excludedProductsIds,
  attributesIds,
  excludedOptionsSlugs,
  byRubricSlug,
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
    const productFacetsCollection = db.collection<ProductFacetInterface>(COL_PRODUCT_FACETS);
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const filters = alwaysArray(query.filters);
    const search = alwaysString(query.search);
    const rubricId = alwaysString(query.rubricId);
    const rubricSlug = alwaysString(query.rubricSlug);

    // get rubric
    const rubricQuery = byRubricSlug
      ? {
          slug: rubricSlug,
        }
      : {
          _id: new ObjectId(rubricId),
        };
    const rubric = await rubricsCollection.findOne(rubricQuery);
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
      categoryStage,
      pricesStage,
      photoStage,
      searchIds,
      noSearchResults,
    } = await castUrlFilters({
      filters,
      search,
      initialPage: props.page,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      searchFieldName: '_id',
      excludedSearchIds: (excludedProductsIds || []).map((_id) => new ObjectId(_id)),
    });

    // rubric stage
    let rubricStage: Record<any, any> = {
      rubricId: rubric._id,
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

    // attribute ids stage
    const attributesObjectIds = (attributesIds || []).map((_id) => new ObjectId(_id));
    const attributeIdsStage =
      attributesObjectIds.length > 0
        ? [
            {
              $unwind: {
                path: '$selectedAttributesIds',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                selectedAttributesIds: { $in: attributesObjectIds },
              },
            },
            {
              $group: {
                _id: '$_id',
                doc: { $first: '$$ROOT' },
                selectedAttributesIds: {
                  $push: '$selectedAttributesIds',
                },
              },
            },
            {
              $addFields: {
                'doc.selectedAttributesIds': '$selectedAttributesIds',
              },
            },
            {
              $replaceRoot: {
                newRoot: '$doc',
              },
            },
          ]
        : [];

    // excluded options stage
    const excludedOptionsStage = excludedOptionsSlugs
      ? [
          {
            $unwind: {
              path: '$filterSlugs',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              filterSlugs: { $nin: excludedOptionsSlugs },
            },
          },
          {
            $group: {
              _id: '$_id',
              doc: { $first: '$$ROOT' },
              filterSlugs: {
                $push: '$filterSlugs',
              },
            },
          },
          {
            $addFields: {
              'doc.filterSlugs': '$filterSlugs',
            },
          },
          {
            $replaceRoot: {
              newRoot: '$doc',
            },
          },
        ]
      : [];

    // initial match
    const productsInitialMatch = {
      ...excludedIdsStage,
      ...rubricStage,
      ...categoryStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      ...photoStage,
    };

    const searchStage =
      searchIds.length > 0
        ? [
            {
              $match: {
                _id: {
                  $in: searchIds,
                },
              },
            },
          ]
        : [];

    const productDataAggregationResult = await productFacetsCollection
      .aggregate<ProductsAggregationInterface>([
        // match products
        ...searchStage,
        {
          $match: productsInitialMatch,
        },
        ...attributeIdsStage,
        ...excludedOptionsStage,
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

              // get summary
              ...summaryPipeline('$_id'),
              {
                $replaceRoot: {
                  newRoot: '$summary',
                },
              },

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
                  path: '$filterSlugs',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: null,
                  rubricId: { $first: '$rubricId' },
                  filterSlugs: {
                    $addToSet: '$filterSlugs',
                  },
                },
              },
              {
                $lookup: {
                  from: COL_CATEGORIES,
                  as: 'categories',
                  let: {
                    rubricId: '$rubricId',
                    filterSlugs: '$filterSlugs',
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
                              $in: ['$slug', '$$filterSlugs'],
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
    const docs: ProductSummaryInterface[] = [];
    for await (const product of productDataAggregation.docs) {
      const productCategoryAttributes = await getCategoryAllAttributes(product.categorySlugs);

      // seo content
      const cardContentCities = await getProductAllSeoContents({
        companySlug,
        productId: product._id,
        productSlug: product.slug,
        rubricSlug: product.rubricSlug,
        locale,
      });

      const initialCastedProduct = castSummaryForUI({
        summary: product,
        attributes,
        brands,
        categories,
        locale,
      });

      const otherShopProducts = await shopProductsCollection
        .aggregate<ShopProductPricesInterface>([
          {
            $match: {
              productId: product._id,
            },
          },
          {
            $group: {
              _id: '$productId',
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
            },
          },
        ])
        .toArray();
      const shopProductPrices = otherShopProducts[0];

      const castedProduct: ProductSummaryInterface = {
        ...initialCastedProduct,
        minPrice: noNaN(shopProductPrices?.minPrice),
        maxPrice: noNaN(shopProductPrices?.maxPrice),
        cardContentCities,
        name: getFieldStringLocale(product.nameI18n, locale),
        attributesCount: countProductAttributes(initialCastedProduct.attributes),
        totalAttributesCount: allRubricAttributes.length + productCategoryAttributes.length,
        attributes: [],
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
