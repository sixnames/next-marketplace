import { Field, ID, InputType } from 'type-graphql';
import { Metric } from '../../entities/Metric';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class UpdateMetricInput implements Partial<Metric> {
  @Field(() => ID)
  id: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];
}
