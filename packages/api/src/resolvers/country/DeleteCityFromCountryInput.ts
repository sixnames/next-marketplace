import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class DeleteCityFromCountryInput {
  @Field(() => ID)
  countryId: string;

  @Field(() => ID)
  cityId: string;
}
