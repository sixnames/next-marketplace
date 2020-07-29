import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { City } from './City';

@ObjectType()
export class Country {
  @Field((_type) => ID)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  nameString: string;

  @Field((_type) => [City])
  @prop({ ref: City })
  cities: string[];

  @Field((_type) => String)
  @prop({ type: String, required: true })
  currency: string;
}

export const CountryModel = getModelForClass(Country);
