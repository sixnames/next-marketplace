import { Field, InputType, ID } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class UpdateOptionInGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  optionId: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field((_type) => String, { nullable: true })
  public color: string;
}
