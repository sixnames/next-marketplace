import { ClassType, Field, Int, ObjectType } from 'type-graphql';

export default function PaginateType<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field((_type) => [TItemClass])
    docs: TItem[];

    @Field(() => Int)
    totalDocs: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int, { nullable: true })
    page?: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Int, { nullable: true })
    nextPage?: number | null;

    @Field(() => Int, { nullable: true })
    prevPage?: number | null;

    @Field(() => Int)
    pagingCounter: number;

    @Field(() => Int)
    hasPrevPage: boolean;

    @Field(() => Int)
    hasNextPage: boolean;
  }

  return PaginatedResponseClass;
}
