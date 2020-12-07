import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, index, prop } from '@typegoose/typegoose';
import { CartProduct } from './CartProduct';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType()
@index({ createdAt: 1 }, { expires: '7d' })
export class Cart extends TimeStamps {
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

  @Field((_type) => Boolean)
  readonly isWithShopless?: boolean;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}

export const CartModel = getModelForClass(Cart);
