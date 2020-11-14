import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class DeleteProductFromShopInput {
  @Field((_type) => ID)
  shopId: string;

  @Field((_type) => ID)
  productId: string;
}
