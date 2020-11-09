import { Field, ID, InputType } from 'type-graphql';
import { ContactsInput } from '../common/ContactsInput';
import { GraphQLUpload } from 'apollo-server-express';
import { Upload } from '../../types/upload';

@InputType()
export class CreateCompanyInput {
  @Field((_type) => String)
  nameString: string;

  @Field((_type) => ContactsInput)
  contacts: ContactsInput;

  @Field((_type) => [GraphQLUpload])
  logo: Upload[];

  @Field((_type) => ID)
  owner: string;

  @Field((_type) => [ID])
  staff: string[];
}
