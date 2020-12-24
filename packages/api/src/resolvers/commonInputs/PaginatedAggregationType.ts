import { ClassType, Field, InputType, Int, ObjectType } from 'type-graphql';
import { SortDirectionNumEnum } from './PaginateInput';
import { PAGE_DEFAULT, PAGINATION_DEFAULT_LIMIT, SORT_DESC_NUM } from '@yagu/shared';

@InputType()
export class PaginatedAggregationInput {
  @Field(() => Int, { nullable: true, defaultValue: PAGINATION_DEFAULT_LIMIT })
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: PAGE_DEFAULT })
  page?: number;

  @Field(() => SortDirectionNumEnum, { nullable: true, defaultValue: SORT_DESC_NUM })
  sortDir: SortDirectionNumEnum;
}

export default function PaginatedAggregationType<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field((_type) => [TItemClass])
    docs: TItem[];

    @Field(() => String)
    sortBy: string;

    @Field(() => SortDirectionNumEnum)
    sortDir: SortDirectionNumEnum;

    @Field(() => Int)
    totalDocs: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int, { nullable: true })
    page?: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Boolean)
    hasPrevPage: boolean;

    @Field(() => Boolean)
    hasNextPage: boolean;
  }

  return PaginatedResponseClass;
}
