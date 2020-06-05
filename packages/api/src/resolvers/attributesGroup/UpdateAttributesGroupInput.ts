import { Field, ID, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class UpdateAttributesGroupInput {
  @Field(() => ID)
  id: string;

  @Field(() => [LangInput])
  name: LangInput[];
}
