import { Field, InputType } from 'type-graphql';

@InputType()
export class TranslationInput {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;
}
