import { PaginateInput } from '../common/PaginateInput';
import { Field, InputType, registerEnumType } from 'type-graphql';

export enum ShopProductSortByEnum {
  price = 'price',
  createdAt = 'createdAt',
}

registerEnumType(ShopProductSortByEnum, {
  name: 'ShopProductSortByEnum',
  description: 'Shop product pagination sortBy enum',
});

@InputType()
export class ShopProductPaginateInput extends PaginateInput {
  @Field((_type) => ShopProductSortByEnum, { nullable: true, defaultValue: 'createdAt' })
  sortBy?: ShopProductSortByEnum;
}
