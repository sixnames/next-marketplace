import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';

@ObjectType()
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class Brand extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field((_type) => String)
  @prop({ type: String, required: true, trim: true })
  nameString: string;

  @Field((_type) => String)
  @prop({ type: String, required: true, trim: true })
  slug: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  url?: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  description?: string;

  @Field(() => [ID])
  @prop({ type: String })
  collections: string[];

  @Field()
  readonly createdAt?: Date;

  @Field()
  readonly updatedAt?: Date;

  static paginate: (
    query?: FilterQuery<Brand>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<Brand>>;
}

export const BrandModel = getModelForClass(Brand);
