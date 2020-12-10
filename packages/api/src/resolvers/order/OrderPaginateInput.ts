import { PaginateInput } from '../commonInputs/PaginateInput';
import { Field, InputType, registerEnumType } from 'type-graphql';

export enum OrderSortByEnum {
  itemId = 'itemId',
  createdAt = 'createdAt',
}

registerEnumType(OrderSortByEnum, {
  name: 'OrderSortByEnum',
  description: 'Order pagination sortBy enum',
});

@InputType()
export class OrderPaginateInput extends PaginateInput {
  @Field((_type) => OrderSortByEnum, { nullable: true, defaultValue: 'createdAt' })
  sortBy?: OrderSortByEnum;
}
