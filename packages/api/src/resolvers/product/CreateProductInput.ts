import { Field, ID, InputType, Int } from 'type-graphql';
import { LangInput } from '../common/LangInput';
import { GraphQLUpload } from 'apollo-server-express';
import { Upload } from '../../types/upload';
import { ProductAttributesGroupInput } from '../common/ProductAttributesGroupInput';

@InputType()
export class CreateProductInput {
  @Field(() => [LangInput])
  name: LangInput[];

  @Field(() => [LangInput])
  cardName: LangInput[];

  @Field(() => [LangInput])
  description: LangInput[];

  @Field(() => [ID])
  rubrics: string[];

  @Field(() => ID)
  attributesSource: string;

  @Field(() => Int)
  price: number;

  @Field(() => [ProductAttributesGroupInput])
  attributesGroups: ProductAttributesGroupInput[];

  @Field(() => [GraphQLUpload])
  assets: Upload[];
}