import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateCountryInput {
  @Field((_type) => String)
  nameString: string;

  @Field((_type) => String)
  currency: string;
}
