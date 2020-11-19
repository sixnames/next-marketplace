import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { LanguageType } from './commonEntities';

@ObjectType()
export class Metric {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;
}

export const MetricModel = getModelForClass(Metric);
