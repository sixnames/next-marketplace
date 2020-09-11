import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { OptionsGroup } from './OptionsGroup';
import { Metric } from './Metric';
import { LanguageType } from './common';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANTS_ENUMS,
  DEFAULT_PRIORITY,
} from '../config';
import { prop as Property } from '@typegoose/typegoose/lib/prop';
import { Option } from './Option';

// Attribute variant
export enum AttributeVariantEnum {
  select = 'select',
  multipleSelect = 'multipleSelect',
  string = 'string',
  number = 'number',
}

// Attribute positioning in catalogue title
registerEnumType(AttributeVariantEnum, {
  name: 'AttributeVariantEnum',
  description: 'Attribute variant enum',
});

export enum AttributePositionInTitleEnum {
  begin = 'begin',
  end = 'end',
  beforeKeyword = 'beforeKeyword',
  afterKeyword = 'afterKeyword',
  replaceKeyword = 'replaceKeyword',
}

registerEnumType(AttributePositionInTitleEnum, {
  name: 'AttributePositionInTitleEnum',
  description: 'Instruction for positioning checked attribute values in catalogue title',
});

@ObjectType()
export class AttributePositioningInTitle {
  @Field(() => String)
  @prop({ required: true })
  public key: string;

  @Field(() => AttributePositionInTitleEnum)
  @prop({ required: true, enum: ATTRIBUTE_POSITION_IN_TITLE_ENUMS })
  public value: AttributePositionInTitleEnum;
}

// Option catalogue filter form
@ObjectType()
export class AttributeFilterOption {
  @Field((_type) => Option)
  readonly option: Option;

  @Field((_type) => Int)
  readonly counter: number;
}

@ObjectType()
export class AttributePriority {
  @Field((_type) => String)
  @prop({ required: true, type: String })
  rubricId: string;

  @Field(() => Int, { defaultValue: DEFAULT_PRIORITY })
  @prop({ required: true, default: DEFAULT_PRIORITY, type: Number })
  priority: number;
}

@ObjectType()
export class Attribute {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => String)
  @Property({ required: true })
  slug: string;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;

  @Field(() => [AttributePriority])
  @prop({ type: AttributePriority })
  priorities: AttributePriority[];

  @Field((_type) => AttributeVariantEnum)
  @prop({ required: true, enum: ATTRIBUTE_VARIANTS_ENUMS })
  variant: AttributeVariantEnum;

  @Field((_type) => OptionsGroup, { nullable: true })
  @prop({ ref: OptionsGroup })
  options?: string | null;

  @Field((_type) => [AttributePositioningInTitle], { nullable: true })
  @prop({
    type: AttributePositioningInTitle,
    required: function (this: Attribute) {
      return (
        this.variant === ATTRIBUTE_VARIANT_SELECT ||
        this.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT
      );
    },
  })
  positioningInTitle?: AttributePositioningInTitle[];

  @Field((_type) => Metric, { nullable: true })
  @prop({ ref: Metric })
  metric?: string | null;
}

export const AttributeModel = getModelForClass(Attribute);
