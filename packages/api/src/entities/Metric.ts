import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';

@ObjectType()
export class Metric {
  @Field(() => ID)
  public id: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public name: string;
}

export const MetricModel = getModelForClass(Metric);
