import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreateRubricInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  catalogueName: string;

  @Field(() => ID, { nullable: true })
  parent: string;

  @Field(() => ID, { nullable: true })
  variant: string;
}
