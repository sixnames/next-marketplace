import { Arg, Query, Resolver, ID, FieldResolver, Root, Ctx } from 'type-graphql';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { DocumentType } from '@typegoose/typegoose';
import { OptionsGroup, OptionsGroupModel } from '../../entities/OptionsGroup';
import { Metric, MetricModel } from '../../entities/Metric';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/getLangField';

@Resolver((_for) => Attribute)
export class AttributeResolver {
  @Query((_type) => Attribute, { nullable: true })
  async getAttribute(@Arg('id', (_type) => ID) id: string): Promise<Attribute | null> {
    return AttributeModel.findById(id);
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
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(attribute.name, ctx.req.session!.lang);
  }
}
