import { Field, Int, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { DEFAULT_PRIORITY } from '@yagu/config';

@ObjectType()
export class CityCounter {
  @Field(() => String)
  @prop({ required: true })
  public key: string;

  @Field(() => Int, { defaultValue: DEFAULT_PRIORITY })
  @prop({ required: true, default: DEFAULT_PRIORITY, type: Number })
  public counter: number;
}
