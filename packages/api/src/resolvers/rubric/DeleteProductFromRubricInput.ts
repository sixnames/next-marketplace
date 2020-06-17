import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class DeleteProductFromRubricInput {
  @Field(() => ID)
  rubricId: string;

  @Field(() => ID)
  productId: string;
}
