import { Field, Float, InputType } from 'type-graphql';

@InputType()
export class CoordinatesInput {
  @Field((_type) => Float)
  lat: number;

  @Field((_type) => Float)
  lng: number;
}
