import { ObjectId } from 'mongodb';
import {
  DEFAULT_PAGE,
  GENDER_HE,
  PAGINATION_DEFAULT_LIMIT,
  SORT_DESC,
} from '../../../config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getCommonFilterAttribute,
  getPriceAttribute,
} from '../../../config/constantAttributes';
import { castUrlFilters, getCatalogueAttributes } from '../../../lib/catalogueUtils';
import { noNaN } from '../../../lib/numbers';
import { castSupplierProductsList } from '../../../lib/productUtils';
import { getTreeFromList } from '../../../lib/treeUtils';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_PROMO_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../collectionNames';
import { ObjectIdModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import {
  AttributeInterface,
  GetConsoleRubricPromoProductsPayloadInterface,
  RubricInterface,
  ShopProductInterface,
  ShopProductsAggregationInterface,
} from '../../uiInterfaces';
import { filterAttributesPipeline, summaryPipeline } from '../constantPipelines';
import { castSummaryForUI } from '../product/castSummaryForUI';

interface GetConsolePromoProductsInterface {
  companyId: ObjectIdModel;
  promoId: ObjectIdModel;
  basePath: string;
  locale: string;
  currency: string;
  rubricSlug: string;
  filters: string[];
  search?: string | null;
  excludedShopProductIds: string[];
}

export async function getConsolePromoProducts({
  basePath,
  filters,
  rubricSlug,
  search,
  excludedShopProductIds,
  companyId,
  currency,
  locale,
  promoId,
}: GetConsolePromoProductsInterface): Promise<GetConsoleRubricPromoProductsPayloadInterface> {
  let fallbackPayload: GetConsoleRubricPromoProductsPayloadInterface = {
    clearSlug: basePath,
    basePath,
    page: DEFAULT_PAGE,
    totalDocs: 0,
    totalPages: 0,
    docs: [],
    attributes: [],
    selectedAttributes: [],
    selectedShopProductIds: [],
  };

  try {
    const { db } = await getDatabase();
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);

    // get rubric
    const rubric = await rubricsCollection.findOne({
      slug: rubricSlug,
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
      categoryStage,
      noSearchResults,
    } = await castUrlFilters({
      filters,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      search,
      searchFieldName: 'productId',
    });

    // rubric stage
    let rubricStage: Record<any, any> = {
      rubricSlug,
    };
    if (rubricFilters && rubricFilters.length > 0) {
      rubricStage = {
        rubricSlug: {
          $in: rubricFilters,
        },
      };
    }

    // excluded ids stage
    const excludedIdsStage =
      excludedShopProductIds.length > 0
        ? {
            _id: {
              $nin: excludedShopProductIds,
            },
          }
        : {};

    // search stage
    if (noSearchResults) {
      return fallbackPayload;
    }

    // initial match
    const productsInitialMatch = {
      ...rubricStage,
      ...categoryStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      companyId: new ObjectId(companyId),
      ...photoStage,
      ...searchStage,
      ...excludedIdsStage,
    };

    const shopProductsAggregationResult = await shopProductsCollection
      .aggregate<ShopProductsAggregationInterface>([
        // match products
        {
          $match: productsInitialMatch,
        },
        // get promo products
        {
          $lookup: {
            from: COL_PROMO_PRODUCTS,
            as: 'promoProducts',
            let: {
              shopProductId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  promoId: new ObjectId(promoId),
                  $expr: {
                    $eq: ['$$shopProductId', '$shopProductId'],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            promoProductsCount: {
              $size: '$promoProducts',
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
              ...summaryPipeline('$productId'),

              // get supplier products
              // ...shopProductSupplierProductsPipeline,
            ],

            // prices facet
            allShopProducts: [
              {
                $project: {
                  _id: true,
                  promoProductsCount: true,
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

    const { totalDocs, totalPages, attributes, prices, brands, categories, allShopProducts } =
      shopProductsAggregation;

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

    // cast shop products
    const docs: ShopProductInterface[] = [];
    shopProductsAggregation.docs.forEach((shopProduct) => {
      const summary = shopProduct.summary;
      if (!summary) {
        return;
      }

      const castedProduct = castSummaryForUI({
        summary,
        attributes,
        brands,
        categories,
        locale,
      });

      docs.push({
        ...shopProduct,
        supplierProducts: castSupplierProductsList({
          supplierProducts: shopProduct.supplierProducts,
          locale,
        }),
        summary: {
          ...castedProduct,
          shopsCount: shopProduct.shopsCount,
        },
      });
    });

    const selectedShopProductIds = (allShopProducts || []).reduce(
      (acc: string[], { _id, promoProductsCount }) => {
        if (noNaN(promoProductsCount) > 0) {
          return [...acc, _id.toHexString()];
        }
        return acc;
      },
      [],
    );

    const payload: GetConsoleRubricPromoProductsPayloadInterface = {
      clearSlug: basePath,
      basePath,
      page,
      selectedShopProductIds,
      totalDocs,
      totalPages,
      attributes: castedAttributes,
      selectedAttributes,
      docs,
    };

    return payload;
  } catch (e) {
    console.log('getConsolePromoProducts error ', e);
    return fallbackPayload;
  }
}
