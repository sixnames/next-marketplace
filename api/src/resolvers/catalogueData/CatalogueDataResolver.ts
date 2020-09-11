import { Arg, Query, Resolver } from 'type-graphql';
import { CatalogueData } from '../../entities/CatalogueData';
import { RubricModel } from '../../entities/Rubric';
import { getRubricsTreeIds } from '../../utils/rubricResolverHelpers';
import { getProductsFilter } from '../../utils/getProductsFilter';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { ProductModel } from '../../entities/Product';
import getCityData from '../../utils/getCityData';
import {
  attributesReducer,
  getCatalogueTitle,
  setCataloguePriorities,
} from '../../utils/catalogueHelpers';
import { ProductPaginateInput, ProductSortByEnum } from '../product/ProductPaginateInput';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { Role } from '../../entities/Role';
import { get } from 'lodash';

@Resolver((_of) => CatalogueData)
export class CatalogueDataResolver {
  @Query(() => CatalogueData, { nullable: true })
  async getCatalogueData(
    @SessionRole() sessionRole: Role,
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @Arg('catalogueFilter', (_type) => [String])
    catalogueFilter: string[],
    @Arg('productsInput', { nullable: true }) productsInput: ProductPaginateInput,
  ): Promise<CatalogueData | null> {
    const [slug, ...attributes] = catalogueFilter;
    const {
      limit = 100,
      page = 1,
      sortBy = 'priority' as ProductSortByEnum,
      sortDir = 'desc',
      ...args
    } = productsInput || {};

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

    // increase filter priority
    const attributesGroupsIds = rubricCity.node.attributesGroups.map(({ node }) => node);
    await setCataloguePriorities({
      attributesGroupsIds,
      rubricId: rubric.id,
      processedAttributes,
      isStuff: sessionRole.isStuff,
      city,
    });

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
    products.docs.sort((a, b) => {
      const cityA = getCityData(a.cities, city);
      const cityB = getCityData(b.cities, city);
      if (!cityA) {
        return 1;
      }

      if (!cityB) {
        return -1;
      }

      const valueA: any = get(cityA, `node.${sortBy}`);
      const valueB: any = get(cityB, `node.${sortBy}`);

      if (valueA < valueB) {
        return 1;
      }

      if (valueB < valueA) {
        return -1;
      }

      return 0;
    });

    return {
      rubric,
      products,
      catalogueTitle,
    };
  }
}
