import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Translation } from './Translation';

@ObjectType()
export class Metric {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

  @Field(() => String)
  readonly nameString: string;
}

export const MetricModel = getModelForClass(Metric);
