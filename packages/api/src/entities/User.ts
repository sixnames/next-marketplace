import { getModelForClass, index, plugin, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { ROLE_CUSTOMER, ROLES_ENUM } from '@rg/config';
import mongoosePaginate from 'mongoose-paginate-v2';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';

@ObjectType()
@plugin(mongoosePaginate)
@plugin(autoIncrement, {
  model: 'User',
  field: 'itemId',
})
@index({ '$**': 'text' })
export class User extends TimeStamps {
  @Field(() => ID)
  public id: string;

  @Field(() => Int)
  public itemId: number;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public name: string;

  @Field((_type) => String, { nullable: true })
  @prop({ trim: true })
  public lastName: string;

  @Field((_type) => String, { nullable: true })
  @prop({ trim: true })
  public secondName: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public email: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public phone: string;

  @prop({ required: true, trim: true })
  public password: string;

  @Field((_type) => String)
  @prop({ required: true, default: ROLE_CUSTOMER, enum: ROLES_ENUM })
  public role: string;

  @Field((_type) => String)
  public fullName: string;

  @Field((_type) => String)
  public shortName: string;

  static paginate: (
    query?: FilterQuery<User>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<User>>;
}

export const UserModel = getModelForClass(User);
