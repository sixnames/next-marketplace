import { PaginateInput } from '../common/PaginateInput';
import { Field, ID, InputType } from 'type-graphql';
import { ProductSortByEnum } from '../product/ProductPaginateInput';

@InputType()
export class RubricProductPaginateInput extends PaginateInput {
  @Field((_type) => ProductSortByEnum, { defaultValue: 'createdAt' })
  sortBy?: ProductSortByEnum;

  @Field((_type) => ID, { nullable: true })
  notInRubric?: string;
}
