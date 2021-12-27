import { ObjectId } from 'mongodb';
import { ParsedUrlQuery } from 'querystring';
import {
  DEFAULT_CITY,
  DEFAULT_CURRENCY,
  GENDER_HE,
  PAGINATION_DEFAULT_LIMIT,
} from '../../../config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getCommonFilterAttribute,
  getPriceAttribute,
} from '../../../config/constantAttributes';
import { alwaysArray, alwaysString } from '../../../lib/arrayUtils';
import { castUrlFilters, getCatalogueAttributes } from '../../../lib/catalogueUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import { castSupplierProductsList } from '../../../lib/productUtils';
import { getTreeFromList } from '../../../lib/treeUtils';
import {
  COL_CITIES,
  COL_COMPANIES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from '../../collectionNames';
import { ObjectIdModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import {
  AttributeInterface,
  CompanyShopProductsPageInterface,
  RubricInterface,
  ShopInterface,
  ShopProductInterface,
  ShopProductPricesInterface,
  ShopProductsAggregationInterface,
} from '../../uiInterfaces';
import {
  paginatedAggregationFinalPipeline,
  productsPaginatedAggregationFacetsPipeline,
  ProductsPaginatedAggregationInterface,
  shopProductDocsFacetPipeline,
} from '../constantPipelines';
import { castSummaryForUI } from './castSummaryForUI';

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
  ...props
}: GetConsoleShopProductsInputInterface): Promise<CompanyShopProductsPageInterface | null> => {
  try {
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
    const filters = alwaysArray(query.filters);
    const search = alwaysString(query.search);
    const shopId = alwaysString(query.shopId);
    const rubricSlug = alwaysString(query.rubricSlug);

    // Get shop
    const shopAggregation = await shopsCollection
      .aggregate<ShopInterface>([
        {
          $match: { _id: new ObjectId(`${shopId}`) },
        },
        {
          $lookup: {
            from: COL_COMPANIES,
            as: 'company',
            foreignField: '_id',
            localField: 'companyId',
          },
        },
        {
          $lookup: {
            from: COL_CITIES,
            as: 'city',
            foreignField: 'slug',
            localField: 'citySlug',
          },
        },
        {
          $addFields: {
            company: {
              $arrayElemAt: ['$company', 0],
            },
            city: {
              $arrayElemAt: ['$city', 0],
            },
          },
        },
      ])
      .toArray();
    const shop = shopAggregation[0];
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
      categoryStage,
      noSearchResults,
      sortStage,
    } = await castUrlFilters({
      filters,
      initialPage: props.page,
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
      ...categoryStage,
      ...searchStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...pricesStage,
      ...photoStage,
    };

    const pipelineConfig: ProductsPaginatedAggregationInterface = {
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
