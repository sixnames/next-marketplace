import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { OptionsGroup } from './OptionsGroup';
import { Metric } from './Metric';
import { LanguageType } from './common';
import { ATTRIBUTE_TYPES_ENUMS } from '../config';
import { prop as Property } from '@typegoose/typegoose/lib/prop';
import { Option } from './Option';

export enum AttributeVariantEnum {
  select = 'select',
  multipleSelect = 'multipleSelect',
  string = 'string',
  number = 'number',
}

registerEnumType(AttributeVariantEnum, {
  name: 'AttributeVariantEnum',
  description: 'Attribute type enum',
});

@ObjectType()
export class AttributeFilterOption {
  @Field((_type) => Option)
  readonly option: Option;

  @Field((_type) => Int)
  readonly counter: number;
}

@ObjectType()
export class Attribute {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => String)
  @Property({ required: true })
  slug: string;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => AttributeVariantEnum)
  @prop({ required: true, enum: ATTRIBUTE_TYPES_ENUMS })
  variant: AttributeVariantEnum;

  @Field((_type) => OptionsGroup, { nullable: true })
  @prop({ ref: OptionsGroup })
  options?: string | null;

  @Field((_type) => [AttributeFilterOption], {
    description: 'list of options with products counter for catalogue filter',
  })
  readonly filterOptions: AttributeFilterOption[];

  @Field((_type) => Metric, { nullable: true })
  @prop({ ref: Metric })
  metric?: string | null;
}

export const AttributeModel = getModelForClass(Attribute);
