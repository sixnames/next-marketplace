import { Field, InputType } from 'type-graphql';

@InputType()
export class CityLangInput {
  @Field(() => String)
  key: string;

  @Field(() => [String])
  value: string[];
}

@InputType()
export class ConfigCityInput {
  @Field((_type) => String)
  key: string;

  @Field((_type) => [CityLangInput])
  translations: CityLangInput[];
}
