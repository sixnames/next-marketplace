import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateBrandInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => String)
  nameString: string;

  @Field((_type) => String, { nullable: true })
  url?: string;

  @Field((_type) => String, { nullable: true })
  description?: string;
}
