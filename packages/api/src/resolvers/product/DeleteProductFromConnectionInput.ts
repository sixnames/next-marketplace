import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class DeleteProductFromConnectionInput {
  @Field((_type) => ID)
  connectionId: string;

  @Field((_type) => ID)
  productId: string;

  @Field((_type) => ID)
  deleteProductId: string;
}
