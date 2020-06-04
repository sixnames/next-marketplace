import { Arg, Ctx, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { Option, OptionModel } from '../../entities/Option';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/getLangField';

@Resolver((_of) => Option)
export class OptionResolver {
  @Query(() => Option, { nullable: true })
  async getOption(@Arg('id', (_type) => ID) id: string): Promise<Option | null> {
    return OptionModel.findById(id);
  }

  @FieldResolver()
  async nameString(
    @Root() option: DocumentType<Option>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(option.name, ctx.req.session!.lang);
  }
}
