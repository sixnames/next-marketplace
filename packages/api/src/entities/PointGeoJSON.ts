import { Field, Float, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { GEO_POINT_TYPE } from '@yagu/shared';

@ObjectType()
export class PointGeoJSON {
  @Field(() => String, {
    description: 'Field that specifies the GeoJSON object type.',
  })
  @prop({ type: String, default: GEO_POINT_TYPE })
  readonly type?: string;

  @Field(() => [Float], {
    description:
      'Coordinates that specifies the object’s coordinates. If specifying latitude and longitude coordinates, list the longitude first and then latitude.',
  })
  @prop({ type: Number, required: true, default: [] })
  public coordinates: number[];
}
