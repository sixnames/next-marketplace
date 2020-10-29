import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreateProductConnectionInput {
  @Field((_type) => ID)
  productId: string;

  @Field((_type) => ID)
  attributeId: string;

  @Field((_type) => ID)
  attributesGroupId: string;
}
