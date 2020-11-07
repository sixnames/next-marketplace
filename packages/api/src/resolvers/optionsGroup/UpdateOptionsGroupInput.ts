import { Field, InputType, ID } from 'type-graphql';
import { LangInput } from '../common/LangInput';
import { OptionsGroupVariantEnum } from '../../entities/OptionsGroup';

@InputType()
export class UpdateOptionsGroupInput {
  @Field(() => ID)
  id: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field((_type) => OptionsGroupVariantEnum, { nullable: true })
  variant?: OptionsGroupVariantEnum;
}
