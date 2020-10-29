import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class ProductsCountersInput {
  @Field((_type) => ID, { nullable: true })
  rubric?: string;

  @Field((_type) => ID, { nullable: true })
  notInRubric?: string;

  @Field((_type) => Boolean, { nullable: true })
  noRubrics?: boolean;

  @Field((_type) => [ID], { nullable: true })
  excludedProductsIds?: string[];
}
