import { Field, ID, InputType } from 'type-graphql';
import { Metric } from '../../entities/Metric';

@InputType()
export class UpdateMetricInput implements Partial<Metric> {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
