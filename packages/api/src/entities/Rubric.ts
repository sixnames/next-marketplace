import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, index, prop } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { RubricVariant } from './RubricVariant';
import { GenderEnum } from './commonEntities';
import { PaginatedProductsResponse } from '../resolvers/product/ProductResolver';
import { Attribute } from './Attribute';
import { CityCounter } from './CityCounter';
import { Translation } from './Translation';
import { DEFAULT_PRIORITY, GENDER_ENUMS, RUBRIC_LEVEL_ONE } from '@yagu/shared';

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
export class RubricNavItemAttributeOption {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => String)
  readonly slug: string;

  @Field((_type) => Boolean)
  readonly isDisabled: boolean;

  @Field(() => Int)
  readonly counter: number;
}

@ObjectType()
export class RubricNavItemAttribute {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => Boolean)
  readonly isDisabled: boolean;

  @Field(() => [RubricNavItemAttributeOption])
  readonly visibleOptions: RubricNavItemAttributeOption[];

  @Field(() => [RubricNavItemAttributeOption])
  readonly hiddenOptions: RubricNavItemAttributeOption[];

  @Field(() => [RubricNavItemAttributeOption])
  readonly options: RubricNavItemAttributeOption[];
}

@ObjectType()
export class RubricNavItems {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => Boolean)
  readonly isDisabled: boolean;

  @Field(() => [RubricNavItemAttribute])
  readonly attributes: RubricNavItemAttribute[];
}

@ObjectType()
export class RubricCatalogueTitle {
  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  defaultTitle: Translation[];

  @Field(() => [Translation], { nullable: true })
  @prop({ type: Translation })
  prefix?: Translation[];

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  keyword: Translation[];

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

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

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

  @Field(() => RubricNavItems)
  readonly navItems: RubricNavItems;

  @Field(() => PaginatedProductsResponse)
  readonly products: PaginatedProductsResponse;

  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;
}

export const RubricModel = getModelForClass(Rubric);
