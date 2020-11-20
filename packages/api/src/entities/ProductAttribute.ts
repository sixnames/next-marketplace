import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { ATTRIBUTE_VIEW_VARIANT_LIST, ATTRIBUTE_VIEW_VARIANTS_ENUMS } from '@yagu/config';
import { Attribute } from './Attribute';
import { Option } from './Option';

// Attribute view variant
export enum ProductAttributeViewVariantEnum {
  list = 'list',
  text = 'text',
  tag = 'tag',
  icon = 'icon',
  outerRating = 'outerRating',
}

registerEnumType(ProductAttributeViewVariantEnum, {
  name: 'ProductAttributeViewVariantEnum',
  description: 'Product attribute view variant enum',
});

@ObjectType()
export class ProductAttribute {
  @Field(() => Boolean)
  @prop({ required: true, default: true })
  showInCard: boolean;

  @Field((_type) => ProductAttributeViewVariantEnum)
  @prop({
    required: true,
    enum: ATTRIBUTE_VIEW_VARIANTS_ENUMS,
    default: ATTRIBUTE_VIEW_VARIANT_LIST,
  })
  viewVariant: ProductAttributeViewVariantEnum;

  @Field(() => Attribute)
  @prop({ ref: Attribute })
  node: string;

  @Field(() => String, { description: 'Attribute reference via attribute slug field' })
  @prop({ required: true })
  key: string;

  @Field(() => [String])
  @prop({ type: String, required: true })
  value: string[];

  @Field(() => [Option])
  readonly readableOptions?: Option[];

  @Field(() => [String])
  readonly readableValue?: string[];
}
