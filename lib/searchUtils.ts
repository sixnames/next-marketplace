import { CatalogueInterface } from 'components/Catalogue';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  FILTER_SEPARATOR,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_COMPANY_SLUG,
  ROUTE_SEARCH_RESULT,
  GENDER_IT,
} from 'config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getPriceAttribute,
} from 'config/constantAttributes';
import { DEFAULT_LAYOUT } from 'config/constantSelects';
import {
  COL_ATTRIBUTES,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { filterAttributesPipeline } from 'db/dao/constantPipelines';
import { ObjectIdModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AttributeInterface,
  CatalogueDataInterface,
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
  CatalogueProductsAggregationInterface,
  ProductAttributeInterface,
  ProductConnectionInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import { alwaysArray } from 'lib/arrayUtils';
import {
  castCatalogueFilters,
  castRubricsToCatalogueAttribute,
  getCatalogueAttributes,
} from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionsUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { generateSnippetTitle } from 'lib/titleUtils';
import { castProductConnectionForUI } from 'lib/uiDataUtils';
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
  snippetVisibleAttributesCount: number;
  visibleOptionsCount: number;
  input: {
    filters: string[];
    page: number;
  };
}

export const getSearchData = async ({
  locale,
  city,
  input,
  companyId,
  snippetVisibleAttributesCount,
  visibleOptionsCount,
  ...props
}: GetCatalogueDataInterface): Promise<CatalogueDataInterface | null> => {
  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    // Args
    const [search, ...restFilters] = input.filters;
    const companySlug = props.companySlug || DEFAULT_COMPANY_SLUG;

    // Get algolia search result
    const searchIds = await getAlgoliaProductsSearch({
      indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
      search,
    });

    const basePath = `${ROUTE_SEARCH_RESULT}/${search}`;

    // fallback
    const fallbackPayload = {
      _id: new ObjectId(),
      catalogueFilterLayout: DEFAULT_LAYOUT,
      clearSlug: basePath,
      filters: restFilters,
      rubricName: 'Ничего не найдено',
      rubricSlug: search,
      products: [],
      catalogueTitle: 'Товары не найдены',
      totalProducts: 0,
      attributes: [],
      selectedAttributes: [],
      breadcrumbs: [],
      page: 1,
    };

    if (searchIds.length < 1) {
      return fallbackPayload;
    }

    // Cast selected options
    const {
      sortFilterOptions,
      skip,
      limit,
      rubricSlug,
      pricesStage,
      optionsStage,
      sortStage,
      defaultSortStage,
    } = castCatalogueFilters({
      filters: restFilters,
      initialPage: input.page,
      initialLimit: CATALOGUE_PRODUCTS_LIMIT,
    });

    const rubricsStage = rubricSlug
      ? {
          rubricSlug: {
            $in: rubricSlug,
          },
        }
      : {};

    const companyRubricsMatch = companyId ? { companyId: new ObjectId(companyId) } : {};
    const productsInitialMatch = {
      _id: {
        $in: searchIds,
      },
      ...rubricsStage,
      ...companyRubricsMatch,
      citySlug: city,
      ...optionsStage,
      ...pricesStage,
    };

    // const shopProductsStart = new Date().getTime();
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<CatalogueProductsAggregationInterface>(
        [
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

          // group shop products by productId field
          {
            $group: {
              _id: '$productId',
              companyId: { $first: `$companyId` },
              itemId: { $first: '$itemId' },
              rubricId: { $first: '$rubricId' },
              rubricSlug: { $first: `$rubricSlug` },
              brandSlug: { $first: '$brandSlug' },
              brandCollectionSlug: { $first: '$brandCollectionSlug' },
              slug: { $first: '$slug' },
              gender: { $first: '$gender' },
              mainImage: { $first: `$mainImage` },
              originalName: { $first: `$originalName` },
              nameI18n: { $first: `$nameI18n` },
              titleCategoriesSlugs: { $first: `$titleCategoriesSlugs` },
              views: { $max: `$views.${companySlug}.${city}` },
              priorities: { $max: `$priorities.${companySlug}.${city}` },
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

          // catalogue data facets
          {
            $facet: {
              // docs facet
              docs: [
                {
                  $sort: sortStage,
                },
                {
                  $skip: skip,
                },
                {
                  $limit: limit,
                },

                // add ui prices
                {
                  $addFields: {
                    shopsCount: { $size: '$shopsIds' },
                    cardPrices: {
                      min: '$minPrice',
                      max: '$maxPrice',
                    },
                  },
                },

                // get product connections
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
                              $addFields: {
                                option: {
                                  $arrayElemAt: ['$option', 0],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
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
                        $addFields: {
                          views: { $max: `$views.${companySlug}.${city}` },
                          priorities: { $max: `$priorities.${companySlug}.${city}` },
                        },
                      },
                      {
                        $sort: defaultSortStage,
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
                              $addFields: {
                                views: { $max: `$views.${companySlug}.${city}` },
                                priorities: { $max: `$priorities.${companySlug}.${city}` },
                              },
                            },
                            {
                              $sort: defaultSortStage,
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
                  $addFields: {
                    views: { $max: `$views.${companySlug}.${city}` },
                    priorities: { $max: `$priorities.${companySlug}.${city}` },
                  },
                },
                {
                  $sort: defaultSortStage,
                },
              ],

              // countAllDocs facet
              countAllDocs: [
                {
                  $count: 'totalDocs',
                },
              ],

              // rubric facet
              rubrics: [
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
                      attributesSlugs: '$attributesSlugs',
                      attributeConfigs: '$attributeConfigs',
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ['$_id', '$$rubricId'],
                          },
                        },
                      },
                      {
                        $project: {
                          views: false,
                          priorities: false,
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
                {
                  $replaceRoot: {
                    newRoot: {
                      $arrayElemAt: ['$rubric', 0],
                    },
                  },
                },
              ],

              // attributes facet
              attributes: filterAttributesPipeline(defaultSortStage),
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
              totalProducts: '$totalDocsObject.totalDocs',
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
    const productDataAggregation = shopProductsAggregation[0];
    // console.log(shopProductsAggregationResult);
    // console.log(shopProductsAggregationResult.docs[0]);
    // console.log(JSON.stringify(shopProductsAggregationResult.rubric, null, 2));
    // console.log(`Shop products >>>>>>>>>>>>>>>> `, new Date().getTime() - shopProductsStart);

    if (!productDataAggregation) {
      return null;
    }

    // Get catalogue rubric
    const rubrics: RubricInterface[] = productDataAggregation.rubrics || [];
    if (rubrics.length < 1) {
      return fallbackPayload;
    }

    const { docs, attributes, brands, categories, prices } = productDataAggregation;

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute();

    // category attribute
    const categoryAttribute: AttributeInterface[] = [
      getCategoryFilterAttribute({
        locale,
        categories,
      }),
    ];

    // brand attribute
    const brandAttribute: AttributeInterface[] = [
      getBrandFilterAttribute({
        locale,
        brands: brands,
      }),
    ];

    // rubric attributes
    const initialAttributes = (attributes || []).map((attribute) => {
      return {
        ...attribute,
        options: getTreeFromList({
          list: attribute.options,
          childrenFieldName: 'options',
        }),
      };
    });

    // cast catalogue attributes
    const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [...categoryAttribute, priceAttribute, ...brandAttribute],
      locale,
      filters: input.filters,
      productsPrices: prices,
      basePath,
      visibleOptionsCount,
      rubricGender: GENDER_IT,
      brands,
      // visibleAttributesCount,
    });

    // get attribute filters
    for await (const rubric of rubrics) {
      const rubricAttributes = initialAttributes.filter(({ _id }) => {
        return rubric.filterVisibleAttributeIds.some((attributeId) => {
          return attributeId.equals(_id);
        });
      });
      const rubricCastedAttributes = await getCatalogueAttributes({
        attributes: rubricAttributes || [],
        locale,
        filters: restFilters,
        productsPrices: productDataAggregation.prices,
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

    // cast catalogue products
    const products: ProductInterface[] = [];
    docs.forEach((product) => {
      const rubric = rubrics.find(({ _id }) => {
        return _id.equals(product.rubricId);
      });
      if (!rubric) {
        return;
      }

      // product prices
      const minPrice = noNaN(product.cardPrices?.min);
      const maxPrice = noNaN(product.cardPrices?.max);
      const cardPrices = {
        _id: new ObjectId(),
        min: `${minPrice}`,
        max: `${maxPrice}`,
      };

      // product attributes
      const optionSlugs = product.selectedOptionsSlugs.reduce((acc: string[], selectedSlug) => {
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
        return product.selectedOptionsSlugs.includes(slug);
      });
      const productCategories = getTreeFromList({
        list: initialProductCategories,
        childrenFieldName: 'categories',
        locale,
      });

      // product brand
      const productBrand = product.brandSlug
        ? (brands || []).find(({ slug }) => {
            return slug === product.brandSlug;
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

      // list features
      const initialListFeatures = getProductCurrentViewCastedAttributes({
        attributes: productAttributes,
        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
        locale,
      });
      const listFeatures = initialListFeatures
        .filter(({ showInSnippet }) => {
          return showInSnippet;
        })
        .slice(0, snippetVisibleAttributesCount);

      // rating features
      const initialRatingFeatures = getProductCurrentViewCastedAttributes({
        attributes: productAttributes,
        viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
        locale,
      });
      const ratingFeatures = initialRatingFeatures.filter(({ showInSnippet }) => {
        return showInSnippet;
      });

      // connections
      const connections = (product.connections || []).reduce(
        (acc: ProductConnectionInterface[], connection) => {
          const castedConnection = castProductConnectionForUI({
            connection,
            locale,
          });

          if (!castedConnection) {
            return acc;
          }

          return [...acc, castedConnection];
        },
        [],
      );

      products.push({
        ...product,
        listFeatures,
        ratingFeatures,
        name: getFieldStringLocale(product.nameI18n, locale),
        cardPrices,
        connections,
        snippetTitle,
      });
    });

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';
    // console.log('Total time: ', new Date().getTime() - timeStart);

    const catalogueTitle = `Результаты поска по запросу "${search}"`;

    return {
      _id: new ObjectId(),
      catalogueFilterLayout: DEFAULT_LAYOUT,
      clearSlug: `${ROUTE_SEARCH_RESULT}/${search}${sortPathname}`,
      filters: restFilters,
      rubricName: catalogueTitle,
      rubricSlug: search,
      products,
      catalogueTitle: catalogueTitle,
      totalProducts: noNaN(productDataAggregation.totalProducts),
      attributes: finalCastedAttributes,
      selectedAttributes: finalSelectedAttributes,
      breadcrumbs: [],
      page: input.page,
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
    snippetVisibleAttributesCount: props.initialData.configs.snippetAttributesCount,
    visibleOptionsCount: props.initialData.configs.catalogueFilterVisibleOptionsCount,
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
