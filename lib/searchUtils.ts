import { CatalogueInterface } from 'components/Catalogue';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  CATALOGUE_OPTION_SEPARATOR,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_COMPANY_SLUG,
  ROUTE_SEARCH_RESULT,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_DESC,
} from 'config/common';
import { getPriceAttribute } from 'config/constantAttributes';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { ObjectIdModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CatalogueDataInterface,
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
  CatalogueProductsAggregationInterface,
  ProductConnectionInterface,
  ProductConnectionItemInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { alwaysArray } from 'lib/arrayUtils';
import {
  castCatalogueFilters,
  castRubricsToCatalogueAttribute,
  getCatalogueAttributes,
  getCatalogueConfigs,
} from 'lib/catalogueUtils';
import { getCurrencyString, getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

function groupSearchFilterAttributes(
  initialAttributes: CatalogueFilterAttributeInterface[],
): CatalogueFilterAttributeInterface[] {
  return initialAttributes.reduce((acc: CatalogueFilterAttributeInterface[], attribute) => {
    const existingAttributeIndex = acc.findIndex((item) => {
      return item.slug === attribute.slug;
    });

    if (existingAttributeIndex > -1) {
      const existingAttribute = acc[existingAttributeIndex];
      if (!existingAttribute) {
        return [...acc, attribute];
      }

      acc[existingAttributeIndex] = {
        ...existingAttribute,
        options: [...existingAttribute.options, ...attribute.options].reduce(
          (optionAcc: CatalogueFilterAttributeOptionInterface[], option) => {
            const existingOption = optionAcc.find((item) => {
              return item.slug === option.slug;
            });
            if (existingOption) {
              return optionAcc;
            }
            return [...optionAcc, option];
          },
          [],
        ),
      };

      return acc;
    }

    return [...acc, attribute];
  }, []);
}

export interface GetCatalogueDataInterface {
  locale: string;
  city: string;
  companySlug?: string;
  companyId?: string | ObjectIdModel | null;
  input: {
    filters: string[];
    page: number;
  };
}

export const getSearchData = async ({
  locale,
  city,
  input,
  companySlug = DEFAULT_COMPANY_SLUG,
  companyId,
}: GetCatalogueDataInterface): Promise<CatalogueDataInterface | null> => {
  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    // Args
    const { filters, page } = input;
    const [search, ...restFilters] = filters;
    const realCompanySlug = companySlug || DEFAULT_COMPANY_SLUG;

    // Get configs
    // const configsTimeStart = new Date().getTime();
    const { snippetVisibleAttributesCount, visibleOptionsCount } = await getCatalogueConfigs({
      companySlug: realCompanySlug,
      city,
    });
    // console.log('Configs >>>>>>>>>>>>>>>> ', new Date().getTime() - configsTimeStart);

    // Get algolia search result
    const searchIds = await getAlgoliaProductsSearch({
      indexName: `${process.env.ALG_INDEX_SHOP_PRODUCTS}`,
      search,
    });

    if (searchIds.length < 1) {
      return {
        _id: new ObjectId(),
        clearSlug: `${ROUTE_SEARCH_RESULT}/${search}`,
        filters: restFilters,
        rubricName: 'Ничего не найдено',
        rubricSlug: search,
        products: [],
        catalogueTitle: 'Товары не найдены',
        totalProducts: 0,
        attributes: [],
        selectedAttributes: [],
        page: 1,
      };
    }

    // Cast selected options
    const {
      minPrice,
      maxPrice,
      realFilterOptions,
      sortBy,
      sortDir,
      sortFilterOptions,
      noFiltersSelected,
      skip,
      limit,
      page: payloadPage,
      rubricSlug,
    } = castCatalogueFilters({
      filters: restFilters,
      initialPage: page,
      initialLimit: CATALOGUE_PRODUCTS_LIMIT,
    });

    const rubricsStage = rubricSlug
      ? {
          rubricSlug: {
            $in: rubricSlug,
          },
        }
      : {};

    const pricesStage =
      minPrice && maxPrice
        ? {
            price: {
              $gte: minPrice,
              $lte: maxPrice,
            },
          }
        : {};

    const optionsStage = noFiltersSelected
      ? {}
      : {
          selectedOptionsSlugs: {
            $all: realFilterOptions,
          },
        };

    const companyRubricsMatch = companyId ? { companyId: new ObjectId(companyId) } : {};

    // sort stage
    let sortStage: any = {
      priorities: SORT_DESC,
      views: SORT_DESC,
      available: SORT_DESC,
      _id: SORT_DESC,
    };

    // sort by price
    if (sortBy === SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY) {
      sortStage = {
        minPrice: sortDir,
        priorities: SORT_DESC,
        views: SORT_DESC,
        available: SORT_DESC,
        _id: SORT_DESC,
      };
    }

    // const shopProductsStart = new Date().getTime();
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<CatalogueProductsAggregationInterface>(
        [
          {
            $match: {
              _id: {
                $in: searchIds,
              },
              ...rubricsStage,
              ...companyRubricsMatch,
              citySlug: city,
              ...optionsStage,
              ...pricesStage,
            },
          },
          {
            $unwind: {
              path: '$selectedOptionsSlugs',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: '$productId',
              itemId: { $first: '$itemId' },
              rubricId: { $first: '$rubricId' },
              rubricSlug: { $first: `$rubricSlug` },
              slug: { $first: '$slug' },
              mainImage: { $first: `$mainImage` },
              originalName: { $first: `$originalName` },
              nameI18n: { $first: `$nameI18n` },
              views: { $max: `$views.${realCompanySlug}.${city}` },
              priorities: { $max: `$priorities.${realCompanySlug}.${city}` },
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
              shopProductsIds: {
                $addToSet: '$_id',
              },
            },
          },
          {
            $facet: {
              docs: [
                {
                  $sort: {
                    ...sortStage,
                  },
                },
                {
                  $skip: skip,
                },
                {
                  $limit: limit,
                },
                {
                  $addFields: {
                    shopsCount: { $size: '$shopsIds' },
                    cardPrices: {
                      min: '$minPrice',
                      max: '$maxPrice',
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

                // Lookup product attributes
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
                          viewVariant: {
                            $in: [ATTRIBUTE_VIEW_VARIANT_LIST, ATTRIBUTE_VIEW_VARIANT_OUTER_RATING],
                          },
                        },
                      },
                      {
                        $lookup: {
                          from: COL_OPTIONS,
                          as: 'options',
                          let: {
                            optionsGroupId: '$optionsGroupId',
                            selectedOptionsIds: '$selectedOptionsIds',
                          },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    {
                                      $eq: ['$optionsGroupId', '$$optionsGroupId'],
                                    },
                                    {
                                      $in: ['$_id', '$$selectedOptionsIds'],
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
              prices: [
                {
                  $group: {
                    _id: '$minPrice',
                  },
                },
              ],
              countAllDocs: [
                {
                  $count: 'totalDocs',
                },
              ],

              // Get all rubrics
              rubrics: [
                // Get attributes ond options slugs
                {
                  $unwind: {
                    path: '$selectedOptionsSlugs',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $group: {
                    _id: '$rubricId',
                    selectedOptionsSlugs: {
                      $addToSet: '$selectedOptionsSlugs',
                    },
                  },
                },
                {
                  $unwind: {
                    path: '$selectedOptionsSlugs',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $addFields: {
                    slugArray: {
                      $split: ['$selectedOptionsSlugs', CATALOGUE_OPTION_SEPARATOR],
                    },
                  },
                },
                {
                  $addFields: {
                    attributeSlug: {
                      $arrayElemAt: ['$slugArray', 0],
                    },
                    optionSlug: {
                      $arrayElemAt: ['$slugArray', 1],
                    },
                  },
                },
                {
                  $group: {
                    _id: '$_id',
                    attributesSlugs: {
                      $addToSet: '$attributeSlug',
                    },
                    optionsSlugs: {
                      $addToSet: '$optionSlug',
                    },
                  },
                },

                // Lookup rubric
                {
                  $lookup: {
                    from: COL_RUBRICS,
                    as: 'rubric',
                    let: {
                      rubricId: '$_id',
                      attributesSlugs: '$attributesSlugs',
                      optionsSlugs: '$optionsSlugs',
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ['$_id', '$$rubricId'],
                          },
                        },
                      },

                      // Lookup rubric attributes
                      {
                        $lookup: {
                          from: COL_RUBRIC_ATTRIBUTES,
                          as: 'attributes',
                          pipeline: [
                            {
                              $match: {
                                showInCatalogueFilter: true,
                                $expr: {
                                  $and: [
                                    {
                                      $eq: ['$$rubricId', '$rubricId'],
                                    },
                                    {
                                      $in: ['$slug', '$$attributesSlugs'],
                                    },
                                  ],
                                },
                              },
                            },
                            {
                              $sort: sortStage,
                            },
                            {
                              $project: {
                                variant: false,
                                viewVariant: false,
                                rubricId: false,
                                showInCatalogueNav: false,
                                showInCatalogueFilter: false,
                                views: false,
                                priorities: false,
                              },
                            },

                            // Lookup rubric attribute options
                            {
                              $lookup: {
                                from: COL_OPTIONS,
                                as: 'options',
                                let: { optionsGroupId: '$optionsGroupId' },
                                pipeline: [
                                  {
                                    $match: {
                                      $expr: {
                                        $and: [
                                          {
                                            $eq: ['$$optionsGroupId', '$optionsGroupId'],
                                          },
                                          {
                                            $in: ['$slug', '$$optionsSlugs'],
                                          },
                                        ],
                                      },
                                      $or: [
                                        {
                                          parentId: {
                                            $exists: false,
                                          },
                                        },
                                        {
                                          parentId: null,
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    $sort: sortStage,
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
            },
          },
          {
            $addFields: {
              totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
              rubric: { $arrayElemAt: ['$rubric', 0] },
            },
          },
          {
            $addFields: {
              totalProducts: '$totalDocsObject.totalDocs',
            },
          },
          {
            $project: {
              docs: 1,
              totalProducts: 1,
              options: 1,
              prices: 1,
              rubrics: 1,
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
    const shopProductsAggregationResult = shopProductsAggregation[0];
    // console.log(shopProductsAggregationResult);
    // console.log(shopProductsAggregationResult.docs[0]);
    // console.log(JSON.stringify(shopProductsAggregationResult.rubric, null, 2));
    // console.log(`Shop products >>>>>>>>>>>>>>>> `, new Date().getTime() - shopProductsStart);

    if (!shopProductsAggregationResult) {
      return null;
    }

    // Get catalogue rubric
    const rubrics: RubricInterface[] = shopProductsAggregationResult.rubrics || [];
    if (rubrics.length < 1) {
      return {
        _id: new ObjectId(),
        clearSlug: `${ROUTE_SEARCH_RESULT}/${search}`,
        filters: restFilters,
        rubricName: 'Ничего не найдено',
        rubricSlug: search,
        products: [],
        catalogueTitle: 'Товары не найдены',
        totalProducts: 0,
        attributes: [],
        selectedAttributes: [],
        page: 1,
      };
    }

    // Get filter attributes
    // const beforeOptions = new Date().getTime();
    // get price filters
    const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [getPriceAttribute()],
      locale,
      filters: restFilters,
      productsPrices: shopProductsAggregationResult.prices,
      basePath: `${ROUTE_SEARCH_RESULT}/${search}`,
      visibleOptionsCount,
      // visibleAttributesCount,
    });

    // get attribute filters
    for await (const rubric of rubrics) {
      const rubricCastedAttributes = await getCatalogueAttributes({
        attributes: rubric.attributes || [],
        locale,
        filters: restFilters,
        productsPrices: shopProductsAggregationResult.prices,
        basePath: `${ROUTE_SEARCH_RESULT}/${search}`,
        visibleOptionsCount,
        // visibleAttributesCount,
      });

      // add to casted attributes
      rubricCastedAttributes.castedAttributes.forEach((castedAttribute) => {
        castedAttributes.push(castedAttribute);
      });

      // add to selected attributes
      rubricCastedAttributes.selectedAttributes.forEach((castedAttribute) => {
        selectedAttributes.push(castedAttribute);
      });
    }

    // cast rubrics to attribute
    const rubricsAsFilters = castRubricsToCatalogueAttribute({
      rubrics,
      locale,
      filters: restFilters,
      basePath: `${ROUTE_SEARCH_RESULT}/${search}`,
      visibleOptionsCount,
      // visibleAttributesCount,
    });
    castedAttributes.unshift(rubricsAsFilters);
    if (rubricsAsFilters.isSelected) {
      selectedAttributes.unshift(rubricsAsFilters);
    }

    const finalCastedAttributes = groupSearchFilterAttributes(castedAttributes);
    const finalSelectedAttributes = groupSearchFilterAttributes(selectedAttributes);

    // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

    // Get catalogue products
    const products = [];
    const rubricListViewAttributes = finalCastedAttributes.filter(({ viewVariant }) => {
      return viewVariant === ATTRIBUTE_VIEW_VARIANT_LIST;
    });
    for await (const product of shopProductsAggregationResult.docs) {
      // prices
      const { attributes, connections, ...restProduct } = product;
      const minPrice = noNaN(product.cardPrices?.min);
      const maxPrice = noNaN(product.cardPrices?.max);
      const cardPrices = {
        _id: new ObjectId(),
        min: getCurrencyString(minPrice),
        max: getCurrencyString(maxPrice),
      };

      // listFeatures
      const initialListFeatures = getProductCurrentViewCastedAttributes({
        attributes: attributes || [],
        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
        locale,
      });

      const initialListFeaturesWithIndex = initialListFeatures.map((listAttribute) => {
        const indexInRubric = rubricListViewAttributes.findIndex(
          ({ slug }) => slug === listAttribute.slug,
        );
        const finalIndexInRubric = indexInRubric < 0 ? 0 : indexInRubric;
        const index = rubricListViewAttributes.length - finalIndexInRubric;
        return {
          ...listAttribute,
          index,
        };
      });
      const sortedListAttributes = initialListFeaturesWithIndex.sort(
        (listAttributeA, listAttributeB) => {
          return noNaN(listAttributeB.index) - noNaN(listAttributeA.index);
        },
      );
      const listFeatures = sortedListAttributes.slice(0, snippetVisibleAttributesCount);

      // ratingFeatures
      const ratingFeatures = getProductCurrentViewCastedAttributes({
        attributes: attributes || [],
        viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
        locale,
      });

      const castedConnections = (connections || []).reduce(
        (acc: ProductConnectionInterface[], { attribute, ...connection }) => {
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
            return acc;
          }

          return [
            ...acc,
            {
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
            },
          ];
        },
        [],
      );

      products.push({
        ...restProduct,
        listFeatures,
        ratingFeatures,
        name: getFieldStringLocale(product.nameI18n, locale),
        cardPrices,
        connections: castedConnections,
      });
    }

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
    // console.log('Total time: ', new Date().getTime() - timeStart);

    const catalogueTitle = `Результаты поска по запросу "${search}"`;

    return {
      _id: new ObjectId(),
      clearSlug: `${ROUTE_SEARCH_RESULT}/${search}${sortPathname}`,
      filters: restFilters,
      rubricName: catalogueTitle,
      rubricSlug: search,
      products,
      catalogueTitle: catalogueTitle,
      totalProducts: noNaN(shopProductsAggregationResult.totalProducts),
      attributes: finalCastedAttributes,
      selectedAttributes: finalSelectedAttributes,
      page: payloadPage,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export async function getSearchServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
  // console.log(' ');
  // console.log('=================== Catalogue getServerSideProps =======================');
  // const timeStart = new Date().getTime();

  const { query } = context;
  const { props } = await getSiteInitialData({
    context,
  });
  const { filters } = query;

  const notFoundResponse = {
    props: {
      ...props,
      route: '',
    },
    notFound: true,
  };

  if (!filters || alwaysArray(filters).length < 1) {
    return notFoundResponse;
  }

  // catalogue
  const rawCatalogueData = await getSearchData({
    locale: props.sessionLocale,
    city: props.sessionCity,
    companySlug: props.company?.slug,
    companyId: props.company?._id,
    input: {
      filters: alwaysArray(filters),
      page: 1,
    },
  });

  if (!rawCatalogueData) {
    return notFoundResponse;
  }

  // console.log('Catalogue getServerSideProps total time ', new Date().getTime() - timeStart);

  return {
    props: {
      ...props,
      route: '',
      catalogueData: castDbData(rawCatalogueData),
    },
  };
}
