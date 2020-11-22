import { Field, InputType } from 'type-graphql';
import { RubricVariant } from '../../entities/RubricVariant';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class CreateRubricVariantInput implements Partial<RubricVariant> {
  @Field(() => [TranslationInput])
  name: TranslationInput[];
}
