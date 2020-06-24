import { Field, ID, InputType } from 'type-graphql';
import { AttributeVariantEnum } from '../../entities/Attribute';
import { LangInput } from '../common/LangInput';

@InputType()
export class AddAttributeToGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field((_type) => AttributeVariantEnum)
  variant: AttributeVariantEnum;

  @Field((_type) => ID, { nullable: true })
  options: string;

  @Field((_type) => ID, { nullable: true })
  metric: string;
}
