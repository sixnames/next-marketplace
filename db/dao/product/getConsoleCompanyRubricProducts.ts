import { ObjectId } from 'mongodb';
import { ParsedUrlQuery } from 'querystring';
import { DEFAULT_CITY, GENDER_HE, PAGINATION_DEFAULT_LIMIT } from '../../../config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getCommonFilterAttribute,
  getPriceAttribute,
} from '../../../config/constantAttributes';
import { alwaysArray, alwaysString } from '../../../lib/arrayUtils';
import { castUrlFilters } from '../../../lib/castUrlFilters';
import { getCatalogueAttributes } from '../../../lib/catalogueUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import {
  countProductAttributes,
  getRubricAllAttributes,
} from '../../../lib/productAttributesUtils';
import { getTreeFromList } from '../../../lib/treeUtils';
import { COL_RUBRICS, COL_SHOP_PRODUCTS } from '../../collectionNames';
import { ObjectIdModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import {
  AttributeInterface,
  ConsoleRubricProductsInterface,
  ProductsAggregationInterface,
  ProductSummaryInterface,
  RubricInterface,
  ShopProductInterface,
} from '../../uiInterfaces';
import {
  paginatedAggregationFinalPipeline,
  productsPaginatedAggregationFacetsPipeline,
  ProductsPaginatedAggregationInterface,
  shopProductDocsFacetPipeline,
  shopProductsGroupPipeline,
} from '../constantPipelines';
import { castSummaryForUI } from './castSummaryForUI';

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
      pricesStage,
      photoStage,
      searchStage,
      noSearchResults,
      sortStage,
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
      rubricSlug,
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

    const pipelineConfig: ProductsPaginatedAggregationInterface = {
      citySlug: DEFAULT_CITY,
      companySlug,
    };
    const productDataAggregationResult = await shopProductsCollection
      .aggregate<ProductsAggregationInterface>([
        // match shop products
        {
          $match: productsInitialMatch,
        },

        // unwind filterSlugs field
        {
          $unwind: {
            path: '$filterSlugs',
            preserveNullAndEmptyArrays: true,
          },
        },

        // group shop products by productId
        ...shopProductsGroupPipeline(pipelineConfig),

        // facets
        {
          $facet: {
            // docs facet
            docs: [
              ...shopProductDocsFacetPipeline({
                sortStage,
                skip,
                limit,
              }),
              {
                $replaceRoot: {
                  newRoot: '$summary',
                },
              },
            ],

            ...productsPaginatedAggregationFacetsPipeline(pipelineConfig),
          },
        },

        // cast facets
        ...paginatedAggregationFinalPipeline(limit),
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
    for await (const summary of productDataAggregation.docs) {
      const initialCastedProduct = castSummaryForUI({
        summary: summary,
        attributes,
        brands,
        categories,
        locale,
      });

      const castedProduct: ProductSummaryInterface = {
        ...initialCastedProduct,
        attributesCount: countProductAttributes(summary.attributes),
        totalAttributesCount: allRubricAttributes.length,
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
