import { Field, ID, InputType } from 'type-graphql';
import { AttributeTypeEnum } from '../../entities/Attribute';

@InputType()
export class AddAttributeToGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => String)
  name: string;

  @Field((_type) => AttributeTypeEnum)
  public type: AttributeTypeEnum;

  @Field((_type) => ID, { nullable: true })
  public options: string;

  @Field((_type) => ID, { nullable: true })
  public metric: string;
}
