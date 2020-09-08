import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { RubricVariant } from './RubricVariant';
import { GenderEnum, LanguageType } from './common';
import { PaginatedProductsResponse } from '../resolvers/product/ProductResolver';
import { GENDER_ENUMS, RUBRIC_LEVEL_ONE } from '../config';
import { Attribute } from './Attribute';
import { Option } from './Option';

@ObjectType()
export class RubricAttributesGroup {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [ID])
  @prop({ type: String })
  showInCatalogueFilter: string[];

  @Field(() => Boolean)
  @prop({ type: Boolean })
  isOwner: boolean;

  @Field(() => AttributesGroup)
  @prop({ ref: AttributesGroup })
  node: string;
}

@ObjectType()
export class RubricFilterAttributeOption extends Option {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => Int)
  readonly counter: number;
}

@ObjectType()
export class RubricFilterAttribute {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Attribute)
  readonly node: Attribute;

  @Field(() => [RubricFilterAttributeOption])
  readonly options: RubricFilterAttributeOption[];
}

@ObjectType()
export class RubricCatalogueTitle {
  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  defaultTitle: LanguageType[];

  @Field(() => [LanguageType], { nullable: true })
  @prop({ type: LanguageType })
  prefix?: LanguageType[];

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  keyword: LanguageType[];

  @Field((_type) => GenderEnum)
  @prop({ required: true, enum: GENDER_ENUMS, type: String })
  gender: GenderEnum;
}

@ObjectType()
export class RubricCatalogueTitleField {
  @Field(() => String)
  readonly defaultTitle: string;

  @Field(() => String, { nullable: true })
  readonly prefix?: string | null;

  @Field(() => String)
  readonly keyword: string;

  @Field((_type) => GenderEnum)
  readonly gender: GenderEnum;
}

// Rubric data in current city
@ObjectType()
export class RubricNode {
  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => RubricCatalogueTitle)
  @prop({ type: RubricCatalogueTitle, required: true })
  catalogueTitle: RubricCatalogueTitle;

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

  @Field(() => RubricVariant)
  @prop({ ref: RubricVariant })
  variant: string;
}

// Rubric current city
@ObjectType()
export class RubricCity {
  @Field(() => String)
  @prop({ required: true })
  key: string;

  @Field(() => RubricNode)
  @prop({ required: true })
  node: RubricNode;
}

@ObjectType()
export class Rubric {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly nameString: string;

  @Field(() => [LanguageType])
  readonly name: LanguageType[];

  @Field(() => RubricCatalogueTitle)
  readonly catalogueTitle: RubricCatalogueTitle;

  @Field(() => RubricCatalogueTitleField)
  readonly catalogueTitleString: RubricCatalogueTitleField;

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

  @Field(() => [RubricFilterAttribute])
  readonly filterAttributes: RubricFilterAttribute[];

  @Field(() => RubricVariant)
  readonly variant: RubricVariant;

  @Field(() => PaginatedProductsResponse)
  readonly products: PaginatedProductsResponse;

  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;

  @Field(() => [RubricCity])
  @prop({ type: RubricCity, required: true })
  cities: RubricCity[];
}

export const RubricModel = getModelForClass(Rubric);
