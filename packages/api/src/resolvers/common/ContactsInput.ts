import { Field, InputType } from 'type-graphql';

@InputType()
export class ContactsInput {
  @Field(() => [String])
  public emails: string[];

  @Field(() => [String])
  public phones: string[];
}
