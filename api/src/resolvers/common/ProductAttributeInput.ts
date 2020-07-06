import { Field, ID, InputType, Int } from 'type-graphql';

@InputType()
export class ProductAttributeInput {
  @Field(() => Boolean)
  showInCard: boolean;

  @Field(() => ID)
  node: string;

  @Field(() => Int, { description: 'Attribute reference via attribute itemId field' })
  key: number;

  @Field(() => [String])
  value: string[];
}
