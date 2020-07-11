import { Field, ObjectType } from 'type-graphql';
import { Rubric } from './Rubric';
import { PaginatedProductsResponse } from '../resolvers/product/ProductResolver';

@ObjectType()
export class CatalogueData {
  @Field(() => Rubric)
  readonly rubric: Rubric;

  @Field(() => PaginatedProductsResponse)
  readonly products: PaginatedProductsResponse;
}
