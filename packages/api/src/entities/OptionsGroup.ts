import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Option } from './Option';
import { LanguageType } from './common';

@ObjectType()
export class OptionsGroup {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => [Option])
  @prop({ ref: Option })
  options: string[];

  @Field((_type) => Boolean, { nullable: true })
  @prop({ type: Boolean, default: false })
  withColor?: boolean;

  @Field((_type) => Boolean, { nullable: true })
  @prop({ type: Boolean, default: false })
  withIcon?: boolean;
}

export const OptionsGroupModel = getModelForClass(OptionsGroup);
