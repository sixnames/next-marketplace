import { Field, InputType } from 'type-graphql';
import { RubricVariant } from '../../entities/RubricVariant';

@InputType()
export class CreateRubricVariantInput implements Partial<RubricVariant> {
  @Field(() => String)
  name: string;
}
