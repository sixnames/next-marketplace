import { Field, ID, ObjectType } from 'type-graphql';
import { arrayProp, getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Attribute } from './Attribute';

@ObjectType()
export class AttributesGroup {
  @Field((_type) => ID)
  public id: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public name: string;

  @Field((_type) => [Attribute])
  @arrayProp({ ref: Attribute })
  public attributes: Ref<Attribute>[];
}

export const AttributesGroupModel = getModelForClass(AttributesGroup);
