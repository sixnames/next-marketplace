import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { CityCounter, GenderEnum, LanguageType } from './common';
import { prop as Property } from '@typegoose/typegoose/lib/prop';
import { GENDER_ENUMS } from '../config';

@ObjectType()
export class OptionVariant {
  @Field((_type) => GenderEnum)
  @prop({ required: true, enum: GENDER_ENUMS, type: String })
  key: GenderEnum;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  value: LanguageType[];
}

@ObjectType()
export class OptionCityCounter extends CityCounter {
  @Field((_type) => String)
  @prop({ required: true, type: String })
  attributeId: string;

  @Field((_type) => String)
  @prop({ required: true, type: String })
  rubricId: string;
}

@ObjectType()
export class Option {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  @Property({ required: true })
  slug: string;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => [OptionVariant], { nullable: true })
  @prop({ type: OptionVariant })
  variants?: OptionVariant[];

  @Field((_type) => GenderEnum, { nullable: true })
  @prop({ enum: GENDER_ENUMS, type: String })
  gender?: GenderEnum | null;

  @Field(() => [OptionCityCounter])
  @prop({ type: OptionCityCounter, required: true })
  views: OptionCityCounter[];

  @Field(() => [OptionCityCounter])
  @prop({ type: OptionCityCounter, required: true })
  priorities: OptionCityCounter[];

  @Field(() => String)
  readonly nameString: string;

  @Field(() => String)
  readonly filterNameString: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  color?: string | null;
}

export const OptionModel = getModelForClass(Option);
