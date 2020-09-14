import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, index, prop } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { RubricVariant } from './RubricVariant';
import { CityCounter, GenderEnum, LanguageType } from './common';
import { PaginatedProductsResponse } from '../resolvers/product/ProductResolver';
import { DEFAULT_PRIORITY, GENDER_ENUMS, RUBRIC_LEVEL_ONE } from '../config';
import { Attribute } from './Attribute';
import { Option } from './Option';

@ObjectType()
export class RubricAttributesGroup {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [ID])
  @prop({ ref: Attribute })
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

@ObjectType()
@index({ '$**': 'text' })
export class Rubric {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [CityCounter])
  @prop({ type: CityCounter, required: true })
  views: CityCounter[];

  @Field(() => [CityCounter])
  @prop({ type: CityCounter, required: true })
  priorities: CityCounter[];

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => RubricCatalogueTitle)
  @prop({ type: RubricCatalogueTitle, required: true })
  catalogueTitle: RubricCatalogueTitle;

  @Field(() => String)
  @prop({ required: true })
  slug: string;

  @Field(() => Int, { defaultValue: DEFAULT_PRIORITY })
  @prop({ required: true, default: DEFAULT_PRIORITY, type: Number })
  priority: number;

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

  @Field(() => String)
  readonly nameString: string;

  @Field(() => RubricCatalogueTitleField)
  readonly catalogueTitleString: RubricCatalogueTitleField;

  @Field(() => [Rubric])
  readonly children: Rubric[];

  @Field(() => [RubricFilterAttribute])
  readonly filterAttributes: RubricFilterAttribute[];

  @Field(() => PaginatedProductsResponse)
  readonly products: PaginatedProductsResponse;

  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;
}

export const RubricModel = getModelForClass(Rubric);
