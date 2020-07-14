import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, prop, prop as Property, Ref } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { RubricVariant } from './RubricVariant';
import { GenderEnum, LanguageType } from './common';
import { PaginatedProductsResponse } from '../resolvers/product/ProductResolver';
import { GENDER_ENUMS, RUBRIC_LEVEL_ONE } from '../config';
import { Attribute } from './Attribute';

@ObjectType()
export class RubricAttributesGroup {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [ID])
  @Property({ type: String })
  showInCatalogueFilter: string[];

  @Field(() => Boolean)
  @Property({ type: Boolean })
  isOwner: boolean;

  @Field(() => AttributesGroup)
  @Property({ ref: AttributesGroup })
  node: string;
}

@ObjectType()
export class RubricCatalogueTitle {
  @Field(() => [LanguageType])
  @Property({ type: LanguageType, required: true })
  defaultTitle: LanguageType[];

  @Field(() => [LanguageType], { nullable: true })
  @Property({ type: LanguageType })
  prefix?: LanguageType[];

  @Field(() => [LanguageType])
  @Property({ type: LanguageType, required: true })
  keyword: LanguageType[];

  @Field((_type) => GenderEnum)
  @prop({ required: true, enum: GENDER_ENUMS, type: String })
  gender: GenderEnum;
}

// Rubric data in current city
@ObjectType()
export class RubricNode {
  @Field(() => [LanguageType])
  @Property({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => RubricCatalogueTitle)
  @Property({ type: RubricCatalogueTitle, required: true })
  catalogueTitle: RubricCatalogueTitle;

  @Field(() => String)
  @Property({ required: true })
  slug: string;

  @Field(() => Int)
  @Property({ required: true, default: RUBRIC_LEVEL_ONE })
  level: number;

  @Field(() => Boolean, { nullable: true })
  @Property({ required: true, default: true })
  active?: boolean;

  @Field(() => Rubric, { nullable: true })
  @Property({ ref: 'Rubric' })
  parent?: Ref<Rubric> | null;

  @Field(() => [RubricAttributesGroup])
  @Property({ type: RubricAttributesGroup })
  attributesGroups: RubricAttributesGroup[];

  @Field(() => RubricVariant, { nullable: true })
  @Property({ ref: RubricVariant })
  variant?: string | null;
}

// Rubric current city
@ObjectType()
export class RubricCity {
  @Field(() => String)
  @Property({ required: true })
  key: string;

  @Field(() => RubricNode)
  @Property({ required: true })
  node: RubricNode;
}

@ObjectType()
export class Rubric {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly slug: string;

  @Field(() => Int)
  readonly level: number;

  @Field(() => Boolean)
  readonly active: boolean;

  @Field(() => Rubric, { nullable: true })
  readonly parent: Rubric | null;

  @Field(() => [Rubric])
  readonly children: Rubric[];

  @Field(() => [RubricAttributesGroup])
  readonly attributesGroups: RubricAttributesGroup[];

  @Field(() => [Attribute])
  readonly filterAttributes: Attribute[];

  @Field(() => RubricVariant, { nullable: true })
  readonly variant: RubricVariant | null;

  @Field(() => PaginatedProductsResponse)
  readonly products: PaginatedProductsResponse;

  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;

  @Field(() => [RubricCity])
  @Property({ type: RubricCity, required: true })
  cities: RubricCity[];
}

export const RubricModel = getModelForClass(Rubric);
