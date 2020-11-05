import { Arg, Query, Resolver, ID, FieldResolver, Root } from 'type-graphql';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { DocumentType } from '@typegoose/typegoose';
import { OptionsGroup, OptionsGroupModel } from '../../entities/OptionsGroup';
import { Metric, MetricModel } from '../../entities/Metric';
import getLangField from '../../utils/translations/getLangField';
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
