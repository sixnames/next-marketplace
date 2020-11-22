import { Field, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class CreateRoleInput {
  @Field((_type) => [TranslationInput])
  name: TranslationInput[];

  @Field((_type) => String)
  description: string;

  @Field((_type) => Boolean)
  isStuff: boolean;
}
