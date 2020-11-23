import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { CartProduct } from './CartProduct';

@ObjectType()
export class Cart {
  @Field((_type) => ID)
  readonly id: string;

  @Field((_type) => [CartProduct])
  @prop({ type: CartProduct, required: true })
  products: CartProduct[];

  @Field((_type) => Int)
  readonly productsCount?: number;

  @Field((_type) => Int)
  readonly totalPrice?: number;

  @Field((_type) => String)
  readonly formattedTotalPrice?: string;
}

export const CartModel = getModelForClass(Cart);
