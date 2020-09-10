import { Arg, Query, Resolver } from 'type-graphql';
import { CatalogueData } from '../../entities/CatalogueData';
import { RubricModel } from '../../entities/Rubric';
import { getRubricsTreeIds } from '../../utils/rubricResolverHelpers';
import { getProductsFilter } from '../../utils/getProductsFilter';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { ProductModel } from '../../entities/Product';
import getCityData from '../../utils/getCityData';
import { attributesReducer, getCatalogueTitle } from '../../utils/catalogueHelpers';
import { ProductPaginateInput } from '../product/ProductPaginateInput';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { Role } from '../../entities/Role';
import { OptionModel } from '../../entities/Option';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { AttributeModel } from '../../entities/Attribute';
import { OptionsGroupModel } from '../../entities/OptionsGroup';

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

    // increase rubric priority if user not stuff
    const { isStuff } = sessionRole;
    if (!isStuff) {
      await RubricModel.findOneAndUpdate(
        {
          _id: rubric.id,
          'cities.key': city,
        },
        {
          $inc: {
            'cities.$.node.priority': 1,
          },
        },
        { new: true },
      );
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

    // increase filters priority
    const attributesGroupsIds = rubricCity.node.attributesGroups.map(({ node }) => node);
    const attributesGroups = await AttributesGroupModel.find({ _id: { $in: attributesGroupsIds } });
    const attributesIds = attributesGroups.reduce(
      (acc: string[], { attributes }) => [...acc, ...attributes],
      [],
    );
    const attributesSlugs = processedAttributes.reduce(
      (acc: string[], { key }) => [...acc, key],
      [],
    );
    const attributesList = await AttributeModel.find({
      $and: [{ _id: { $in: attributesIds } }, { slug: { $in: attributesSlugs } }],
    });
    const optionsGroupsIds = attributesList.reduce((acc: string[], { options }) => {
      if (options) {
        return [...acc, options];
      }
      return acc;
    }, []);
    const optionsGroups = await OptionsGroupModel.find({ _id: { $in: optionsGroupsIds } });
    const optionsIds = optionsGroups.reduce(
      (acc: string[], { options }) => [...acc, ...options],
      [],
    );
    const optionsSlugs = processedAttributes.reduce(
      (acc: string[], { value }) => [...acc, ...value],
      [],
    );
    const optionsList = await OptionModel.find({
      $and: [{ _id: { $in: optionsIds } }, { slug: { $in: optionsSlugs } }],
    });
    console.log(JSON.stringify({ attributesList, optionsList }, null, 2));
    /*for await (const attribute of processedAttributes) {
      const options = await OptionModel.find({ slug: { $in: attribute.value } });
      console.log(options);
    }

    console.log(processedAttributes);*/
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
