import { Arg, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { Option, OptionModel } from '../../entities/Option';
import { DocumentType } from '@typegoose/typegoose';
import { AuthMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { RoleRuleModel } from '../../entities/RoleRule';

const { operationConfigRead } = RoleRuleModel.getOperationsConfigs(Option.name);

@Resolver((_of) => Option)
export class OptionResolver {
  @Query(() => Option)
  @AuthMethod(operationConfigRead)
  async getOption(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Option>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Option> {
    const option = await OptionModel.findOne({ _id: id, ...customFilter });
    if (!option) {
      throw Error('Options not found by given ID');
    }
    return option;
  }

  @FieldResolver()
  async nameString(
    @Root() option: DocumentType<Option>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(option.name);
  }

  @FieldResolver()
  async id(@Root() option: DocumentType<Option>): Promise<string> {
    return option.id || option._id;
  }
}
