import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { ATTRIBUTE_TYPES_ENUMS } from '@rg/config';
import { OptionsGroup } from './OptionsGroup';
import { Metric } from './Metric';
import { LanguageType } from './common';

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
export class Attribute {
  @Field((_type) => ID)
  public id: string;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true, _id: false })
  public name: LanguageType[];

  @Field(() => String)
  public nameString: string;

  @Field((_type) => AttributeVariantEnum)
  @prop({ required: true, enum: ATTRIBUTE_TYPES_ENUMS })
  public variant: AttributeVariantEnum;

  @Field((_type) => OptionsGroup, { nullable: true })
  @prop({ ref: OptionsGroup })
  public options: Ref<OptionsGroup>;

  @Field((_type) => Metric, { nullable: true })
  @prop({ ref: Metric })
  public metric: Ref<Metric>;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public slug: string;
}

export const AttributeModel = getModelForClass(Attribute);
