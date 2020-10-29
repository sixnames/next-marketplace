import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class AddProductToConnectionInput {
  @Field((_type) => ID)
  connectionId: string;

  @Field((_type) => ID)
  productId: string;

  @Field((_type) => ID)
  addProductId: string;
}
