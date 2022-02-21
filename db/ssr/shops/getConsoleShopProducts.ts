import { castSummaryForUI } from 'db/cast/castSummaryForUI';
import { castSupplierProductsList } from 'db/cast/castSupplierProductsList';
import { ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getCatalogueAttributes } from 'db/ssr/catalogue/catalogueUtils';
import { getConsoleShopSsr } from 'db/ssr/shops/getConsoleShopSsr';
import {
  AttributeInterface,
  CompanyShopProductsPageInterface,
  ShopProductInterface,
  ShopProductPricesInterface,
  ShopProductsAggregationInterface,
} from 'db/uiInterfaces';
import {
  PaginatedAggregationFacetsInputInterface,
  paginatedAggregationFinalPipeline,
  productsPaginatedAggregationFacetsPipeline,
  shopProductDocsFacetPipeline,
} from 'db/utils/constantPipelines';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import {
  DEFAULT_CITY,
  DEFAULT_CURRENCY,
  GENDER_HE,
  PAGINATION_DEFAULT_LIMIT,
} from 'lib/config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getCommonFilterAttribute,
  getPriceAttribute,
} from 'lib/config/constantAttributes';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/treeUtils';
import { ParsedUrlQuery } from 'querystring';

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
}: GetConsoleShopProductsInputInterface): Promise<CompanyShopProductsPageInterface | null> => {
  try {
    const collections = await getDbCollections();
    const shopProductsCollection = collections.shopProductsCollection();
    const rubricsCollection = collections.rubricsCollection();
    const filters = alwaysArray(query.filters);
    const search = alwaysString(query.search);
    const shopId = alwaysString(query.shopId);
    const rubricSlug = alwaysString(query.rubricSlug);

    // Get shop
    const shop = await getConsoleShopSsr(`${shopId}`);
    if (!shop) {
      return null;
    }

    const fallbackPayload: CompanyShopProductsPageInterface = {
      basePath: '',
      rubricSlug: '',
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

    // get rubric
    const rubric = await rubricsCollection.findOne({ slug: rubricSlug });
    if (!rubric) {
      return fallbackPayload;
    }

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
      searchStage,
      noSearchResults,
      sortStage,
    } = await castUrlFilters({
      filters,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      search: query.search,
      searchFieldName: 'productId',
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

    // initial match
    const productsInitialMatch = {
      shopId: shop._id,
      ...rubricStage,
      ...searchStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      ...photoStage,
    };

    const pipelineConfig: PaginatedAggregationFacetsInputInterface = {
      citySlug: DEFAULT_CITY,
      companySlug,
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
            docs: shopProductDocsFacetPipeline({
              sortStage,
              skip,
              limit,
              getSuppliers: true,
              summaryIdFieldName: '$productId',
            }),

            ...productsPaginatedAggregationFacetsPipeline(pipelineConfig),
          },
        },

        // cast facets
        ...paginatedAggregationFinalPipeline(limit),
      ])
      .toArray();
    const shopProductsAggregation = shopProductsAggregationResult[0];
    if (!shopProductsAggregation) {
      return fallbackPayload;
    }

    const { totalDocs, totalPages, attributes, prices, brands, categories } =
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
    for await (const shopProduct of shopProductsAggregation.docs) {
      const summary = shopProduct.summary;
      if (!summary) {
        continue;
      }

      const castedProduct = castSummaryForUI({
        summary,
        attributes,
        brands,
        categories,
        locale,
      });

      const otherShopProducts = await shopProductsCollection
        .aggregate<ShopProductPricesInterface>([
          {
            $match: {
              productId: summary._id,
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

      docs.push({
        ...shopProduct,
        minPrice: shopProductPrices?.minPrice,
        maxPrice: shopProductPrices?.maxPrice,
        supplierProducts: castSupplierProductsList({
          supplierProducts: shopProduct.supplierProducts,
          locale,
        }),
        summary: {
          ...castedProduct,
          shopsCount: shopProduct.shopsCount,
        },
      });
    }

    const payload: CompanyShopProductsPageInterface = {
      shop,
      currency: shop.city?.currency || DEFAULT_CURRENCY,
      rubricName: getFieldStringLocale(rubric.nameI18n, locale),
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
