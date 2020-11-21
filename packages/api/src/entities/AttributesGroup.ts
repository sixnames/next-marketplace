import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Attribute } from './Attribute';
import { Translation } from './Translation';

@ObjectType()
export class AttributesGroup {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => [Attribute])
  @prop({ ref: Attribute })
  attributes: string[];
}

export const AttributesGroupModel = getModelForClass(AttributesGroup);
