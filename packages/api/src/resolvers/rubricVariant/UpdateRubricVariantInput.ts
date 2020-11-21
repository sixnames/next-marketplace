import { Field, ID, InputType } from 'type-graphql';
import { RubricVariant } from '../../entities/RubricVariant';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class UpdateRubricVariantInput implements Partial<RubricVariant> {
  @Field(() => ID)
  id: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];
}
