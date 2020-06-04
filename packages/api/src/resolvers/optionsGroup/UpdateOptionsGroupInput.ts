import { Field, InputType, ID } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class UpdateOptionsGroupInput {
  @Field(() => ID)
  id: string;

  @Field(() => [LangInput])
  name: LangInput[];
}
