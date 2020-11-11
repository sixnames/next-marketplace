import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { AssetType, ContactsType } from './common';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './User';
import { Shop } from './Shop';

@ObjectType()
export class Company extends TimeStamps {
  @Field((_type) => ID)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  nameString: string;

  @Field((_type) => String)
  @prop({ required: true })
  slug: string;

  @Field((_type) => AssetType)
  @prop({ type: AssetType, required: true })
  logo: AssetType;

  @Field((_type) => User)
  @prop({ ref: () => User })
  owner: string;

  @Field((_type) => [User])
  @prop({ ref: () => User })
  staff: string[];

  @Field((_type) => ContactsType)
  @prop({ type: ContactsType })
  contacts: ContactsType;

  @Field((_type) => [Shop])
  @prop({ ref: () => 'Shop' })
  shops: string[];

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}

export const CompanyModel = getModelForClass(Company);
