import { Field, ID, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class UpdateAttributesGroupInput {
  @Field(() => ID)
  id: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];
}
