import { Field, ID, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class UpdateRoleInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => [LangInput])
  name: LangInput[];

  @Field((_type) => String)
  description: string;

  @Field((_type) => Boolean)
  isStuff: boolean;
}
