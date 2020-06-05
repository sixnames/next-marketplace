import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Attribute } from './Attribute';
import { LanguageType } from './common';

@ObjectType()
export class AttributesGroup {
  @Field((_type) => ID)
  public id: string;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true, _id: false })
  public name: LanguageType[];

  @Field(() => String)
  public nameString: string;

  @Field((_type) => [Attribute])
  @prop({ ref: Attribute })
  public attributes: Ref<Attribute>[];
}

export const AttributesGroupModel = getModelForClass(AttributesGroup);
