import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class ProductsCounters {
  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;
}
