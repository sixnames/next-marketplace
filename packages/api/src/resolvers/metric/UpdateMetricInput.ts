import { Field, ID, InputType } from 'type-graphql';
import { Metric } from '../../entities/Metric';
import { LangInput } from '../common/LangInput';

@InputType()
export class UpdateMetricInput implements Partial<Metric> {
  @Field(() => ID)
  id: string;

  @Field(() => [LangInput])
  name: LangInput[];
}
