import { Field, ID, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';
import { GenderEnum } from '../../entities/common';

@InputType()
export class RubricCatalogueTitleInput {
  @Field((_type) => [LangInput])
  defaultTitle: LangInput[];

  @Field((_type) => [LangInput], { nullable: true })
  prefix?: LangInput[];

  @Field((_type) => [LangInput])
  keyword: LangInput[];

  @Field((_type) => GenderEnum)
  gender: GenderEnum;
}

@InputType()
export class CreateRubricInput {
  @Field((_type) => [LangInput])
  name: LangInput[];

  @Field((_type) => ID, { nullable: true })
  parent?: string;

  @Field((_type) => ID)
  variant: string;

  @Field((_type) => RubricCatalogueTitleInput)
  catalogueTitle: RubricCatalogueTitleInput;
}
