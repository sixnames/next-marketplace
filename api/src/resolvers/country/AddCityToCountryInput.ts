import { Field, ID, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class AddCityToCountryInput {
  @Field(() => ID)
  countryId: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field(() => String)
  slug: string;
}
