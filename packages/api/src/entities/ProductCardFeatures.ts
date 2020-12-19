import { Field, ID, ObjectType } from 'type-graphql';
import { ProductAttribute } from './ProductAttribute';

@ObjectType()
export class ProductCardFeatures {
  @Field(() => ID)
  id: string;

  @Field(() => [ProductAttribute])
  readonly listFeatures: ProductAttribute[];

  @Field(() => [ProductAttribute])
  readonly textFeatures: ProductAttribute[];

  @Field(() => [ProductAttribute])
  readonly tagFeatures: ProductAttribute[];

  @Field(() => [ProductAttribute])
  readonly iconFeatures: ProductAttribute[];

  @Field(() => [ProductAttribute])
  readonly ratingFeatures: ProductAttribute[];

  @Field(() => String)
  readonly listFeaturesString: string;

  @Field(() => [String])
  readonly ratingFeaturesValues: string[];
}
