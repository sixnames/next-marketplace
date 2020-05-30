import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class UpdateOptionInGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  optionId: string;

  @Field((_type) => String)
  public name: string;

  @Field((_type) => String, { nullable: true })
  public color: string;
}
