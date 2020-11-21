import { Field, ID, InputType } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class AddCityToCountryInput {
  @Field(() => ID)
  countryId: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field(() => String)
  slug: string;
}
