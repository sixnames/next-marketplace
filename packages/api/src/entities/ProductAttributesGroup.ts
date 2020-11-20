import { Field, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { ProductAttribute } from './ProductAttribute';

@ObjectType()
export class ProductAttributesGroup {
  @Field(() => Boolean)
  @prop({ required: true, default: true })
  showInCard: boolean;

  @Field(() => AttributesGroup)
  @prop({ ref: AttributesGroup })
  node: string;

  @Field(() => [ProductAttribute])
  @prop({ type: ProductAttribute, required: true })
  attributes: ProductAttribute[];
}
