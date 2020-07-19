import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateLanguageInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  key: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  nativeName: string;
}
