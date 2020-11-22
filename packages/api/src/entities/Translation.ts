import { Field, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

@ObjectType()
export class Translation {
  @Field(() => String)
  @prop({ required: true })
  public key: string;

  @Field(() => String)
  @prop({ required: true })
  public value: string;
}
