import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { GenderEnum } from './commonEntities';
import { prop as Property } from '@typegoose/typegoose/lib/prop';
import { GENDER_ENUMS } from '@yagu/config';
import { CityCounter } from './CityCounter';
import { Translation } from './Translation';

@ObjectType()
export class OptionVariant {
  @Field((_type) => GenderEnum)
  @prop({ required: true, enum: GENDER_ENUMS, type: String })
  key: GenderEnum;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  value: Translation[];
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
  readonly _id?: string;

  @Field(() => String)
  @Property({ required: true })
  slug: string;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

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

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  icon?: string | null;
}

export const OptionModel = getModelForClass(Option);
