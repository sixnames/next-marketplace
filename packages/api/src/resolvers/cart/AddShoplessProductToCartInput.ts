import { Field, ID, InputType, Int } from 'type-graphql';

@InputType()
export class AddShoplessProductToCartInput {
  @Field((_type) => ID)
  productId: string;

  @Field((_type) => Int)
  amount: number;
}
