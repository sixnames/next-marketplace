import { Field, ID, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateProductInCartInput {
  @Field((_type) => ID)
  shopProductId: string;

  @Field((_type) => Int)
  amount: number;
}
