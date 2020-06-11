import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { ATTRIBUTE_TYPES_ENUMS } from '@rg/config';
import { OptionsGroup } from './OptionsGroup';
import { Metric } from './Metric';
import { LanguageType } from './common';
import { autoIncrement } from 'mongoose-plugin-autoinc';

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
@plugin(autoIncrement, {
  model: 'Attribute',
  field: 'itemId',
})
export class Attribute {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => Int)
  readonly itemId: number;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true, _id: false })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => AttributeVariantEnum)
  @prop({ required: true, enum: ATTRIBUTE_TYPES_ENUMS })
  variant: AttributeVariantEnum;

  @Field((_type) => OptionsGroup, { nullable: true })
  @prop({ ref: OptionsGroup })
  options?: string | null;

  @Field((_type) => Metric, { nullable: true })
  @prop({ ref: Metric })
  metric?: string | null;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  slug: string;
}

export const AttributeModel = getModelForClass(Attribute);
