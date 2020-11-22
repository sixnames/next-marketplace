import { Field, InputType } from 'type-graphql';
import { Metric } from '../../entities/Metric';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class CreateMetricInput implements Partial<Metric> {
  @Field(() => [TranslationInput])
  name: TranslationInput[];
}
