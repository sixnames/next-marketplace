import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Attribute } from './Attribute';
import { LanguageType } from './common';

@ObjectType()
export class AttributesGroup {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => [Attribute])
  @prop({ ref: Attribute })
  attributes: string[];
}

export const AttributesGroupModel = getModelForClass(AttributesGroup);
