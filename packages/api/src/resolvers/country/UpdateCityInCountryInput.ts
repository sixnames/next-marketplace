import { Field, ID, InputType } from 'type-graphql';
import { LangInput } from '../common/LangInput';

@InputType()
export class UpdateCityInCountryInput {
  @Field(() => ID)
  countryId: string;

  @Field(() => ID)
  cityId: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field(() => String)
  slug: string;
}
