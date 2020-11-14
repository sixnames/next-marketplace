import { Field, ID, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateShopProductInput {
  @Field((_type) => ID)
  productId: string;

  @Field((_type) => Int)
  price: number;

  @Field((_type) => Int)
  available: number;
}
