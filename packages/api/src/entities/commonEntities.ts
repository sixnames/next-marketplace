import { Field, Float, Int, ObjectType, registerEnumType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { DEFAULT_PRIORITY, GEO_POINT_TYPE } from '@yagu/config';

// Gender enum
export enum GenderEnum {
  she = 'she',
  he = 'he',
  it = 'it',
}

registerEnumType(GenderEnum, {
  name: 'GenderEnum',
  description: 'List of gender enums',
});

@ObjectType()
export class FormattedPhone {
  @Field(() => String)
  readonly raw: string;

  @Field(() => String)
  readonly readable: string;
}

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

@ObjectType()
export class Address {
  @Field(() => String)
  @prop({ type: String, required: true })
  formattedAddress: string;

  @Field(() => PointGeoJSON)
  @prop({ type: PointGeoJSON, required: true })
  point: PointGeoJSON;
}

@ObjectType()
export class ContactsType {
  @Field(() => [String])
  @prop({ type: String, required: true, default: [] })
  public emails: string[];

  @Field(() => [String])
  @prop({ type: String, required: true, default: [] })
  public phones: string[];
}

@ObjectType()
export class LanguageType {
  @Field(() => String)
  @prop({ required: true })
  public key: string;

  @Field(() => String)
  @prop({ required: true })
  public value: string;
}

@ObjectType()
export class AssetType {
  @Field(() => String)
  @prop({ required: true })
  public url: string;

  @Field(() => Int)
  @prop({ required: true })
  public index: number;
}

@ObjectType()
export class CityCounter {
  @Field(() => String)
  @prop({ required: true })
  public key: string;

  @Field(() => Int, { defaultValue: DEFAULT_PRIORITY })
  @prop({ required: true, default: DEFAULT_PRIORITY, type: Number })
  public counter: number;
}
