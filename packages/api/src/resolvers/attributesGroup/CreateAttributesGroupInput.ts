import { Field, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class CreateAttributesGroupInput {
  @Field(() => [LangInput])
  name: LangInput[];
}
