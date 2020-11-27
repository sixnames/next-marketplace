import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './User';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import PaginateType from '../resolvers/commonInputs/PaginateType';
import { PaginatedShopsResponse } from './Shop';
import { Contacts } from './Contacts';
import { Asset } from './Asset';

@ObjectType()
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class Company extends TimeStamps {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  nameString: string;

  @Field((_type) => String)
  @prop({ required: true })
  slug: string;

  @Field((_type) => Asset)
  @prop({ type: Asset, required: true })
  logo: Asset;

  @Field((_type) => User)
  @prop({ ref: () => 'User' })
  owner: string;

  @Field((_type) => [User])
  @prop({ ref: () => 'User' })
  staff: string[];

  @Field((_type) => Contacts)
  @prop({ type: Contacts })
  contacts: Contacts;

  @Field((_type) => PaginatedShopsResponse)
  @prop({ ref: () => 'Shop' })
  shops: string[];

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  static paginate: (
    query?: FilterQuery<Company>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<Company>>;
}

@ObjectType()
export class PaginatedCompaniesResponse extends PaginateType(Company) {}

export const CompanyModel = getModelForClass(Company);
