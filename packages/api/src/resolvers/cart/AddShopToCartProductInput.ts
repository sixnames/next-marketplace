import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class AddShopToCartProductInput {
  @Field((_type) => ID)
  cartProductId: string;

  @Field((_type) => ID)
  shopProductId: string;
}
