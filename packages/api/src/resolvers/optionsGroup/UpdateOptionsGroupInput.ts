import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class UpdateOptionsGroupInput {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
}
