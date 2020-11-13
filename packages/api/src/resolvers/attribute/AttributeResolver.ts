import { Arg, Query, Resolver, ID, FieldResolver, Root } from 'type-graphql';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { DocumentType } from '@typegoose/typegoose';
import { OptionsGroup, OptionsGroupModel } from '../../entities/OptionsGroup';
import { Metric, MetricModel } from '../../entities/Metric';
import getLangField from '../../utils/translations/getLangField';
import { AuthMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { RoleRuleModel } from '../../entities/RoleRule';

const { operationConfigRead } = RoleRuleModel.getOperationsConfigs(Attribute.name);

@Resolver((_for) => Attribute)
export class AttributeResolver {
  @Query((_type) => Attribute)
  @AuthMethod(operationConfigRead)
  async getAttribute(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Attribute>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Attribute> {
    const attribute = await AttributeModel.findOne({ _id: id, ...customFilter });
    if (!attribute) {
      throw Error('Attribute not found by given ID');
    }

    return attribute;
  }

  @FieldResolver()
  async optionsGroup(@Root() attribute: DocumentType<Attribute>): Promise<OptionsGroup | null> {
    return OptionsGroupModel.findById(attribute.optionsGroup);
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

  @FieldResolver()
  async id(@Root() attribute: DocumentType<Attribute>): Promise<string> {
    return attribute.id || attribute._id;
  }
}
