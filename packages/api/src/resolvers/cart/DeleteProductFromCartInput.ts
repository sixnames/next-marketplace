import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class DeleteProductFromCartInput {
  @Field((_type) => ID)
  cartProductId: string;
}
