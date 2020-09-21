import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class AddProductToConnectionInput {
  @Field((_type) => String, { description: 'Attribute slug added to the connection as key field.' })
  connectionKey: string;

  @Field((_type) => ID)
  productId: string;

  @Field((_type) => ID)
  addProductId: string;
}
