import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import { CatalogueData } from '../../entities/CatalogueData';
import { RubricModel } from '../../entities/Rubric';
import { ContextInterface } from '../../types/context';
import { getRubricsTreeIds } from '../../utils/rubricResolverHelpers';
import { getProductsFilter } from '../../utils/getProductsFilter';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { ProductModel } from '../../entities/Product';
import getCityData from '../../utils/getCityData';
import { attributesReducer, getCatalogueTitle } from '../../utils/catalogueHelpers';
import { ProductPaginateInput } from '../product/ProductPaginateInput';

@Resolver((_of) => CatalogueData)
export class CatalogueDataResolver {
  @Query(() => CatalogueData, { nullable: true })
  async getCatalogueData(
    @Ctx() ctx: ContextInterface,
    @Arg('catalogueFilter', (_type) => [String])
    catalogueFilter: string[],
    @Arg('productsInput', { nullable: true }) productsInput: ProductPaginateInput,
  ): Promise<CatalogueData | null> {
    const city = ctx.req.session!.city;
    const lang = ctx.req.session!.lang;

    const [slug, ...attributes] = catalogueFilter;
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc', ...args } =
      productsInput || {};

    // get current rubric
    const rubric = await RubricModel.findOne({
      cities: {
        $elemMatch: {
          key: city,
          'node.slug': slug,
        },
      },
    });

    if (!rubric) {
      return null;
    }

    // get rubric city data
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return null;
    }

    // get all nested rubrics
    const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id, city });

    // cast all filters from input
    const processedAttributes = attributes.reduce(attributesReducer, []);

    // get catalogue title
    const catalogueTitle = await getCatalogueTitle({
      processedAttributes,
      lang,
      rubric: rubricCity.node,
    });

    // get products filter query
    const query = getProductsFilter(
      { ...args, attributes: processedAttributes, rubrics: rubricsIds, active: true },
      city,
    );

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
}
