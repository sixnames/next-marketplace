import { Field, InputType } from 'type-graphql';
import { CoordinatesInput } from './CoordinatesInput';

@InputType()
export class AddressInput {
  @Field((_type) => String)
  formattedAddress: string;

  @Field((_type) => CoordinatesInput)
  point: CoordinatesInput;
}
