import { getModelForClass, index, plugin, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import mongoosePaginate from 'mongoose-paginate-v2';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { ROLES_ENUM } from '../config';

@ObjectType()
@plugin(mongoosePaginate)
@plugin(autoIncrement, {
  model: 'User',
  field: 'itemId',
})
@index({ '$**': 'text' })
export class User extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Int)
  readonly itemId: number;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  name: string;

  @Field((_type) => String, { nullable: true })
  @prop({ trim: true })
  lastName?: string;

  @Field((_type) => String, { nullable: true })
  @prop({ trim: true })
  secondName?: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  email: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  phone: string;

  @prop({ required: true, trim: true })
  password: string;

  @Field((_type) => String)
  @prop({ required: true, enum: ROLES_ENUM })
  role: string;

  @Field((_type) => String)
  readonly fullName: string;

  @Field((_type) => String)
  readonly shortName: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  static paginate: (
    query?: FilterQuery<User>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<User>>;
}

export const UserModel = getModelForClass(User);
