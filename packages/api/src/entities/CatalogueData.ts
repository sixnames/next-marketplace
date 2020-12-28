import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Rubric } from './Rubric';
import { Product } from './Product';
import { SortDirectionEnum } from '../resolvers/commonInputs/PaginateInput';
import { CatalogueProductsSortByEnum } from '../resolvers/catalogueData/CatalogueProductsInput';

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

  @Field(() => Int)
  readonly limit: number;

  @Field((_type) => CatalogueProductsSortByEnum)
  readonly sortBy: CatalogueProductsSortByEnum;

  @Field(() => SortDirectionEnum)
  readonly sortDir: SortDirectionEnum;
}

@ObjectType()
export class CatalogueFilterAttributeOption {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => Int)
  readonly counter: number;

  @Field((_type) => String)
  readonly optionNextSlug: string;

  @Field((_type) => Boolean)
  readonly isSelected: boolean;

  @Field((_type) => Boolean)
  readonly isDisabled: boolean;
}

@ObjectType()
export class CatalogueFilterAttribute {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => String)
  readonly clearSlug: string;

  @Field(() => String)
  readonly nameString: string;

  @Field(() => [CatalogueFilterAttributeOption])
  readonly options: CatalogueFilterAttributeOption[];

  @Field((_type) => Boolean)
  readonly isSelected: boolean;

  @Field((_type) => Boolean)
  readonly isDisabled: boolean;
}

@ObjectType()
export class CatalogueFilterSelectedPrices {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => String)
  readonly clearSlug: string;

  @Field((_type) => String)
  readonly formattedMinPrice: string;

  @Field((_type) => String)
  readonly formattedMaxPrice: string;
}

@ObjectType()
export class CatalogueFilter {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [CatalogueFilterAttribute])
  readonly attributes: CatalogueFilterAttribute[];

  @Field(() => [CatalogueFilterAttribute])
  readonly selectedAttributes: CatalogueFilterAttribute[];

  @Field(() => CatalogueFilterSelectedPrices, { nullable: true })
  readonly selectedPrices?: CatalogueFilterSelectedPrices | null;

  @Field((_type) => String)
  readonly clearSlug: string;
}

@ObjectType()
export class CatalogueData {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Rubric)
  readonly rubric: Rubric;

  @Field(() => CatalogueDataProducts)
  readonly products: CatalogueDataProducts;

  @Field(() => String)
  readonly catalogueTitle: string;

  @Field(() => CatalogueFilter)
  readonly catalogueFilter: CatalogueFilter;

  @Field(() => Int)
  readonly minPrice: number;

  @Field(() => Int)
  readonly maxPrice: number;
}

@ObjectType()
export class CatalogueSearchResult {
  @Field(() => [Rubric])
  readonly rubrics: Rubric[];

  @Field(() => [Product])
  readonly products: Product[];
}
