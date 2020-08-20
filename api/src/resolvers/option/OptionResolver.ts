import { Arg, Ctx, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { Option, OptionModel } from '../../entities/Option';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/translations/getLangField';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod } from '../../decorators/methodDecorators';
import { CustomFilter } from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';

const { operationConfigRead } = getOperationsConfigs(Option.name);

@Resolver((_of) => Option)
export class OptionResolver {
  @Query(() => Option, { nullable: true })
  @AuthMethod(operationConfigRead)
  async getOption(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Option>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Option | null> {
    return OptionModel.findOne({ _id: id, ...customFilter });
  }

  @FieldResolver()
  async nameString(
    @Root() option: DocumentType<Option>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(option.name, ctx.req.lang);
  }
}
