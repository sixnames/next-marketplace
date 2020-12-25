import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class AddCollectionToBrandInput {
  @Field((_type) => ID)
  brandId: string;

  @Field((_type) => String)
  nameString: string;

  @Field((_type) => String, { nullable: true })
  description?: string;
}
