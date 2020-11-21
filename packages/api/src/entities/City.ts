import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Translation } from './Translation';

@ObjectType()
export class City {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

  @Field(() => String)
  @prop({ type: String, required: true })
  slug: string;

  @Field(() => String)
  readonly nameString: string;
}

export const CityModel = getModelForClass(City);
