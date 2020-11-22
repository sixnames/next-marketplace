import { Field, ID, InputType } from 'type-graphql';
import { ProductAttributeViewVariantEnum } from '../../entities/ProductAttribute';

@InputType()
export class ProductAttributeInput {
  @Field(() => Boolean)
  showInCard: boolean;

  @Field(() => ProductAttributeViewVariantEnum, { nullable: true })
  viewVariant: ProductAttributeViewVariantEnum;

  @Field(() => ID)
  node: string;

  @Field(() => String, { description: 'Attribute reference via attribute slug field' })
  key: string;

  @Field(() => [String])
  value: string[];
}
