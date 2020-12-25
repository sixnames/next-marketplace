import { Field, InputType, registerEnumType } from 'type-graphql';
import { PaginatedAggregationInput } from '../commonInputs/PaginatedAggregationType';
import { SORT_BY_CREATED_AT } from '@yagu/shared';

export enum BrandCollectionSortByEnum {
  createdAt = 'createdAt',
}

registerEnumType(BrandCollectionSortByEnum, {
  name: 'BrandCollectionSortByEnum',
  description: 'Brand pagination sortBy enum',
});

@InputType()
export class BrandCollectionPaginateInput extends PaginatedAggregationInput {
  @Field((_type) => BrandCollectionSortByEnum, { nullable: true, defaultValue: SORT_BY_CREATED_AT })
  sortBy?: BrandCollectionSortByEnum;
}
