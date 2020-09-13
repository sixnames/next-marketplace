import { Arg, Query, Resolver } from 'type-graphql';
import { CatalogueData, CatalogueSearchResult } from '../../entities/CatalogueData';
import { RubricModel } from '../../entities/Rubric';
import { getRubricsTreeIds } from '../../utils/rubricResolverHelpers';
import { getProductsFilter } from '../../utils/getProductsFilter';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { ProductModel } from '../../entities/Product';
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
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc', ...args } =
      productsInput || {};

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

    // get pagination options
    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });

    const products = await ProductModel.paginate(query, options);

    return {
      rubric,
      products,
      catalogueTitle,
    };
  }

  @Query((_returns) => CatalogueSearchResult)
  async getCatalogueSearchResult(
    @Arg('search', (_type) => String) search: string,
  ): Promise<CatalogueSearchResult> {
    try {
      console.log(search);
      return {
        products: [],
        rubrics: [],
      };
    } catch (e) {
      return {
        products: [],
        rubrics: [],
      };
    }
  }
}
