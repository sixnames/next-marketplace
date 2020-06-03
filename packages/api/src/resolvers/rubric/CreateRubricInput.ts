import { Field, ID, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class CreateRubricInput {
  @Field(() => [LangInput])
  name: LangInput[];

  @Field(() => [LangInput])
  catalogueName: LangInput[];

  @Field(() => ID, { nullable: true })
  parent: string;

  @Field(() => ID, { nullable: true })
  variant: string;
}
