import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { CONFIG_VARIANTS_ENUMS } from '../config';
import { City } from './City';

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
export class ConfigLanguage {
  @Field(() => String)
  @prop({ required: true })
  public key: string;

  @Field(() => [String])
  @prop({ required: true, type: String })
  public value: string[];
}

@ObjectType()
export class ConfigCity {
  @Field((_type) => String)
  @prop({ type: String, required: true })
  key: string;

  @Field((_type) => [ConfigLanguage])
  @prop({ type: ConfigLanguage, required: true })
  translations: ConfigLanguage[];

  @Field((_type) => City)
  readonly city?: City;
}

@ObjectType()
export class Config {
  @Field((_type) => ID)
  readonly id: string;

  @Field((_type) => [String], {
    description: 'Returns current value of current city.',
  })
  readonly value: string[];

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

  @Field((_type) => Boolean, {
    description: 'Set to true if config is able to hold multiple values.',
  })
  @prop({ type: Boolean })
  multi: boolean;

  @Field((_type) => ConfigVariantEnum)
  @prop({ required: true, enum: CONFIG_VARIANTS_ENUMS })
  variant: ConfigVariantEnum;

  @Field((_type) => [String], { description: 'Accepted formats for asset config.' })
  @prop({ type: String })
  acceptedFormats: string[];

  @Field((_type) => [ConfigCity])
  @prop({ required: true, type: ConfigCity })
  cities: ConfigCity[];
}

export const ConfigModel = getModelForClass(Config);
