import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class DeleteShopFromCompanyInput {
  @Field((_type) => ID)
  companyId: string;

  @Field((_type) => ID)
  shopId: string;
}
