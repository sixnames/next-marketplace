import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { City } from './City';
import { Currency } from './Currency';

@ObjectType()
export class Country {
  @Field((_type) => ID)
  readonly id: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  name: string;

  @Field((_type) => [City])
  @prop({ ref: City })
  cities: string[];

  @Field((_type) => Currency)
  @prop({ ref: Currency })
  currency: string;

  @Field(() => String)
  readonly nameString: string;
}

export const CountryModel = getModelForClass(Country);
