import { Field, ID, InputType } from 'type-graphql';
import { Upload } from '../../types/upload';
import { GraphQLUpload } from 'apollo-server-express';

@InputType()
export class UpdateAssetConfigInput {
  @Field((_type) => ID)
  id: string;

  @Field((_type) => [GraphQLUpload])
  value: Upload[];
}
