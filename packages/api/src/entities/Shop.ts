import { Field, ID, Int, ObjectType } from 'type-graphql';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { Address, AssetType, ContactsType } from './commonEntities';
import { Company } from './Company';
import { PaginatedShopProductsResponse } from './ShopProduct';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import PaginateType from '../resolvers/common/PaginateType';

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

  @Field(() => AssetType)
  @prop({ type: AssetType, required: true })
  logo: AssetType;

  @Field(() => [AssetType])
  @prop({ type: AssetType, required: true })
  assets: AssetType[];

  @Field((_type) => ContactsType)
  @prop({ type: ContactsType, required: true })
  contacts: ContactsType;

  @Field((_type) => Address)
  @prop({ type: Address, required: true })
  address: Address;

  @Field((_type) => PaginatedShopProductsResponse)
  @prop({ ref: () => 'ShopProduct', required: true })
  products: string[];

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
