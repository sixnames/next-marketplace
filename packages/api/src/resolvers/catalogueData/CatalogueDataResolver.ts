import { noNaN } from '../../utils/numbers';
import { Arg, Query, Resolver } from 'type-graphql';
import { CatalogueData, CatalogueSearchResult } from '../../entities/CatalogueData';
import { Rubric, RubricModel } from '../../entities/Rubric';
import { Product, ProductModel } from '../../entities/Product';
import {
  attributesReducer,
  getAttributesPipeline,
  getCatalogueTitle,
  getOptionFromParam,
  GetOptionFromParamPayloadInterface,
  getParamOptionFirstValueByKey,
  setCataloguePriorities,
} from '../../utils/catalogueHelpers';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { Role } from '../../entities/Role';
import {
  CATALOGUE_FILTER_EXCLUDED_KEYS,
  CATALOGUE_MAX_PRICE_KEY,
  CATALOGUE_MIN_PRICE_KEY,
  CATALOGUE_PRODUCTS_LIMIT,
  PAGE_DEFAULT,
  SORT_ASC_NUM,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_NUM,
  SORT_DIR_KEY,
} from '@yagu/shared';
import { CatalogueProductsInput, CatalogueProductsSortByEnum } from './CatalogueProductsInput';
import { SortDirectionEnum } from '../commonInputs/PaginateInput';
import { getRubricsTreeIds } from '../../utils/rubricHelpers';
import { paginationTotalStages } from '../../utils/aggregatePagination';

