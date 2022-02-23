import { castSummaryForUI } from 'db/cast/castSummaryForUI';
import { COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getCatalogueAttributes } from 'db/ssr/catalogue/catalogueUtils';
import {
  AttributeInterface,
  ConsoleRubricProductsInterface,
  ProductsAggregationInterface,
  ProductSummaryInterface,
  ShopProductPricesInterface,
} from 'db/uiInterfaces';
import {
  PaginatedAggregationFacetsInputInterface,
  paginatedAggregationFinalPipeline,
  productsPaginatedAggregationFacetsPipeline,
  summaryPipeline,
} from 'db/utils/constantPipelines';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { DEFAULT_CITY, GENDER_HE, PAGINATION_DEFAULT_LIMIT, SORT_DESC } from 'lib/config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getCommonFilterAttribute,
  getPriceAttribute,
} from 'lib/config/constantAttributes';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { countProductAttributes, getRubricAllAttributes } from 'lib/productAttributesUtils';
import { getProductAllSeoContents } from 'lib/seoContentUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { ObjectId } from 'mongodb';
import { ParsedUrlQuery } from 'querystring';

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
}: GetConsoleRubricProductsInputInterface): Promise<ConsoleRubricProductsInterface> => {
  let fallbackPayload: ConsoleRubricProductsInterface = {
    clearSlug: basePath,
    page: 1,
    totalDocs: 0,
    totalPages: 0,
    docs: [],
    attributes: [],
    selectedAttributes: [],
    companySlug,
  };

  try {
    const collections = await getDbCollections();
    const productFacetsCollection = collections.productFacetsCollection();
    const rubricsCollection = collections.rubricsCollection();
    const shopProductsCollection = collections.shopProductsCollection();
    const filters = alwaysArray(query.filters);
    const search = alwaysString(query.search);
    const rubricSlug = alwaysString(query.rubricSlug);

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
      photoStage,
      searchIds,
      noSearchResults,
    } = await castUrlFilters({
      filters,
      search,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      searchFieldName: '_id',
      excludedSearchIds: (excludedProductsIds || []).map((_id) => new ObjectId(_id)),
    });

    // rubric stage
    let rubricStage: Record<any, any> = {
      rubricSlug: rubric.slug,
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
                path: '$attributeIds',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                attributeIds: { $in: attributesObjectIds },
              },
            },
            {
              $group: {
                _id: '$_id',
                doc: { $first: '$$ROOT' },
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
      ...rubricStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...photoStage,
      ...excludedIdsStage,
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

    // aggregate catalogue initial data
    const pipelineConfig: PaginatedAggregationFacetsInputInterface = {
      citySlug: DEFAULT_CITY,
      companySlug,
    };

    const productDataAggregationResult = await productFacetsCollection
      .aggregate<ProductsAggregationInterface>(
        [
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

              ...productsPaginatedAggregationFacetsPipeline(pipelineConfig),
            },
          },

          // cast facets
          ...paginatedAggregationFinalPipeline(limit),
        ],
        {
          allowDiskUse: true,
        },
      )
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
        totalAttributesCount: allRubricAttributes.length,
        attributes: [],
      };

      docs.push(castedProduct);
    }

    const payload: ConsoleRubricProductsInterface = {
      clearSlug: basePath,
      companySlug,
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
