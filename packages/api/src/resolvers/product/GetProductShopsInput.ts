import { Field, ID, InputType } from 'type-graphql';
import { SortDirectionEnum } from '../commonInputs/PaginateInput';

@InputType()
export class GetProductShopsInput {
  @Field(() => ID)
  productId: string;

  @Field(() => SortDirectionEnum)
  sortDir?: SortDirectionEnum;

  @Field((_type) => String)
  sortBy?: string;
}
