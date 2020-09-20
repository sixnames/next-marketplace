import { Field, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class CreateRoleInput {
  @Field((_type) => [LangInput])
  name: LangInput[];

  @Field((_type) => String)
  description: string;

  @Field((_type) => Boolean)
  isStuff: boolean;
}
