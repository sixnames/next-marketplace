import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Message } from './Message';

@ObjectType()
export class MessagesGroup {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  name: string;

  @Field((_type) => [Message])
  @prop({ ref: Message })
  messages: string[];
}

export const MessagesGroupModel = getModelForClass(MessagesGroup);
