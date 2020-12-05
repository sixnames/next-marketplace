import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Aggregate, FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { OrderStatus } from './OrderStatus';
import { OrderCustomer } from './OrderCustomer';
import { OrderProduct } from './OrderProduct';
import { OrderLog } from './OrderLog';

@ObjectType()
@plugin(mongoosePaginate)
@plugin(aggregatePaginate)
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class Order extends TimeStamps {
  @Field(() => ID)
  readonly id: string;
  readonly _id?: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field(() => OrderStatus)
  @prop({ required: true, ref: OrderStatus })
  status: string;

  @Field(() => OrderCustomer)
  @prop({ required: true, type: OrderCustomer })
  customer: OrderCustomer;

  @Field(() => [OrderProduct])
  @prop({ required: true, type: OrderProduct })
  products: OrderProduct[];

  @Field(() => [OrderLog])
  @prop({ required: true, type: OrderLog })
  logs: OrderLog[];

  @Field(() => Float)
  readonly totalPrice: number;

  @Field(() => String)
  readonly formattedTotalPrice: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  static paginate: (
    query?: FilterQuery<Order>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<Order>>;

  static aggregatePaginate: (
    pipeline?: Aggregate<Order[]>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<Order>>;
}

export const OrderModel = getModelForClass(Order);
