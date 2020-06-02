import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { RUBRIC_LEVEL_ONE } from '@rg/config';
import { RubricVariant } from './RubricVariant';
import { AttributesGroup } from './AttributesGroup';

@ObjectType()
export class RubricAttributesGroup {
  @Field(() => Boolean)
  @prop({ required: true, default: false })
  public showInCatalogueFilter: boolean;

  @Field(() => AttributesGroup)
  @prop({ ref: AttributesGroup })
  public node: Ref<AttributesGroup>;
}

@ObjectType()
export class Rubric {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  @prop({ required: true, trim: true })
  public name: string;

  @Field(() => String)
  @prop({ required: true, trim: true })
  public catalogueName: string;

  @Field(() => String)
  @prop({ required: true })
  public slug: string;

  @Field(() => Int)
  @prop({ required: true, default: RUBRIC_LEVEL_ONE })
  public level: number;

  @Field(() => Boolean)
  @prop({ required: true, default: true })
  public active: boolean;

  @Field(() => Rubric, { nullable: true })
  @prop({ ref: Rubric })
  public parent: Ref<Rubric> | null;

  @Field(() => Rubric)
  public children: Rubric[];

  @Field(() => [RubricAttributesGroup])
  @prop({ type: RubricAttributesGroup })
  public attributesGroups: RubricAttributesGroup[];

  @Field(() => RubricVariant, { nullable: true })
  @prop({
    ref: RubricVariant,
    required: function (this: Rubric) {
      return this.level === RUBRIC_LEVEL_ONE;
    },
  })
  public variant: Ref<RubricVariant> | null;
}

export const RubricModel = getModelForClass(Rubric);
