import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { RubricVariant } from './RubricVariant';
import { RUBRIC_LEVEL_ONE } from '@rg/config';

@ObjectType()
export class RubricAttributesGroup {
  @Field(() => Boolean)
  @prop({ required: true, default: false })
  public showInCatalogueFilter: boolean;

  @Field(() => AttributesGroup)
  @prop({ ref: AttributesGroup })
  public node: Ref<AttributesGroup>;
}

// Rubric data in current city and language
export class RubricNode {
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
  @prop({ ref: 'Rubric' })
  public parent: Ref<Rubric> | null;

  @Field(() => [RubricAttributesGroup])
  @prop({ type: RubricAttributesGroup })
  public attributesGroups: RubricAttributesGroup[];

  @Field(() => [Rubric])
  public children: Rubric[];

  @Field(() => RubricVariant, { nullable: true })
  @prop({ ref: RubricVariant })
  public variant: Ref<RubricVariant> | null;
}

// Rubric language in current city
export class RubricLang {
  @prop({ required: true })
  public key: string;

  @prop({ required: true })
  public node: RubricNode;
}

// Rubric current city
export class RubricCity {
  @Field(() => String)
  @prop({ required: true })
  public key: string;

  @prop({ type: RubricLang, required: true })
  public lang: RubricLang[];
}

@ObjectType()
export class Rubric {
  @Field(() => ID)
  public id: string;

  // Field with data of cities and languages
  @prop({ type: RubricCity, required: true })
  public cities: RubricCity[];
}

export const RubricModel = getModelForClass(Rubric);
