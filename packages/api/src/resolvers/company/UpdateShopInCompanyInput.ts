import { Field, ID, InputType } from 'type-graphql';
import { UpdateShopInput } from '../shop/UpdateShopInput';

@InputType()
export class UpdateShopInCompanyInput extends UpdateShopInput {
  @Field((_type) => ID)
  companyId: string;
}
