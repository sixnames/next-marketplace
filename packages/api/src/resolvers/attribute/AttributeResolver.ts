import { Arg, Query, Resolver, ID, FieldResolver, Root, Ctx } from 'type-graphql';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { DocumentType, Ref } from '@typegoose/typegoose';
import { OptionsGroup } from '../../entities/OptionsGroup';
import { Metric } from '../../entities/Metric';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/getLangField';

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

  @FieldResolver()
  async metric(@Root() attribute: DocumentType<Attribute>): Promise<Ref<Metric>> {
    return (await attribute.populate('metric').execPopulate()).metric;
  }

  @FieldResolver()
  async nameString(
    @Root() attribute: DocumentType<Attribute>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(attribute.name, ctx.req.session!.lang);
  }
}
