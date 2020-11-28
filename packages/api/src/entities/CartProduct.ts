import { Field, ID, Int, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { ShopProduct } from './ShopProduct';
import { Product } from './Product';

@ObjectType()
export class CartProduct {
  @Field((_type) => ID)
  readonly id?: string;

  @Field((_type) => ID)
  readonly _id?: any;

  @Field((_type) => ShopProduct, { nullable: true })
  @prop({ ref: () => ShopProduct })
  shopProduct?: string;

  @Field((_type) => Product, { nullable: true })
  @prop({ ref: () => Product })
  product?: string;

  @Field(() => Int)
  @prop({ type: Number, required: true })
  amount: number;
}
