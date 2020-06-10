import { PaginateInput } from '../common/PaginateInput';
import { Field, ID, InputType, registerEnumType } from 'type-graphql';

enum ProductSortByEnum {
  price = 'price',
  createdAt = 'createdAt',
}

registerEnumType(ProductSortByEnum, {
  name: 'ProductSortByEnum',
  description: 'Product pagination sortBy enum',
});

@InputType()
export class ProductPaginateInput extends PaginateInput {
  @Field((_type) => ProductSortByEnum, { defaultValue: 'createdAt' })
  sortBy?: ProductSortByEnum;

  @Field((_type) => ID, { nullable: true })
  rubric?: string;

  @Field((_type) => ID, { nullable: true })
  notInRubric?: string;

  @Field((_type) => Boolean, { nullable: true })
  noRubrics?: boolean;
}
