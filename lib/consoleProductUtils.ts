import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_CATEGORY_KEY,
  CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT,
  CATALOGUE_PRICE_KEY,
  CATALOGUE_PRODUCTS_LIMIT,
  DEFAULT_COMPANY_SLUG,
  FILTER_SEPARATOR,
  GENDER_HE,
  ROUTE_CATALOGUE,
} from 'config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getPriceAttribute,
  getRubricFilterAttribute,
} from 'config/constantAttributes';
import {
  DEFAULT_LAYOUT,
  GRID_SNIPPET_LAYOUT_BIG_IMAGE,
  ROW_SNIPPET_LAYOUT_BIG_IMAGE,
} from 'config/constantSelects';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import { filterAttributesPipeline, shopProductFieldsPipeline } from 'db/dao/constantPipelines';
import { CatalogueBreadcrumbModel, ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AttributeInterface,
  CatalogueDataInterface,
  CatalogueProductsAggregationInterface,
  ConsoleRubricProductsInterface,
  ProductAttributeInterface,
  ProductConnectionInterface,
  ProductInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algoliaUtils';
import {
  castCatalogueFilters,
  castOptionsForBreadcrumbs,
  getCatalogueAttributes,
} from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionsUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { generateSnippetTitle, generateTitle } from 'lib/titleUtils';
import { castProductConnectionForUI } from 'lib/uiDataUtils';
import { ObjectId } from 'mongodb';

export interface GetCatalogueDataInterface {
  locale: string;
  city: string;
  basePath: string;
  itemPath: string;
  companySlug?: string;
  companyId?: string | ObjectIdModel | null;
  visibleOptionsCount: number;
  currency: string;
  input: {
    search?: string;
    rubricId: string;
    filters: string[];
    page: number;
  };
}

export const getConsoleRubricProducts = async ({
  locale,
  city,
  input,
  companyId,
  visibleOptionsCount,
  currency,
  basePath,
  ...props
}: GetCatalogueDataInterface): Promise<ConsoleRubricProductsInterface | null> => {
  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const { db } = await getDatabase();
    const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);

    // args
    const { rubricSlug, search } = input;
    const companySlug = props.companySlug || DEFAULT_COMPANY_SLUG;
    const searchCatalogueTitle = `Результаты поска по запросу "${search}"`;

    // cast selected filters
    const {
      skip,
      limit,
      page,
      sortFilterOptions,
      rubricFilters,
      categoryFilters,
      inCategory,
      sortStage,
      defaultSortStage,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
    } = castCatalogueFilters({
      filters: input.filters,
      initialPage: input.page,
      initialLimit: CATALOGUE_PRODUCTS_LIMIT,
    });

    // fallback
    const fallbackPayload: CatalogueDataInterface = {
      _id: new ObjectId(),
      clearSlug: `${ROUTE_CATALOGUE}/${input.rubricSlug}`,
      filters: input.filters,
      rubricName: '',
      rubricSlug: '',
      products: [],
      catalogueTitle: 'Товары не найдены',
      catalogueFilterLayout: DEFAULT_LAYOUT,
      totalProducts: 0,
      attributes: [],
      selectedAttributes: [],
      breadcrumbs: [],
      gridSnippetLayout: GRID_SNIPPET_LAYOUT_BIG_IMAGE,
      rowSnippetLayout: ROW_SNIPPET_LAYOUT_BIG_IMAGE,
      showSnippetConnections: true,
      showSnippetBackground: true,
      showSnippetArticle: false,
      showSnippetButtonsOnHover: false,
      gridCatalogueColumns: CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT,
      page,
    };

    // rubric stage
    let rubricStage: Record<any, any> = rubricSlug
      ? {
          rubricSlug,
        }
      : {};
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
        productId: {
          $in: searchIds,
        },
      };
    }
    if (search && searchIds.length < 1) {
      return fallbackPayload;
    }

    // shop products initial match
    const companyMatch = companyId ? { companyId: new ObjectId(companyId) } : {};
    const productsInitialMatch = {
      ...searchStage,
      ...companyMatch,
      ...rubricStage,
      citySlug: city,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
    };

    // aggregate catalogue initial data
    const productDataAggregationResult = await productsCollection
      .aggregate<CatalogueProductsAggregationInterface>([
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

              // get shop product fields
              ...shopProductFieldsPipeline('$_id'),

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
          },
        },
        {
          $addFields: {
            countAllDocs: null,
            totalDocsObject: null,
            totalProducts: '$totalDocsObject.totalDocs',
          },
        },
      ])
      .toArray();
    const productDataAggregation = productDataAggregationResult[0];
    if (!productDataAggregation) {
      return fallbackPayload;
    }

    const { docs, totalProducts, attributes, rubrics, brands, categories, prices } =
      productDataAggregation;

    if (rubrics.length < 1) {
      return fallbackPayload;
    }

    const rubric = rubrics[0];
    if (!rubric) {
      return fallbackPayload;
    }

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute();

    // category attribute
    let categoryAttribute: AttributeInterface[] = [];
    const showCategoriesInFilter = search ? true : Boolean(rubric.variant?.showCategoriesInFilter);
    if (categories && categories.length > 0 && showCategoriesInFilter) {
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
    const initialAttributes = (attributes || []).map((attribute) => {
      return {
        ...attribute,
        options: getTreeFromList({
          list: attribute.options,
          childrenFieldName: 'options',
        }),
      };
    });
    const rubricAttributes = inCategory
      ? initialAttributes
      : initialAttributes.filter(({ _id }) => {
          return (rubric?.filterVisibleAttributeIds || []).some((attributeId) => {
            return attributeId.equals(_id);
          });
        });

    // rubrics as attribute
    const rubricsAsFilters = search
      ? [
          getRubricFilterAttribute({
            rubrics,
            locale,
          }),
        ]
      : [];

    // cast catalogue attributes
    const { selectedFilters, castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [
        ...rubricsAsFilters,
        ...categoryAttribute,
        priceAttribute,
        ...brandAttribute,
        ...rubricAttributes,
      ],
      locale,
      filters: input.filters,
      productsPrices: prices,
      basePath,
      visibleOptionsCount,
      rubricGender: search ? GENDER_HE : rubric.catalogueTitle.gender,
      brands,
      // visibleAttributesCount,
    });

    // cast catalogue products
    const products: ShopProductInterface[] = [];
    docs.forEach((shopProduct) => {
      const product = shopProduct.product;
      if (!product) {
        return;
      }

      // product prices
      const minPrice = noNaN(shopProduct.cardPrices?.min);
      const maxPrice = noNaN(shopProduct.cardPrices?.max);
      const cardPrices = {
        _id: new ObjectId(),
        min: `${minPrice}`,
        max: `${maxPrice}`,
      };

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
        ...shopProduct,
        product: {
          ...product,
          shopsCount: shopProduct.shopsCount,
          listFeatures,
          ratingFeatures,
          name: getFieldStringLocale(product.nameI18n, locale),
          cardPrices,
          connections,
          snippetTitle,
        },
      });
    });

    // get catalogue title
    const catalogueTitle = search
      ? searchCatalogueTitle
      : generateTitle({
          positionFieldName: 'positioningInTitle',
          attributeNameVisibilityFieldName: 'showNameInTitle',
          attributeVisibilityFieldName: 'showInCatalogueTitle',
          defaultGender: rubric.catalogueTitle.gender,
          fallbackTitle: getFieldStringLocale(rubric.catalogueTitle.defaultTitleI18n, locale),
          defaultKeyword: getFieldStringLocale(rubric.catalogueTitle.keywordI18n, locale),
          prefix: getFieldStringLocale(rubric.catalogueTitle.prefixI18n, locale),
          attributes: selectedFilters,
          capitaliseKeyWord: rubric.capitalise,
          locale,
          currency,
        });

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

    // get catalogue breadcrumbs
    const rubricName = search ? 'Результат поиска' : getFieldStringLocale(rubric.nameI18n, locale);
    const breadcrumbs: CatalogueBreadcrumbModel[] = [
      {
        _id: rubric._id,
        name: rubricName,
        href: basePath,
      },
    ];

    selectedAttributes.forEach((selectedAttribute) => {
      const { options, showAsCatalogueBreadcrumb, slug } = selectedAttribute;
      const isPrice = slug === CATALOGUE_PRICE_KEY;
      const isBrand = slug === CATALOGUE_BRAND_KEY;
      let metricValue = selectedAttribute.metric ? ` ${selectedAttribute.metric}` : '';
      if (isPrice) {
        metricValue = currency;
      }

      if ((showAsCatalogueBreadcrumb || isPrice || isBrand) && rubricSlug) {
        const optionBreadcrumbs = options.reduce((acc: CatalogueBreadcrumbModel[], option) => {
          const tree = castOptionsForBreadcrumbs({
            option: option,
            isBrand,
            brands,
            attribute: selectedAttribute,
            rubricSlug,
            metricValue,
            acc: [],
          });
          return [...acc, ...tree];
        }, []);

        optionBreadcrumbs.forEach((options) => {
          breadcrumbs.push(options);
        });
      }
    });

    // get clearSlug
    let clearSlug = basePath;
    if (showCategoriesInFilter) {
      const clearPath = [rubricSlug, ...categoryFilters, sortPathname]
        .filter((pathPart) => {
          return pathPart;
        })
        .join('/');
      clearSlug = `${clearPath}`;
    }
    if (search) {
      clearSlug = basePath;
    }

    // get layout configs
    const catalogueFilterLayout = search
      ? DEFAULT_LAYOUT
      : rubric.variant?.catalogueFilterLayout || DEFAULT_LAYOUT;

    const gridSnippetLayout = search
      ? GRID_SNIPPET_LAYOUT_BIG_IMAGE
      : rubric.variant?.gridSnippetLayout || GRID_SNIPPET_LAYOUT_BIG_IMAGE;

    const rowSnippetLayout = search
      ? ROW_SNIPPET_LAYOUT_BIG_IMAGE
      : rubric.variant?.rowSnippetLayout || ROW_SNIPPET_LAYOUT_BIG_IMAGE;

    const showSnippetConnections = search ? true : rubric.variant?.showSnippetConnections || true;

    const showSnippetBackground = search ? true : rubric.variant?.showSnippetBackground || true;

    const showSnippetArticle = search ? false : rubric.variant?.showSnippetArticle || false;

    const showSnippetButtonsOnHover = search
      ? false
      : rubric.variant?.showSnippetButtonsOnHover || false;

    const gridCatalogueColumns = search
      ? CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT
      : rubric.variant?.gridCatalogueColumns || CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT;

    // console.log(`Catalogue data >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);
    return {
      _id: rubric._id,
      clearSlug,
      filters: input.filters,
      rubricName,
      rubricSlug: rubric.slug,
      products,
      catalogueTitle,
      catalogueFilterLayout,
      gridSnippetLayout,
      rowSnippetLayout,
      showSnippetConnections,
      showSnippetBackground,
      showSnippetArticle,
      showSnippetButtonsOnHover,
      gridCatalogueColumns,
      totalProducts: noNaN(totalProducts),
      attributes: castedAttributes,
      selectedAttributes: showCategoriesInFilter
        ? selectedAttributes
        : selectedAttributes.filter(({ slug }) => {
            return slug !== CATALOGUE_CATEGORY_KEY;
          }),
      page,
      breadcrumbs,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};
