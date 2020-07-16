import { Field, ID, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';
import { RubricCatalogueTitleInput } from './CreateRubricInput';

@InputType()
export class UpdateRubricInput {
  @Field(() => ID)
  id: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field((_type) => RubricCatalogueTitleInput)
  catalogueTitle: RubricCatalogueTitleInput;

  @Field(() => ID, { nullable: true })
  parent: string;

  @Field(() => ID, { nullable: true })
  variant?: string;
}
