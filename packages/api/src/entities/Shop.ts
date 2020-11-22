import { Field, ID, Int, ObjectType } from 'type-graphql';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { Company } from './Company';
import { PaginatedShopProductsResponse } from './ShopProduct';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import PaginateType from '../resolvers/commonInputs/PaginateType';
import { Contacts } from './Contacts';
import { Address } from './Address';
import { Asset } from './Asset';
import { City } from './City';

@ObjectType()
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class Shop extends TimeStamps {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field(() => String)
  @prop({ type: String, required: true })
  nameString: string;

  @Field(() => String)
  @prop({ required: true })
  slug: string;

  @Field(() => City)
  @prop({ required: true })
  city: string;

  @Field(() => Asset)
  @prop({ type: Asset, required: true })
  logo: Asset;

  @Field(() => [Asset])
  @prop({ type: Asset, required: true })
  assets: Asset[];

  @Field((_type) => Contacts)
  @prop({ type: Contacts, required: true })
  contacts: Contacts;

  @Field((_type) => Address)
  @prop({ type: Address, required: true })
  address: Address;

  @Field((_type) => PaginatedShopProductsResponse)
  @prop({ ref: () => 'ShopProduct', required: true })
  products: string[];

  @Field((_type) => Int)
  readonly productsCount: number;

  @Field((_type) => Company)
  readonly company: Company;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  static paginate: (
    query?: FilterQuery<Shop>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<Shop>>;
}

@ObjectType()
export class PaginatedShopsResponse extends PaginateType(Shop) {}

export const ShopModel = getModelForClass(Shop);
