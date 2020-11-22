import { Field, InputType } from 'type-graphql';
import { SortDirectionEnum } from '../commonInputs/PaginateInput';
import { SORT_ASC } from '@yagu/config';

@InputType()
export class ProductShopsInput {
  @Field(() => SortDirectionEnum, { nullable: true, defaultValue: SORT_ASC })
  sortDir?: SortDirectionEnum;

  @Field((_type) => String, { nullable: true, defaultValue: 'price' })
  sortBy?: string;
}
