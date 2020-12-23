import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';

@ObjectType()
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class BrandCollection extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  name: string;

  @Field()
  readonly createdAt?: Date;

  @Field()
  readonly updatedAt?: Date;

  static paginate: (
    query?: FilterQuery<BrandCollection>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<BrandCollection>>;
}

export const BrandModel = getModelForClass(BrandCollection);
