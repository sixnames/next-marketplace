import { Field, ID, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';
import { RubricCatalogueTitleInput } from './CreateRubricInput';

@InputType()
export class UpdateRubricInput {
  @Field(() => ID)
  id: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field((_type) => RubricCatalogueTitleInput)
  catalogueTitle: RubricCatalogueTitleInput;

  @Field(() => ID, { nullable: true })
  parent: string;

  @Field(() => ID)
  variant: string;
}
