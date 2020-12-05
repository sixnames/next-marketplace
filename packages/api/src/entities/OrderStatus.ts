import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Translation } from './Translation';

@ObjectType()
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class OrderStatus extends TimeStamps {
  @Field(() => ID)
  readonly id: string;
  readonly _id?: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

  @Field(() => String)
  readonly nameString: string;
}

export const OrderStatusModel = getModelForClass(OrderStatus);
