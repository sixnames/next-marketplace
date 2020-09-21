import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, getName, index, plugin, prop } from '@typegoose/typegoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Aggregate, FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { AssetType, CityCounter, LanguageType } from './common';
import { AttributesGroup } from './AttributesGroup';
import { Attribute } from './Attribute';
import { AutoIncrementID } from '@typegoose/auto-increment';

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

@ObjectType()
@plugin(mongoosePaginate)
@plugin(aggregatePaginate)
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
@index({ '$**': 'text' })
export class Product extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field(() => [CityCounter])
  @prop({ type: CityCounter, required: true })
  views: CityCounter[];

  @Field(() => [CityCounter])
  @prop({ type: CityCounter, required: true })
  priorities: CityCounter[];

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

  @Field(() => [ProductConnection])
  readonly connections: ProductConnection[];

  @Field(() => String)
  readonly nameString: string;

  @Field(() => String)
  readonly cardNameString: string;

  @Field(() => String)
  readonly descriptionString: string;

  @Field(() => String)
  readonly mainImage: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  static paginate: (
    query?: FilterQuery<Product>,
    options?: PaginateOptions,
  ) => Promise<PaginateResult<Product>>;

  static aggregatePaginate: (
    pipeline?: Aggregate<Product[]>,
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

@ObjectType()
export class ProductConnection {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Attribute)
  @prop({ ref: Attribute })
  attribute: string;

  @Field(() => String, { description: 'Attribute reference via attribute slug field' })
  @prop({ required: true })
  key: string;

  @Field(() => [Product])
  @prop({ ref: () => getName(Product), required: true })
  products: string[];
}

export const ProductConnectionModel = getModelForClass(ProductConnection);
export const ProductModel = getModelForClass(Product);
