import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, index, plugin, prop } from '@typegoose/typegoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { AssetType, LanguageType } from './common';
import { AttributesGroup } from './AttributesGroup';
import { Attribute } from './Attribute';
import { JsonObjectScalar } from '../scalars/JsonObjectScalar';

// Product attribute
@ObjectType()
export class ProductAttribute {
  @Field(() => Boolean)
  @prop({ required: true, default: true })
  showInCard: boolean;

  @Field(() => Attribute)
  @prop({ ref: Attribute })
  node: string;

  @Field(() => JsonObjectScalar)
  @prop({ required: true })
  value: JSON;
}

// Product attributes group
@ObjectType()
export class ProductAttributesGroup {
  @Field(() => Boolean)
  @prop({ required: true, default: true })
  showInCard: boolean;

  @Field(() => AttributesGroup)
  @prop({ ref: AttributesGroup })
  node: string;

  @Field(() => [ProductAttribute])
  @prop({ ref: ProductAttribute })
  attributes: ProductAttribute[];
}

// Product data in current city
@ObjectType()
export class ProductNode {
  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true, _id: false })
  name: LanguageType[];

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true, _id: false })
  cardName: LanguageType[];

  @Field(() => String)
  @prop({ required: true })
  slug: string;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true, _id: false })
  description: LanguageType[];

  @Field(() => [ID])
  @prop({ required: true })
  rubrics: string[];

  @Field(() => ID)
  @prop({ required: true })
  attributesSource: string;

  @Field(() => [ProductAttributesGroup])
  @prop({ type: ProductAttributesGroup, required: true, _id: false })
  attributesGroups: ProductAttributesGroup[];

  @Field(() => [AssetType])
  @prop({ type: AssetType, required: true, _id: false })
  assets: AssetType[];

  @Field(() => Int)
  @prop({ required: true })
  price: number;
}

// Product current city
@ObjectType()
export class ProductCity {
  @Field(() => String)
  @prop({ required: true })
  key: string;

  @Field(() => ProductNode)
  @prop({ required: true, _id: false })
  node: ProductNode;
}

// Product schema
@ObjectType()
@plugin(mongoosePaginate)
@plugin(autoIncrement, {
  model: 'Product',
  field: 'itemId',
})
@index({ '$**': 'text' })
export class Product extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Int)
  readonly itemId: number;

  @Field(() => [ProductCity])
  @prop({ type: ProductCity, required: true, _id: false })
  cities: ProductCity[];

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  static paginate: (
    query?: FilterQuery<Product>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<Product>>;
}

export const ProductModel = getModelForClass(Product);
