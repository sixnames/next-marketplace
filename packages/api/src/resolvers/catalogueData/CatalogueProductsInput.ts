import { PaginateInput, SortDirectionEnum } from '../commonInputs/PaginateInput';
import { Field, InputType, Int, registerEnumType } from 'type-graphql';
import { CATALOGUE_PRODUCTS_LIMIT, SORT_DESC } from '@yagu/config';

export enum CatalogueProductsSortByEnum {
  price = 'price',
  createdAt = 'createdAt',
  priority = 'priority',
}

registerEnumType(CatalogueProductsSortByEnum, {
  name: 'CatalogueProductsSortByEnum',
  description: 'Product pagination sortBy enum',
});

@InputType()
export class CatalogueProductsInput extends PaginateInput {
  @Field((_type) => CatalogueProductsSortByEnum, { nullable: true, defaultValue: 'priority' })
  sortBy?: CatalogueProductsSortByEnum;

  @Field(() => Int, { defaultValue: CATALOGUE_PRODUCTS_LIMIT, nullable: true })
  limit?: number;

  @Field(() => Int, { defaultValue: 1, nullable: true })
  page?: number;

  @Field(() => SortDirectionEnum, { defaultValue: SORT_DESC, nullable: true })
  sortDir?: SortDirectionEnum;
}
