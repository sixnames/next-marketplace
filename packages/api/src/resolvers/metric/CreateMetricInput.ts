import { Field, InputType } from 'type-graphql';
import { Metric } from '../../entities/Metric';

@InputType()
export class CreateMetricInput implements Partial<Metric> {
  @Field()
  name: string;
}
