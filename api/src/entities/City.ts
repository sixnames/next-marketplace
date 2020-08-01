import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { LanguageType } from './common';

@ObjectType()
export class City {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => String)
  @prop({ type: String, required: true })
  key: string;

  @Field(() => String)
  readonly nameString: string;
}

export const CityModel = getModelForClass(City);
