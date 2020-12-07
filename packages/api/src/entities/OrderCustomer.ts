import { Field, ID, Int, ObjectType } from 'type-graphql';
import { User } from './User';
import { prop } from '@typegoose/typegoose';
import { FormattedPhone } from './FormattedPhone';

@ObjectType()
export class OrderCustomer {
  @Field(() => ID)
  readonly id: string;
  readonly _id?: string;

  @Field(() => Int)
  @prop({ required: true })
  itemId: number;

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

  @Field(() => User, { nullable: true })
  @prop({ required: true, ref: User })
  user: string;

  @Field((_type) => FormattedPhone)
  readonly formattedPhone?: FormattedPhone;
}
