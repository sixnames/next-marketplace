import { Field, InputType } from 'type-graphql';

@InputType()
export class LangInput {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;
}
