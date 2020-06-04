import { Field, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class CreateOptionsGroupInput {
  @Field(() => [LangInput])
  name: LangInput[];
}
