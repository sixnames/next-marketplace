import { Field, ID, Int, ObjectType } from 'type-graphql';
import { DocumentType, getModelForClass, index, plugin, pre, prop } from '@typegoose/typegoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { AssetType, LanguageType } from './common';
import { AttributesGroup } from './AttributesGroup';
import { Attribute } from './Attribute';

// Product attribute
@ObjectType()
export class ProductAttribute {
  @Field(() => Boolean)
  @prop({ required: true, default: true })
  showInCard: boolean;

  @Field(() => Attribute)
  @prop({ ref: Attribute })
  node: string;

  @Field(() => String, { description: 'Attribute reference via attribute slug field' })
  @prop({ required: true })
  key: string;

  @Field(() => [String])
  @prop({ type: String, required: true })
  value: string[];
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
  @prop({ type: ProductAttribute, required: true })
  attributes: ProductAttribute[];
}

// Product data in current city
@ObjectType()
export class ProductNode {
  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  cardName: LanguageType[];

  @Field(() => String)
  @prop({ required: true })
  slug: string;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  description: LanguageType[];

  @Field(() => [ID])
  @prop({ type: String, required: true })
  rubrics: string[];

  @Field(() => [ProductAttributesGroup])
  @prop({ type: ProductAttributesGroup, required: true })
  attributesGroups: ProductAttributesGroup[];

  @Field(() => [AssetType])
  @prop({ type: AssetType, required: true })
  assets: AssetType[];

  @Field(() => Int)
  @prop({ required: true })
  price: number;

  @Field(() => Boolean)
  @prop({ required: true, default: true })
  active: boolean;
}

// Product current city
@ObjectType()
export class ProductCity {
  @Field(() => String)
  @prop({ required: true })
  key: string;

  @Field(() => ProductNode)
  @prop({ required: true })
  node: ProductNode;
}

// Product schema
@ObjectType()
@plugin(mongoosePaginate)
@pre<Product>('save', async function (this: DocumentType<Product>) {
  const lastItem = await ProductModel.find({}).sort({ itemId: -1 }).limit(1);
  const itemId = lastItem && lastItem[0] ? `${+lastItem[0].itemId + 1}` : '1';
  if (this.isNew) {
    this.itemId = itemId;
  }
})
@index({ '$**': 'text' })
export class Product extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  @prop({ required: true, trim: true, default: '1' })
  itemId: string;

  @Field(() => String)
  readonly nameString: string;

  @Field(() => [LanguageType])
  readonly name: LanguageType[];

  @Field(() => String)
  readonly cardNameString: string;

  @Field(() => [LanguageType])
  readonly cardName: LanguageType[];

  @Field(() => String)
  readonly slug: string;

  @Field(() => String)
  readonly descriptionString: string;

  @Field(() => [LanguageType])
  readonly description: LanguageType[];

  @Field(() => [ID])
  readonly rubrics: string[];

  @Field(() => [ProductAttributesGroup])
  readonly attributesGroups: ProductAttributesGroup[];

  @Field(() => [AssetType])
  readonly assets: AssetType[];

  @Field(() => String)
  readonly mainImage: string;

  @Field(() => Int)
  readonly price: number;

  @Field(() => Boolean)
  readonly active: boolean;

  @Field(() => [ProductCity])
  @prop({ type: ProductCity, required: true })
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

@ObjectType()
export class ProductsCounters {
  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;
}

export const ProductModel = getModelForClass(Product);
