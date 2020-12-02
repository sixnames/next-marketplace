import { Field, ID, InputType } from 'type-graphql';
import { ContactsInput } from '../commonInputs/ContactsInput';
import { GraphQLUpload } from 'apollo-server-express';
import { Upload } from '../../types/upload';
import { AddressInput } from '../commonInputs/AddressInput';

@InputType()
export class UpdateShopInput {
  @Field((_type) => ID)
  shopId: string;

  @Field((_type) => String)
  nameString: string;

  @Field((_type) => String)
  city: string;

  @Field((_type) => ContactsInput)
  contacts: ContactsInput;

  @Field((_type) => [GraphQLUpload])
  logo: Upload[];

  @Field((_type) => [GraphQLUpload])
  assets: Upload[];

  @Field((_type) => AddressInput)
  address: AddressInput;
}