import { Field, ID, InputType, Int } from 'type-graphql';
import { TranslationInput } from '../commonInputs/TranslationInput';
import { GraphQLUpload } from 'apollo-server-express';
import { Upload } from '../../types/upload';
import { ProductAttributesGroupInput } from '../commonInputs/ProductAttributesGroupInput';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  id: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field(() => [TranslationInput])
  cardName: TranslationInput[];

  @Field(() => String)
  originalName: string;

  @Field(() => [TranslationInput])
  description: TranslationInput[];

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
