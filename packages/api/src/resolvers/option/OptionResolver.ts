import { Arg, ID, Query, Resolver } from 'type-graphql';
import { Option, OptionModel } from '../../entities/Option';

@Resolver((_of) => Option)
export class OptionResolver {
  @Query(() => Option, { nullable: true })
  async getOption(@Arg('id', (_type) => ID) id: string): Promise<Option | null> {
    return OptionModel.findById(id);
  }
}
