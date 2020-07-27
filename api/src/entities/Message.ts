import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { LanguageType } from './common';

@ObjectType()
export class Message {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  key: string;

  @Field(() => [LanguageType])
  @prop({ required: true, type: LanguageType })
  message: LanguageType[];
}

export const MessageModel = getModelForClass(Message);
