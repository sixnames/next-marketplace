import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class DeleteAttributesGroupFromRubricInput {
  @Field(() => ID)
  rubricId: string;

  @Field(() => ID)
  attributesGroupId: string;
}
