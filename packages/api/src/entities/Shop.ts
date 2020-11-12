import { Field, ID, Int, ObjectType } from 'type-graphql';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { AssetType, ContactsType, PointGeoJSON } from './common';
import { Company } from './Company';
import { PaginatedShopProductsResponse, ShopProduct } from './ShopProduct';
import mongoosePaginate from 'mongoose-paginate-v2';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';

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

  @Field((_type) => PointGeoJSON)
  @prop({ type: PointGeoJSON, required: true })
  address: PointGeoJSON;

  @Field((_type) => PaginatedShopProductsResponse)
  @prop({ ref: ShopProduct, required: true })
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

export const ShopModel = getModelForClass(Shop);
