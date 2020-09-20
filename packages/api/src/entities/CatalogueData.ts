import { Field, ObjectType } from 'type-graphql';
import { Rubric } from './Rubric';
import { PaginatedProductsResponse } from '../resolvers/product/ProductResolver';
import { Product } from './Product';

@ObjectType()
export class CatalogueData {
  @Field(() => Rubric)
  readonly rubric: Rubric;

  @Field(() => PaginatedProductsResponse)
  readonly products: PaginatedProductsResponse;

  @Field(() => String)
  readonly catalogueTitle: string;
}

@ObjectType()
export class CatalogueSearchResult {
  @Field(() => [Rubric])
  readonly rubrics: Rubric[];

  @Field(() => [Product])
  readonly products: Product[];
}
