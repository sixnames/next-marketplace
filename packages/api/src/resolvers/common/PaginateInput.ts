import { Field, InputType, Int, registerEnumType } from 'type-graphql';

enum PaginateSortDirectionEnum {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(PaginateSortDirectionEnum, {
  name: 'PaginateSortDirectionEnum',
  description: 'Pagination sortDir enum',
});

@InputType()
export class PaginateInput {
  @Field(() => Int, { defaultValue: 100, nullable: true })
  limit?: number;

  @Field(() => Int, { defaultValue: 1, nullable: true })
  page?: number;

  @Field(() => PaginateSortDirectionEnum, { defaultValue: 'desc', nullable: true })
  sortDir?: PaginateSortDirectionEnum;

  @Field({ nullable: true })
  query?: string;
}
