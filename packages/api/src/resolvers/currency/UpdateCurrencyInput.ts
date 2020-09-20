import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateCurrencyInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  nameString: string;
}
