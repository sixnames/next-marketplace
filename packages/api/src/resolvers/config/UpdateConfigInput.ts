import { Field, ID, InputType } from 'type-graphql';
import { ConfigCityInput } from '../common/ConfigCityInput';

@InputType()
export class UpdateConfigInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => [ConfigCityInput])
  cities: ConfigCityInput[];
}
