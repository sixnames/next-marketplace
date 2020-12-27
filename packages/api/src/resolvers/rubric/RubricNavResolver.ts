import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Rubric, RubricNavItems } from '../../entities/Rubric';
import { DocumentType } from '@typegoose/typegoose';

@Resolver((_for) => Rubric)
export class RubricNavResolver {
  @FieldResolver((_returns) => RubricNavItems)
  async navItems(@Root() rubric: DocumentType<Rubric>): Promise<RubricNavItems> {
    try {
      return {
        id: rubric._id.toString(),
        attributes: [],
        isDisabled: true,
      };
    } catch (e) {
      console.log(e);
      return {
        id: rubric._id.toString(),
        attributes: [],
        isDisabled: true,
      };
    }
  }
}
