import { getModelForClass, index, plugin, prop, pre, DocumentType } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Authorized, Field, ID, ObjectType } from 'type-graphql';
import mongoosePaginate from 'mongoose-paginate-v2';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { OPERATION_TARGET_FIELD, OPERATION_TYPE_READ } from '../config';
import { AuthCheckerConfigInterface } from '../utils/auth/customAuthChecker';
import { Role } from './Role';

@ObjectType()
@plugin(mongoosePaginate)
@pre<User>('save', async function (this: DocumentType<User>) {
  const lastItem = await UserModel.find({}).sort({ itemId: -1 }).limit(1);
  const itemId = lastItem && lastItem[0] ? `${+lastItem[0].itemId + 1}` : '1';
  if (this.isNew) {
    this.itemId = itemId;
  }
})
@index({ '$**': 'text' })
export class User extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  @prop({ required: true, trim: true, default: '1' })
  itemId: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  name: string;

  @Field((_type) => String, { nullable: true })
  @prop({ trim: true })
  lastName?: string;

  @Field((_type) => String, { nullable: true })
  @prop({ trim: true })
  secondName?: string;

  @Authorized<AuthCheckerConfigInterface>([
    {
      entity: 'User',
      operationType: OPERATION_TYPE_READ,
      target: OPERATION_TARGET_FIELD,
    },
  ])
  @Field((_type) => String)
  @prop({ required: true, trim: true })
  email: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  phone: string;

  @prop({ required: true, trim: true })
  password: string;

  @Field((_type) => Role)
  @prop({ ref: Role })
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
