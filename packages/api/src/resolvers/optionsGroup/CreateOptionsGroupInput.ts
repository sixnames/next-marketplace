import { Field, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';
import { OptionsGroupVariantEnum } from '../../entities/OptionsGroup';

@InputType()
export class CreateOptionsGroupInput {
  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field((_type) => OptionsGroupVariantEnum, { nullable: true })
  variant?: OptionsGroupVariantEnum;
}
