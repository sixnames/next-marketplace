import { Field, ID, InputType } from 'type-graphql';
import { RubricVariant } from '../../entities/RubricVariant';

@InputType()
export class UpdateRubricVariantInput implements Partial<RubricVariant> {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
}
