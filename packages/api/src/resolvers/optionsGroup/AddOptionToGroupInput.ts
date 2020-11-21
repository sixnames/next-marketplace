import { Field, InputType, ID } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';
import { GenderEnum } from '../../entities/commonEntities';

@InputType()
export class OptionVariantInput {
  @Field((_type) => GenderEnum)
  key: GenderEnum;

  @Field(() => [TranslationInput])
  value: TranslationInput[];
}

@InputType()
export class AddOptionToGroupInput {
  @Field(() => ID)
  groupId: string;

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
