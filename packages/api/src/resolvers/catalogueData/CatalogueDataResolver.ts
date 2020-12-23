import { Arg, Query, Resolver } from 'type-graphql';
import { CatalogueData, CatalogueSearchResult } from '../../entities/CatalogueData';
import { Rubric, RubricModel } from '../../entities/Rubric';
import { Product, ProductModel } from '../../entities/Product';
import {
  attributesReducer,
  getAttributesPipeline,
  getCatalogueTitle,
  setCataloguePriorities,
} from '../../utils/catalogueHelpers';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { Role } from '../../entities/Role';
import {
  CATALOGUE_PRODUCTS_LIMIT,
  noNaN,
  SORT_ASC_NUM,
  SORT_DESC,
  SORT_DESC_NUM,
} from '@yagu/shared';
import { CatalogueProductsInput, CatalogueProductsSortByEnum } from './CatalogueProductsInput';
import { SortDirectionEnum } from '../commonInputs/PaginateInput';

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
      const [slug, ...attributes] = catalogueFilter;
      const {
        limit = CATALOGUE_PRODUCTS_LIMIT,
        page = 1,
        sortBy = 'priority',
        sortDir = SORT_DESC,
        minPrice,
        maxPrice,
      } = productsInput;
      const skip = page ? (page - 1) * limit : 0;
      const realSortDir = sortDir === SORT_DESC ? SORT_DESC_NUM : SORT_ASC_NUM;

      // get current rubric
      const rubric = await RubricModel.findOne({ slug });

      if (!rubric) {
        return null;
      }

      // get all nested rubrics
      const rubricsIds = await RubricModel.getRubricsTreeIds({ rubricId: rubric.id });

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

        // Add minPrice field
        { $addFields: { minPrice: { $min: '$shops.price' } } },

        // Filter out products not added to the shops
        { $match: { shopsCount: { $gt: 0 } } },

        // Filter out products that out of price range
        // ...priceRangePipeline,

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
                    $gte: minPrice,
                    $lte: maxPrice,
                  },
                },
              },
            ]
          : [];

      const productsPipeline = [
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
      ];

      interface ProductsAggregationInterface {
        docs: Product[];
        countAllDocs: {
          totalDocs: number;
        }[];
        minPrice: {
          _id: number;
        }[];
        maxPrice: {
          _id: number;
        }[];
      }

      const productsAggregation = await ProductModel.aggregate<ProductsAggregationInterface>(
        productsPipeline,
      );

      const productsResult = productsAggregation[0] ?? { docs: [] };
      const totalDocs = noNaN(productsResult.countAllDocs[0]?.totalDocs);
      const totalPages = Math.ceil(totalDocs / limit);
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
