import { Arg, Query, Resolver, ID, FieldResolver, Root } from 'type-graphql';
import { Attribute, AttributeFilterOption, AttributeModel } from '../../entities/Attribute';
import { DocumentType } from '@typegoose/typegoose';
import { OptionsGroup, OptionsGroupModel } from '../../entities/OptionsGroup';
import { Metric, MetricModel } from '../../entities/Metric';
import getLangField from '../../utils/translations/getLangField';
import { OptionModel } from '../../entities/Option';
import { RubricModel } from '../../entities/Rubric';
import getCityData from '../../utils/getCityData';
import { getRubricsTreeIds } from '../../utils/rubricResolverHelpers';
import { getProductsFilter } from '../../utils/getProductsFilter';
import { ProductModel } from '../../entities/Product';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';

const { operationConfigRead } = getOperationsConfigs(Attribute.name);

@Resolver((_for) => Attribute)
export class AttributeResolver {
  @Query((_type) => Attribute, { nullable: true })
  @AuthMethod(operationConfigRead)
  async getAttribute(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Attribute>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Attribute | null> {
    return AttributeModel.findOne({ _id: id, ...customFilter });
  }

  @FieldResolver()
  async options(@Root() attribute: DocumentType<Attribute>): Promise<OptionsGroup | null> {
    return OptionsGroupModel.findById(attribute.options);
  }

  @FieldResolver()
  async metric(@Root() attribute: DocumentType<Attribute>): Promise<Metric | null> {
    return MetricModel.findById(attribute.metric);
  }

  @FieldResolver()
  async nameString(
    @Root() attribute: DocumentType<Attribute>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(attribute.name, lang);
  }

  @FieldResolver((_of) => [AttributeFilterOption])
  async filterOptions(
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('filter', (_type) => [String]) filter: string[],
    @Root() attribute: DocumentType<Attribute>,
  ): Promise<AttributeFilterOption[]> {
    const optionsGroup = await OptionsGroupModel.findById(attribute.options);

    if (!optionsGroup) {
      return [];
    }

    const options = await OptionModel.find({ _id: { $in: optionsGroup.options } });
    const { slug } = attribute;
    const [rubricSlug] = filter || [];

    // get current rubric
    const rubric = await RubricModel.findOne({
      cities: {
        $elemMatch: {
          key: city,
          'node.slug': rubricSlug,
        },
      },
    });
    if (!rubric) {
      return [];
    }

    // get rubric city data
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return [];
    }

    // get all nested rubrics
    const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id, city });

    const result = options.map(async (option) => {
      // cast current option for products filter
      const test = [
        {
          key: slug,
          value: [option.slug],
        },
      ];

      // get products filter query
      const query = getProductsFilter(
        { attributes: test, rubrics: rubricsIds, active: true },
        city,
      );
      // count products
      const counter = await ProductModel.countDocuments(query);

      return {
        option,
        counter,
      };
    });

    return Promise.all(result);
  }
}
