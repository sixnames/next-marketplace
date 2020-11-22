import { Field, ID, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';
import { GenderEnum } from '../../entities/commonEntities';

@InputType()
export class RubricCatalogueTitleInput {
  @Field((_type) => [TranslationInput])
  defaultTitle: TranslationInput[];

  @Field((_type) => [TranslationInput], { nullable: true })
  prefix?: TranslationInput[];

  @Field((_type) => [TranslationInput])
  keyword: TranslationInput[];

  @Field((_type) => GenderEnum)
  gender: GenderEnum;
}

@InputType()
export class CreateRubricInput {
  @Field((_type) => [TranslationInput])
  name: TranslationInput[];

  @Field((_type) => ID, { nullable: true })
  parent?: string;

  @Field((_type) => ID)
  variant: string;

  @Field((_type) => RubricCatalogueTitleInput)
  catalogueTitle: RubricCatalogueTitleInput;
}
