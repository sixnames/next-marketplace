import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { LanguageType } from './common';

@ObjectType()
export class Metric {
  @Field(() => ID)
  readonly id: string;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true, _id: false })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;
}

export const MetricModel = getModelForClass(Metric);
