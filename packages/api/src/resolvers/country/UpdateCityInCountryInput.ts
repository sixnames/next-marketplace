import { Field, ID, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class UpdateCityInCountryInput {
  @Field(() => ID)
  countryId: string;

  @Field(() => ID)
  cityId: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field(() => String)
  slug: string;
}
