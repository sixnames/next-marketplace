import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Translation } from './Translation';

@ObjectType()
export class Message {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  key: string;

  @Field(() => [Translation])
  @prop({ required: true, type: Translation })
  message: Translation[];
}

export const MessageModel = getModelForClass(Message);
