import { Field, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class CreateAttributesGroupInput {
  @Field(() => [TranslationInput])
  name: TranslationInput[];
}
