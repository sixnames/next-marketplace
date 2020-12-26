import { Field, InputType, registerEnumType } from 'type-graphql';
import { PaginatedAggregationInput } from '../commonInputs/PaginatedAggregationType';
import { SORT_BY_CREATED_AT } from '@yagu/shared';

export enum ManufacturerSortByEnum {
  createdAt = 'createdAt',
}

registerEnumType(ManufacturerSortByEnum, {
  name: 'ManufacturerSortByEnum',
  description: 'Manufacturer pagination sortBy enum',
});

@InputType()
export class ManufacturerPaginateInput extends PaginatedAggregationInput {
  @Field((_type) => ManufacturerSortByEnum, { nullable: true, defaultValue: SORT_BY_CREATED_AT })
  sortBy?: ManufacturerSortByEnum;
}
