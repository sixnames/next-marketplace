import { Field, InputType, ID } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';
import { OptionsGroupVariantEnum } from '../../entities/OptionsGroup';

@InputType()
export class UpdateOptionsGroupInput {
  @Field(() => ID)
  id: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field((_type) => OptionsGroupVariantEnum, { nullable: true })
  variant?: OptionsGroupVariantEnum;
}
