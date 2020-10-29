import { PaginateInput } from '../common/PaginateInput';
import { Field, ID, InputType } from 'type-graphql';
import { ProductSortByEnum } from '../product/ProductPaginateInput';

@InputType()
export class RubricProductAttributesFilterInput {
  @Field((_type) => String)
  key: string;

  @Field((_type) => [String])
  value: string[];
}

@InputType()
export class RubricProductPaginateInput extends PaginateInput {
  @Field((_type) => ProductSortByEnum, { defaultValue: 'createdAt' })
  sortBy?: ProductSortByEnum;

  @Field((_type) => ID, { nullable: true })
  notInRubric?: string;

  @Field((_type) => Boolean, { nullable: true })
  active?: boolean;

  @Field((_type) => [ID], { nullable: true })
  excludedProductsIds?: string[];

  @Field((_type) => [RubricProductAttributesFilterInput], { nullable: true })
  attributes?: RubricProductAttributesFilterInput[];
}
