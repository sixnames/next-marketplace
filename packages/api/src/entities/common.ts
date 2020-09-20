import { Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { DEFAULT_PRIORITY } from '@yagu/config';

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
