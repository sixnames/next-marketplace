import { Field, ID, InputType, Int } from 'type-graphql';
import { LangInput } from '../common/LangInput';
import { GraphQLUpload } from 'apollo-server-express';
import { Upload } from '../../types/upload';
import { ProductAttributesGroupInput } from '../common/ProductAttributesGroupInput';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  id: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field(() => [LangInput])
  cardName: LangInput[];

  @Field(() => [LangInput])
  description: LangInput[];

  @Field(() => [ID])
  rubrics: string[];

  @Field(() => Int)
  price: number;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => [ProductAttributesGroupInput])
  attributesGroups: ProductAttributesGroupInput[];

  @Field(() => [GraphQLUpload])
  assets: Upload[];
}
