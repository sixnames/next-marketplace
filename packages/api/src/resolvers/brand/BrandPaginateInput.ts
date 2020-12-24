import { Field, InputType, registerEnumType } from 'type-graphql';
import { PaginatedAggregationInput } from '../commonInputs/PaginatedAggregationType';
import { SORT_BY_CREATED_AT } from '@yagu/shared';

export enum BrandSortByEnum {
  createdAt = 'createdAt',
}

registerEnumType(BrandSortByEnum, {
  name: 'BrandSortByEnum',
  description: 'Brand pagination sortBy enum',
});

@InputType()
export class BrandPaginateInput extends PaginatedAggregationInput {
  @Field((_type) => BrandSortByEnum, { nullable: true, defaultValue: SORT_BY_CREATED_AT })
  sortBy?: BrandSortByEnum;
}
