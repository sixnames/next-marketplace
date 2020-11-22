import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { Attribute } from './Attribute';
import { ProductConnectionItem } from './ProductConnectionItem';

@ObjectType()
export class ProductConnection {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  @prop({ type: String, required: true })
  attributeId: string;

  @Field(() => String)
  @prop({ type: String, required: true })
  attributesGroupId: string;

  @Field(() => [String])
  @prop({ type: String, required: true })
  productsIds: string[];

  @Field(() => Attribute)
  readonly attribute: string;

  @Field(() => [ProductConnectionItem])
  readonly products: ProductConnectionItem[];
}

export const ProductConnectionModel = getModelForClass(ProductConnection);
