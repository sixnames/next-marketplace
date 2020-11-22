import { Field, InputType, ID } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';
import { GenderEnum } from '../../entities/commonEntities';
import { OptionVariantInput } from './AddOptionToGroupInput';

@InputType()
export class UpdateOptionInGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  optionId: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field((_type) => String, { nullable: true })
  color: string;

  @Field((_type) => String, { nullable: true })
  icon: string;

  @Field((_type) => [OptionVariantInput], { nullable: true })
  variants?: OptionVariantInput[];

  @Field(() => GenderEnum, { nullable: true })
  gender: GenderEnum;
}
