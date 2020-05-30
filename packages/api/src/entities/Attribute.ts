import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { arrayProp, getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { ATTRIBUTE_TYPES_ENUMS } from '@rg/config';
import { OptionsGroup } from './OptionsGroup';
import { Metric } from './Metric';

export enum AttributeTypeEnum {
  select = 'select',
  multipleSelect = 'multipleSelect',
  string = 'string',
  number = 'number',
}

registerEnumType(AttributeTypeEnum, {
  name: 'AttributeTypeEnum',
  description: 'Attribute type enum',
});

@ObjectType()
export class Attribute {
  @Field((_type) => ID)
  public id: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public name: string;

  @Field((_type) => AttributeTypeEnum)
  @prop({ required: true, enum: ATTRIBUTE_TYPES_ENUMS })
  public type: AttributeTypeEnum;

  @Field((_type) => OptionsGroup, { nullable: true })
  @arrayProp({ ref: OptionsGroup })
  public options: Ref<OptionsGroup>;

  @Field((_type) => Metric, { nullable: true })
  @prop({ ref: Metric })
  public metric: Ref<Metric>;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public slug: string;
}

export const AttributeModel = getModelForClass(Attribute);
