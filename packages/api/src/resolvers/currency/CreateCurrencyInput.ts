import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateCurrencyInput {
  @Field(() => String)
  nameString: string;
}
