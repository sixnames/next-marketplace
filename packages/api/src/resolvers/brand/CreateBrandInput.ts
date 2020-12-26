import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateBrandInput {
  @Field((_type) => String)
  nameString: string;

  @Field((_type) => String, { nullable: true })
  url?: string;

  @Field((_type) => String, { nullable: true })
  description?: string;
}
