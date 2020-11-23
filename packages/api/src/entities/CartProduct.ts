import { Field, ID, Int, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { ShopProduct } from './ShopProduct';

@ObjectType()
export class CartProduct {
  @Field((_type) => ID)
  readonly id?: string;

  @Field((_type) => ShopProduct)
  @prop({ ref: () => ShopProduct })
  shopProduct: string;

  @Field(() => Int)
  @prop({ type: Number, required: true })
  amount: number;
}
