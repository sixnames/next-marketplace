import { PaginateInput } from '../common/PaginateInput';
import { Field, InputType, registerEnumType } from 'type-graphql';

export enum ShopsSortByEnum {
  company = 'company',
  createdAt = 'createdAt',
}

registerEnumType(ShopsSortByEnum, {
  name: 'ShopsSortByEnum',
  description: 'Shops pagination sortBy enum',
});

@InputType()
export class ShopPaginateInput extends PaginateInput {
  @Field((_type) => ShopsSortByEnum, { nullable: true, defaultValue: 'createdAt' })
  sortBy?: ShopsSortByEnum;
}
