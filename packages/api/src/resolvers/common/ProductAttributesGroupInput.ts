import { Field, ID, InputType } from 'type-graphql';
import { ProductAttributeInput } from './ProductAttributeInput';

@InputType()
export class ProductAttributesGroupInput {
  @Field(() => Boolean)
  showInCard: boolean;

  @Field(() => ID)
  node: string;

  @Field(() => [ProductAttributeInput])
  attributes: ProductAttributeInput[];
}
