import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateLanguageInput {
  @Field(() => String)
  key: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  nativeName: string;
}
