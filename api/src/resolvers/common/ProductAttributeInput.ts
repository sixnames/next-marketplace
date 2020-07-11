import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class ProductAttributeInput {
  @Field(() => Boolean)
  showInCard: boolean;

  @Field(() => ID)
  node: string;

  @Field(() => String, { description: 'Attribute reference via attribute slug field' })
  key: string;

  @Field(() => [String])
  value: string[];
}
