import { Field, ID, ObjectType } from 'type-graphql';
import { RubricAttributesGroup } from './Rubric';

@ObjectType()
export class FeaturesASTOption {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly nameString: string;

  @Field(() => [RubricAttributesGroup])
  readonly attributesGroups: RubricAttributesGroup[];
}
