import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateConfigInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => [String])
  value: string[];
}
