import { Field, ID, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class UpdateRoleInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => [TranslationInput])
  name: TranslationInput[];

  @Field((_type) => String)
  description: string;

  @Field((_type) => Boolean)
  isStuff: boolean;
}
