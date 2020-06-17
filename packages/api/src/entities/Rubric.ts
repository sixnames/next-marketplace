import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { RubricVariant } from './RubricVariant';
import { RUBRIC_LEVEL_ONE } from '@rg/config';
import { LanguageType } from './common';
import { Product } from './Product';
import { PaginatedProductsResponse } from '../resolvers/product/ProductResolver';

@ObjectType()
export class RubricAttributesGroup {
  @Field(() => Boolean)
  @prop({ required: true, default: false })
  showInCatalogueFilter: boolean;

  @Field(() => AttributesGroup)
  @prop({ ref: AttributesGroup })
  node: string;
}

// Rubric data in current city
@ObjectType()
export class RubricNode {
  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true, _id: false })
  name: LanguageType[];

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true, _id: false })
  catalogueName: LanguageType[];

  @Field(() => String)
  @prop({ required: true })
  slug: string;

  @Field(() => Int)
  @prop({ required: true, default: RUBRIC_LEVEL_ONE })
  level: number;

  @Field(() => Boolean, { nullable: true })
  @prop({ required: true, default: true })
  active?: boolean;

  @Field(() => Rubric, { nullable: true })
  @prop({ ref: 'Rubric' })
  parent?: string | null;

  @Field(() => [RubricAttributesGroup])
  @prop({ type: RubricAttributesGroup })
  attributesGroups: RubricAttributesGroup[];

  @Field(() => RubricVariant, { nullable: true })
  @prop({ ref: RubricVariant })
  variant?: string | null;

  @Field(() => [Product])
  @prop({ ref: Product })
  products?: string[];
}

// Rubric current city
@ObjectType()
export class RubricCity {
  @Field(() => String)
  @prop({ required: true })
  key: string;

  @Field(() => RubricNode)
  @prop({ required: true, _id: false })
  node: RubricNode;
}

@ObjectType()
export class Rubric {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly catalogueName: string;

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

  @Field(() => RubricVariant, { nullable: true })
  readonly variant: RubricVariant | null;

  @Field(() => PaginatedProductsResponse)
  readonly products: PaginatedProductsResponse;

  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;

  @Field(() => [RubricCity])
  @prop({ type: RubricCity, required: true, _id: false })
  cities: RubricCity[];
}

export const RubricModel = getModelForClass(Rubric);
