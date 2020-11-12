import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { Product } from './Product';
import { Shop } from './Shop';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import PaginateType from '../resolvers/common/PaginateType';

@ObjectType()
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class ShopProduct extends TimeStamps {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field(() => Int)
  @prop({ required: true })
  available: number;

  @Field(() => Float)
  @prop({ required: true })
  price: number;

  @Field(() => [Float])
  @prop({ type: Number, required: true })
  oldPrices: number[];

  @Field((_type) => Product)
  @prop({ ref: Product, required: true })
  product: string;

  @Field((_type) => Shop)
  readonly shop: Shop;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  static paginate: (
    query?: FilterQuery<ShopProduct>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<ShopProduct>>;
}

@ObjectType()
export class PaginatedShopProductsResponse extends PaginateType(ShopProduct) {}

export const ShopProductModel = getModelForClass(ShopProduct);
