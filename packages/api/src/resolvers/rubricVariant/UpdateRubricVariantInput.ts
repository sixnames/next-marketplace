import { Field, ID, InputType } from 'type-graphql';
import { RubricVariant } from '../../entities/RubricVariant';
import { LangInput } from '../common/LangInput';

@InputType()
export class UpdateRubricVariantInput implements Partial<RubricVariant> {
  @Field(() => ID)
  id: string;

  @Field(() => [LangInput])
  name: LangInput[];
}
