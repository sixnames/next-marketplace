import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateOptionsGroupInput {
  @Field(() => String)
  name: string;
}
