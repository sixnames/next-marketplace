import { Field, Float, ObjectType } from 'type-graphql';

@ObjectType()
export class Coordinates {
  @Field(() => Float)
  readonly lat: number;

  @Field(() => Float)
  readonly lng: number;
}
