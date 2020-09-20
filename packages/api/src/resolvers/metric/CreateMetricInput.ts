import { Field, InputType } from 'type-graphql';
import { Metric } from '../../entities/Metric';
import { LangInput } from '../common/LangInput';

@InputType()
export class CreateMetricInput implements Partial<Metric> {
  @Field(() => [LangInput])
  name: LangInput[];
}
