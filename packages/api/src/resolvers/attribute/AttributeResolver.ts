import { Arg, Query, Resolver, ID, FieldResolver, Root } from 'type-graphql';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { DocumentType, Ref } from '@typegoose/typegoose';
import { OptionsGroup } from '../../entities/OptionsGroup';

@Resolver((_for) => Attribute)
export class AttributeResolver {
  @Query((_type) => Attribute, { nullable: true })
  async getAttribute(@Arg('id', (_type) => ID) id: string): Promise<Attribute | null> {
    return AttributeModel.findById(id);
  }

  @FieldResolver()
  async options(@Root() attribute: DocumentType<Attribute>): Promise<Ref<OptionsGroup>> {
    return (await attribute.populate('options').execPopulate()).options;
  }
}
