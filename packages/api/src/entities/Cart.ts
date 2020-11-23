import { Field, ID, Int, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { CartProduct } from './CartProduct';

@ObjectType()
export class Cart {
  @Field((_type) => ID)
  readonly id: string;

  @Field((_type) => [CartProduct])
  @prop({ ref: () => CartProduct })
  products: string[];

  @Field((_type) => Int)
  readonly totalPrice?: number;

  @Field((_type) => String)
  readonly formattedTotalPrice?: string;
}
