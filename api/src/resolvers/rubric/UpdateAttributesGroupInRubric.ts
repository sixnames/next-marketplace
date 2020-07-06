import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class UpdateAttributesGroupInRubricInput {
  @Field(() => ID)
  rubricId: string;

  @Field(() => ID)
  attributesGroupId: string;

  @Field(() => Boolean, { nullable: true })
  showInCatalogueFilter?: boolean;
}
