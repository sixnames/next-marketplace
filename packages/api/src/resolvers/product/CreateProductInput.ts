import { Field, ID, InputType, Int } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';
import { GraphQLUpload } from 'apollo-server-express';
import { Upload } from '../../types/upload';
import { ProductAttributesGroupInput } from '../commonInputs/ProductAttributesGroupInput';

@InputType()
export class CreateProductInput {
  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field(() => [TranslationInput])
  cardName: TranslationInput[];

  @Field(() => [TranslationInput])
  description: TranslationInput[];

  @Field(() => [ID])
  rubrics: string[];

  @Field(() => Int)
  price: number;

  @Field(() => [ProductAttributesGroupInput])
  attributesGroups: ProductAttributesGroupInput[];

  @Field(() => [GraphQLUpload])
  assets: Upload[];
}
