import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { AssetType, ContactsType } from './common';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './User';

@ObjectType()
export class Company extends TimeStamps {
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

  @Field(() => User)
  @prop({ ref: User })
  owner: string;

  @Field((_type) => [User])
  @prop({ ref: User })
  staff: string[];

  @Field((_type) => ContactsType)
  @prop({ type: ContactsType })
  contacts: ContactsType;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}

export const CompanyModel = getModelForClass(Company);
