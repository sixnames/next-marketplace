import { Field, InputType, Int, registerEnumType } from 'type-graphql';

export enum SortDirectionEnum {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(SortDirectionEnum, {
  name: 'SortDirectionEnum',
  description: 'sortDir enum',
});

@InputType()
export class PaginateInput {
  @Field(() => Int, { defaultValue: 100, nullable: true })
  limit?: number;

  @Field(() => Int, { defaultValue: 1, nullable: true })
  page?: number;

  @Field(() => SortDirectionEnum, { defaultValue: 'desc', nullable: true })
  sortDir?: SortDirectionEnum;

  @Field({ nullable: true })
  search?: string;
}
