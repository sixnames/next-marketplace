import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Product } from './Product';
import { Shop } from './Shop';

@ObjectType()
export class ShopProduct {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => Int)
  @prop({ required: true })
  available: number;

  @Field(() => Float)
  @prop({ required: true })
  price: number;

  @Field(() => [Float])
  @prop({ required: true })
  oldPrices: number[];

  @Field((_type) => Product)
  @prop({ ref: Product, required: true })
  product: string;

  @Field((_type) => Shop)
  readonly shop: Shop;
}

export const ShopProductModel = getModelForClass(ShopProduct);
