import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class DeleteCollectionFromBrandInput {
  @Field((_type) => ID)
  brandId: string;

  @Field((_type) => ID)
  collectionId: string;
}
