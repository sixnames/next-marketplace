import { Arg, Query, Resolver } from 'type-graphql';
import { CatalogueData, CatalogueSearchResult } from '../../entities/CatalogueData';
import { Rubric, RubricModel } from '../../entities/Rubric';
import { getRubricsTreeIds } from '../../utils/rubricResolverHelpers';
import { getProductsFilter } from '../../utils/getProductsFilter';
import { Product, ProductModel } from '../../entities/Product';
import {
  attributesReducer,
  getCatalogueTitle,
  setCataloguePriorities,
} from '../../utils/catalogueHelpers';
import { ProductPaginateInput } from '../product/ProductPaginateInput';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { Role } from '../../entities/Role';
// import { isEqual } from 'lodash';

@Resolver((_of) => CatalogueData)
export class CatalogueDataResolver {
  @Query(() => CatalogueData, { nullable: true })
  async getCatalogueData(
    @SessionRole() sessionRole: Role,
    @Localization() { lang, city }: LocalizationPayloadInterface,
    @Arg('catalogueFilter', (_type) => [String])
    catalogueFilter: string[],
    @Arg('productsInput', { nullable: true }) productsInput: ProductPaginateInput,
  ): Promise<CatalogueData | null> {
    const [slug, ...attributes] = catalogueFilter;
    const { limit = 100, page = 1, ...args } = productsInput || {};

    // get current rubric
    const rubric = await RubricModel.findOne({ slug });

    if (!rubric) {
      return null;
    }

    // get all nested rubrics
    const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id });

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

    // get products filter query
    const query = getProductsFilter({
      ...args,
      attributes: processedAttributes,
      rubrics: rubricsIds,
      active: true,
    });

    const sortByViewsPipeLine = [
      { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
      { $match: { $or: [{ 'views.key': city }, { 'views.key': { $exists: false } }] } },
      { $sort: { 'views.counter': -1 } },
    ];

    const productsPipeline = ProductModel.aggregate<Product>([
      { $match: query },
      ...sortByViewsPipeLine,
    ]);

    const products = await ProductModel.aggregatePaginate(productsPipeline, {
      limit,
      page,
    });

    return {
      rubric,
      products,
      catalogueTitle,
    };
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
