import { Field, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { PointGeoJSON } from './PointGeoJSON';
import { Coordinates } from './Coordinates';

@ObjectType()
export class Address {
  @Field(() => String)
  @prop({ type: String, required: true })
  formattedAddress: string;

  @Field(() => PointGeoJSON)
  @prop({ type: PointGeoJSON, required: true })
  point: PointGeoJSON;

  @Field(() => Coordinates)
  readonly formattedCoordinates?: Coordinates;
}
