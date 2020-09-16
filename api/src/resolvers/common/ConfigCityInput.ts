import { Field, InputType } from 'type-graphql';
import { LangInput } from './LangInput';

@InputType()
export class ConfigCityInput {
  @Field((_type) => String)
  key: string;

  @Field((_type) => [String])
  value: string[];

  @Field((_type) => [LangInput])
  translations: LangInput[];
}
