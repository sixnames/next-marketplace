import { Field, InputType, ID } from 'type-graphql';
import { LangInput } from '../common/LangInput';
import { GenderEnum } from '../../entities/common';
import { OptionVariantInput } from './AddOptionToGroupInput';

@InputType()
export class UpdateOptionInGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  optionId: string;

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
