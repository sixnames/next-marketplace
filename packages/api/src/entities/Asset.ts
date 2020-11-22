import { Field, Int, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

@ObjectType()
export class Asset {
  @Field(() => String)
  @prop({ required: true })
  public url: string;

  @Field(() => Int)
  @prop({ required: true })
  public index: number;
}
