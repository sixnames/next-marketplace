import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class AddProductToRubricInput {
  @Field(() => ID)
  rubricId: string;

  @Field(() => ID)
  productId: string;
}
