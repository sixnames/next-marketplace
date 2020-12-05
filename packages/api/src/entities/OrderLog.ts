import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { User } from './User';
import { prop } from '@typegoose/typegoose';
import { ORDER_LOG_VARIANTS_ENUMS } from '@yagu/config';

// Order log variant
export enum OrderLogVariantEnum {
  status = 'status',
  message = 'message',
}

registerEnumType(OrderLogVariantEnum, {
  name: 'OrderLogVariantEnum',
  description: 'Order log variant enum',
});

@ObjectType()
export class OrderLog {
  @Field(() => ID)
  readonly id: string;
  readonly _id?: string;

  @Field(() => Int)
  @prop({ required: true })
  index: number;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  value: string;

  @Field((_type) => [OrderLogVariantEnum])
  @prop({ required: true, enum: ORDER_LOG_VARIANTS_ENUMS })
  variant: OrderLogVariantEnum[];

  @Field(() => User, { nullable: true })
  @prop({ required: true, ref: User })
  executor: string;

  @Field()
  @prop({ required: true, type: Date })
  readonly createdAt: Date;
}
