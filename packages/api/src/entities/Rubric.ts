import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { RubricVariant } from './RubricVariant';
import { RUBRIC_LEVEL_ONE } from '@rg/config';
import { LanguageType } from './common';

@ObjectType()
export class RubricAttributesGroup {
  @Field(() => Boolean)
  @prop({ required: true, default: false })
  public showInCatalogueFilter: boolean;

  @Field(() => AttributesGroup)
  @prop({ ref: AttributesGroup })
  public node: Ref<AttributesGroup>;
}

// Rubric data in current city
@ObjectType()
export class RubricNode {
  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true, _id: false })
  public name: LanguageType[];

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true, _id: false })
  public catalogueName: LanguageType[];

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
  @prop({ ref: 'Rubric' })
  public parent: Ref<Rubric> | null;

  @Field(() => [RubricAttributesGroup])
  @prop({ type: RubricAttributesGroup })
  public attributesGroups: RubricAttributesGroup[];

  @Field(() => RubricVariant, { nullable: true })
  @prop({ ref: RubricVariant })
  public variant: Ref<RubricVariant> | null;
}

// Rubric current city
@ObjectType()
export class RubricCity {
  @Field(() => String)
  @prop({ required: true })
  public key: string;

  @Field(() => RubricNode)
  @prop({ required: true, _id: false })
  public node: RubricNode;
}

@ObjectType()
export class Rubric {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public name: string;

  @Field(() => String)
  public catalogueName: string;

  @Field(() => String)
  public slug: string;

  @Field(() => Int)
  public level: number;

  @Field(() => Boolean)
  public active: boolean;

  @Field(() => Rubric, { nullable: true })
  public parent: Rubric | null;

  @Field(() => [Rubric])
  public children: Rubric[];

  @Field(() => [RubricAttributesGroup])
  public attributesGroups: RubricAttributesGroup[];

  @Field(() => RubricVariant, { nullable: true })
  public variant: RubricVariant | null;

  @Field(() => [RubricCity])
  @prop({ type: RubricCity, required: true, _id: false })
  public cities: RubricCity[];
}

export const RubricModel = getModelForClass(Rubric);
