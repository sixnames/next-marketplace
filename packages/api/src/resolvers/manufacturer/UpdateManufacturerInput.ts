import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateManufacturerInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => String)
  nameString: string;

  @Field((_type) => String, { nullable: true })
  url?: string;

  @Field((_type) => String, { nullable: true })
  description?: string;
}