@Resolver((_of) => CatalogueData)
export class CatalogueDataResolver {
  @Query(() => CatalogueData, { nullable: true })
  async getCatalogueData(
    @SessionRole() sessionRole: Role,
    @Localization() { lang, city }: LocalizationPayloadInterface,
    @Arg('catalogueFilter', (_type) => [String])
    catalogueFilter: string[],
    @Arg('productsInput', {
      nullable: true,
      defaultValue: {
        limit: CATALOGUE_PRODUCTS_LIMIT,
        page: 1,
        sortBy: 'priority',
        sortDir: SORT_DESC,
      },
    })
    productsInput: CatalogueProductsInput,
  ): Promise<CatalogueData | null> {
    try {
      const [slug, ...params] = catalogueFilter;
      const additionalFilters: GetOptionFromParamPayloadInterface[] = [];

      const attributes = params.filter((param) => {
        const paramObject = getOptionFromParam(param);
        const excluded = CATALOGUE_FILTER_EXCLUDED_KEYS.includes(paramObject.key);
        if (excluded) {
          additionalFilters.push(paramObject);
          return false;
        }
        return true;
      });

      const { limit = CATALOGUE_PRODUCTS_LIMIT, page = 1 } = productsInput;

      const sortBy = getParamOptionFirstValueByKey({
        defaultValue: 'priority',
        paramOptions: additionalFilters,
        key: SORT_BY_KEY,
      });
      const sortDir = getParamOptionFirstValueByKey({
        defaultValue: SORT_DESC,
        paramOptions: additionalFilters,
        key: SORT_DIR_KEY,
      });
      const minPrice = getParamOptionFirstValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_MIN_PRICE_KEY,
      });
      const maxPrice = getParamOptionFirstValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_MAX_PRICE_KEY,
      });
      const skip = page ? (page - 1) * limit : 0;
      const realSortDir = sortDir === SORT_DESC ? SORT_DESC_NUM : SORT_ASC_NUM;

      // get current rubric
      const rubric = await RubricModel.findOne({ slug });

      if (!rubric) {
        return null;
      }

      // get all nested rubrics
      const rubricsIds = await getRubricsTreeIds(rubric._id);

      // cast all filters from input
      const processedAttributes = attributes.reduce(attributesReducer, []);

      // increase filter priority
      const attributesGroupsIds = rubric.attributesGroups.map(({ node }) => node);
      await setCataloguePriorities({
        attributesGroupsIds,
        rubric: rubric,
        processedAttributes,
        isStuff: sessionRole.isStuff,
        city,
      });

      // get catalogue title
      const catalogueTitle = await getCatalogueTitle({
        processedAttributes,
        lang,
        rubric,
      });

      const attributesMatch =
        processedAttributes.length > 0
          ? {
              $and: getAttributesPipeline(processedAttributes),
            }
          : {};

      // pipeline
      const allProductsPipeline = [
        // Initial match
        {
          $match: {
            ...attributesMatch,
            rubrics: { $in: rubricsIds },
            active: true,
          },
        },

        // Lookup shop products
        { $addFields: { productId: { $toString: '$_id' } } },
        {
          $lookup: {
            from: 'shopproducts',
            localField: 'productId',
            foreignField: 'product',
            as: 'shops',
          },
        },

        // Count shop products
        { $addFields: { shopsCount: { $size: '$shops' } } },

        // Filter out products not added to the shops
        { $match: { shopsCount: { $gt: 0 } } },

        // Add minPrice field
        { $addFields: { minPrice: { $min: '$shops.price' } } },

        // Unwind by views counter
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },

        // Filter unwinded products by current city or empty views
        { $match: { $or: [{ 'views.key': city }, { 'views.key': { $exists: false } }] } },
      ];

      // Sort pipeline
      // sort by priority/views (default)
      const sortByIdDirection = -1;
      let sortPipeline: any[] = [
        { $sort: { 'views.counter': realSortDir, _id: sortByIdDirection } },
      ];

      // sort by price
      if (sortBy === 'price') {
        sortPipeline = [{ $sort: { minPrice: realSortDir, _id: sortByIdDirection } }];
      }

      // sort by create date
      if (sortBy === 'createdAt') {
        sortPipeline = [{ $sort: { createdAt: realSortDir, _id: sortByIdDirection } }];
      }

      // price range pipeline
      const priceRangePipeline =
        minPrice && maxPrice
          ? [
              {
                $match: {
                  minPrice: {
                    $gte: noNaN(minPrice),
                    $lte: noNaN(maxPrice),
                  },
                },
              },
            ]
          : [];

      interface ProductsAggregationInterface {
        docs: Product[];
        totalDocs: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        minPrice: {
          _id: number;
        }[];
        maxPrice: {
          _id: number;
        }[];
      }

      const productsAggregation = await ProductModel.aggregate<ProductsAggregationInterface>([
        ...allProductsPipeline,

        // Facets for pagination fields
        {
          $facet: {
            docs: [...priceRangePipeline, ...sortPipeline, { $skip: skip }, { $limit: limit }],
            countAllDocs: [...priceRangePipeline, { $count: 'totalDocs' }],
            minPrice: [{ $group: { _id: '$minPrice' } }, { $sort: { _id: 1 } }, { $limit: 1 }],
            maxPrice: [{ $group: { _id: '$minPrice' } }, { $sort: { _id: -1 } }, { $limit: 1 }],
          },
        },
        ...paginationTotalStages(limit),
        {
          $project: {
            docs: 1,
            totalDocs: 1,
            totalPages: 1,
            minPrice: 1,
            maxPrice: 1,
            hasPrevPage: {
              $gt: [page, PAGE_DEFAULT],
            },
            hasNextPage: {
              $lt: [page, '$totalPages'],
            },
          },
        },
      ]);

      const productsResult = productsAggregation[0] ?? { docs: [] };
      const { totalDocs, totalPages } = productsResult;
      const minPriceResult = noNaN(productsResult.minPrice[0]?._id);
      const maxPriceResult = noNaN(productsResult.maxPrice[0]?._id);

      return {
        rubric,
        products: {
          docs: productsResult.docs,
          page,
          totalDocs,
          totalPages,
          limit,
          sortBy: sortBy as CatalogueProductsSortByEnum,
          sortDir: sortDir as SortDirectionEnum,
        },
        catalogueTitle,
        catalogueFilter,
        minPrice: minPriceResult,
        maxPrice: maxPriceResult,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Query((_returns) => CatalogueSearchResult)
  async getCatalogueSearchTopItems(
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<CatalogueSearchResult> {
    try {
      const searchPipeLine = [
        {
          $match: {
            active: true,
          },
        },
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            id: '$_id',
            viewsCounter: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: ['$views.key', city],
                    },
                  ],
                },
                then: '$views.counter',
                else: 0,
              },
            },
          },
        },
        { $sort: { viewsCounter: -1 } },
        { $limit: 3 },
      ];

      const products = await ProductModel.aggregate<Product>(searchPipeLine);
      const rubrics = await RubricModel.aggregate<Rubric>(searchPipeLine);

      return {
        products,
        rubrics,
      };
    } catch (e) {
      return {
        products: [],
        rubrics: [],
      };
    }
  }

  @Query((_returns) => CatalogueSearchResult)
  async getCatalogueSearchResult(
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('search', (_type) => String) search: string,
  ): Promise<CatalogueSearchResult> {
    try {
      const searchPipeLine = [
        {
          $match: {
            $text: {
              $search: search,
              $caseSensitive: false,
            },
            active: true,
          },
        },
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            id: '$_id',
            viewsCounter: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: ['$views.key', city],
                    },
                  ],
                },
                then: '$views.counter',
                else: 0,
              },
            },
          },
        },
        { $sort: { viewsCounter: -1 } },
        { $limit: 3 },
      ];

      const products = await ProductModel.aggregate<Product>(searchPipeLine);
      const rubrics = await RubricModel.aggregate<Rubric>(searchPipeLine);

      return {
        products,
        rubrics,
      };
    } catch (e) {
      return {
        products: [],
        rubrics: [],
      };
    }
  }
}
