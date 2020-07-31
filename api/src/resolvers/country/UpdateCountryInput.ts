import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateCountryInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => String)
  nameString: string;

  @Field((_type) => String)
  currency: string;
}
