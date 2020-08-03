import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { CONFIG_VARIANTS_ENUMS } from '../config';

export enum ConfigVariantEnum {
  string = 'string',
  number = 'number',
  email = 'email',
  tel = 'tel',
  asset = 'asset',
}

registerEnumType(ConfigVariantEnum, {
  name: 'ConfigVariantEnum',
  description: 'Config variant enum',
});

@ObjectType()
export class Config {
  @Field((_type) => ID)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  slug: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  nameString: string;

  @Field((_type) => String)
  @prop({ type: String })
  description: string;

  @Field((_type) => Number)
  @prop({ type: Number })
  order: number;

  @Field((_type) => ConfigVariantEnum)
  @prop({ required: true, enum: CONFIG_VARIANTS_ENUMS })
  variant: ConfigVariantEnum;

  @Field((_type) => [String])
  @prop({ type: String, required: true })
  value: string[];
}

export const ConfigModel = getModelForClass(Config);
