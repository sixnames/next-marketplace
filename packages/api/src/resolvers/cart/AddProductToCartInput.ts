import { Field, ID, InputType, Int } from 'type-graphql';

@InputType()
export class AddProductToCartInput {
  @Field((_type) => ID)
  shopProductId: string;

  @Field((_type) => Int)
  amount: number;
}
