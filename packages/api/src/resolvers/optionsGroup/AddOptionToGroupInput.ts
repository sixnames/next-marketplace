import { Field, InputType, ID } from 'type-graphql';
import { LangInput } from '../common/LangInput';
import { GenderEnum } from '../../entities/common';

@InputType()
export class OptionVariantInput {
  @Field((_type) => GenderEnum)
  key: GenderEnum;

  @Field(() => [LangInput])
  value: LangInput[];
}

@InputType()
export class AddOptionToGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field((_type) => String, { nullable: true })
  color: string;

  @Field((_type) => String, { nullable: true })
  icon: string;

  @Field((_type) => [OptionVariantInput], { nullable: true })
  variants?: OptionVariantInput[];

  @Field(() => GenderEnum, { nullable: true })
  gender: GenderEnum;
}
