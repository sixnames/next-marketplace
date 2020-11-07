import { Field, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';
import { OptionsGroupVariantEnum } from '../../entities/OptionsGroup';

@InputType()
export class CreateOptionsGroupInput {
  @Field(() => [LangInput])
  name: LangInput[];

  @Field((_type) => OptionsGroupVariantEnum, { nullable: true })
  variant?: OptionsGroupVariantEnum;
}
