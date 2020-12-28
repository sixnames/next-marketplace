import { Field, ID, InputType } from 'type-graphql';
import { CreateProductInput } from './CreateProductInput';

@InputType()
export class UpdateProductInput extends CreateProductInput {
  @Field(() => ID)
  id: string;

  @Field(() => Boolean)
  active: boolean;
}
