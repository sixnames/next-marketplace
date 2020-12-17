import { Field, Int, ObjectType } from 'type-graphql';
import { Rubric } from './Rubric';
import { Product } from './Product';

@ObjectType()
export class CatalogueDataProducts {
  @Field(() => [Product])
  readonly docs: Product[];

  @Field(() => Int)
  readonly page: number;

  @Field(() => Int)
  readonly totalDocs: number;

  @Field(() => Int)
  readonly totalPages: number;
}

@ObjectType()
export class CatalogueData {
  @Field(() => Rubric)
  readonly rubric: Rubric;

  @Field(() => CatalogueDataProducts)
  readonly products: CatalogueDataProducts;

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
