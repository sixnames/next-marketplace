import { GENDER_HE, PAGINATION_DEFAULT_LIMIT, SORT_DESC } from 'config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getPriceAttribute,
} from 'config/constantAttributes';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_PRODUCTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  brandPipeline,
  filterAttributesPipeline,
  productAttributesPipeline,
  productCategoriesPipeline,
} from 'db/dao/constantPipelines';
import { ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AttributeInterface,
  ConsoleRubricProductsInterface,
  ProductInterface,
  ProductsAggregationInterface,
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
import { ParsedUrlQuery } from 'querystring';

export interface GetConsoleRubricProductsInputInterface {
  locale: string;
  basePath: string;
  visibleOptionsCount: number;
  query: ParsedUrlQuery;
  page?: number;
}

export const getConsoleRubricProducts = async ({
  locale,
  visibleOptionsCount,
  basePath,
  page,
  query,
}: GetConsoleRubricProductsInputInterface): Promise<ConsoleRubricProductsInterface> => {
  const fallbackPayload: ConsoleRubricProductsInterface = {
    clearSlug: basePath,
    page: 1,
    totalDocs: 0,
    totalPages: 0,
    docs: [],
    attributes: [],
    selectedAttributes: [],
  };

  try {
    const { db } = await getDatabase();
    const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
    const [rubricId, ...filters] = alwaysArray(query.filters);
    const search = alwaysString(query.search);

    // cast selected filters
    const {
      skip,
      limit,
      rubricFilters,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
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
      ...searchStage,
      ...rubricStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
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
                    slug: '$_id',
                    collectionSlugs: '$collectionSlugs',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$slug', '$$slug'],
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
                                    $in: ['$slug', '$$collectionSlugs'],
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
                          {
                            $limit: visibleOptionsCount,
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

    const { totalDocs, totalPages, attributes, rubric, brands, categories, prices } =
      productDataAggregation;

    if (!rubric) {
      return fallbackPayload;
    }

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
          brands: brands,
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

    // cast attributes
    const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [...categoryAttribute, priceAttribute, ...brandAttribute, ...rubricAttributes],
      locale,
      filters,
      productsPrices: prices,
      basePath,
      visibleOptionsCount,
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
