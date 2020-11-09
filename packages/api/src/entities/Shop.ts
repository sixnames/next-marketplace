import { Field, ID, ObjectType } from 'type-graphql';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { AssetType, ContactsType, PointGeoJSON } from './common';
import { Company } from './Company';
import { ShopProduct } from './ShopProduct';

@ObjectType()
export class Shop extends TimeStamps {
  @Field((_type) => ID)
  readonly id: string;

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

  @Field((_type) => [ShopProduct])
  @prop({ ref: ShopProduct, required: true })
  products: string[];

  @Field((_type) => Company)
  readonly company: Company;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}

export const ShopModel = getModelForClass(Shop);
