import { Field, InputType } from 'type-graphql';
import { RubricVariant } from '../../entities/RubricVariant';
import { LangInput } from '../common/LangInput';

@InputType()
export class CreateRubricVariantInput implements Partial<RubricVariant> {
  @Field(() => [LangInput])
  name: LangInput[];
}
