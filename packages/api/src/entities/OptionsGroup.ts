import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Option } from './Option';
import { LanguageType } from './common';
import { OPTIONS_GROUP_VARIANT_ENUMS, OPTIONS_GROUP_VARIANT_TEXT } from '@yagu/config';

// Options Group variant
export enum OptionsGroupVariantEnum {
  text = 'text',
  icon = 'icon',
  color = 'color',
}

registerEnumType(OptionsGroupVariantEnum, {
  name: 'OptionsGroupVariantEnum',
  description: 'Attribute variant enum',
});

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

  @Field((_type) => OptionsGroupVariantEnum)
  @prop({ required: true, enum: OPTIONS_GROUP_VARIANT_ENUMS, default: OPTIONS_GROUP_VARIANT_TEXT })
  variant?: OptionsGroupVariantEnum;
}

export const OptionsGroupModel = getModelForClass(OptionsGroup);
