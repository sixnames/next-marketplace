import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { getModelForClass, index, plugin, prop } from '@typegoose/typegoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Aggregate, FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { AssetType, CityCounter, LanguageType } from './commonEntities';
import { AttributesGroup } from './AttributesGroup';
import { Attribute } from './Attribute';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { ProductCardConnection } from './ProductCardConnection';
import { ATTRIBUTE_VIEW_VARIANT_LIST, ATTRIBUTE_VIEW_VARIANTS_ENUMS } from '@yagu/config';
import { RubricProductAttributesFilterInput } from '../resolvers/rubric/RubricProductPaginateInput';
import { alwaysArray } from '@yagu/shared';
import { Option } from './Option';
import { ShopProduct } from './ShopProduct';
import { Shop } from './Shop';

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
export class ProductCardFeatures {
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
}

@ObjectType()
export class ProductShop extends ShopProduct {
  @Field(() => Shop)
  readonly node: Shop;

  @Field(() => String)
  readonly formattedPrice: string;

  @Field(() => String, { nullable: true })
  readonly formattedOldPrice?: string | null;

  @Field(() => Int, { nullable: true })
  readonly discountedPercent?: number | null;
}

@ObjectType()
export class ProductCardPrices {
  @Field(() => String)
  readonly min: string;

  @Field(() => String)
  readonly max: string;
}

interface InArrayInterface {
  $in: any[];
}

interface NotInArrayInterface {
  $nin: any[];
}

interface EmptyArrayInterface {
  $exists: boolean;
  $size: number;
}

interface ProductsFiltersInterface {
  query?: {
    $text: {
      $search: string;
      $caseSensitive: boolean;
    };
  };
  rubrics?: InArrayInterface | NotInArrayInterface | EmptyArrayInterface;
  active?: boolean;
  [key: string]: any;
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
  @prop({ default: 0 })
  price?: number;

  @Field(() => ProductCardPrices)
  readonly cardPrices: ProductCardPrices;

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

  @Field(() => ProductCardFeatures)
  readonly cardFeatures: ProductCardFeatures;

  @Field(() => [ProductCardConnection])
  readonly cardConnections: ProductCardConnection[];

  @Field(() => [ProductShop])
  readonly shops: ProductShop[];

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

  static getProductsFilter(args: { [key: string]: any } = {}): ProductsFiltersInterface {
    const searchQuery = args.search
      ? {
          $text: {
            $search: args.search,
            $caseSensitive: false,
          },
        }
      : {};

    const additionalQuery = Object.keys(args).reduce((acc, key) => {
      const value = args[key];
      if (value) {
        if (key === 'search') {
          return acc;
        }

        if (key === 'attributes') {
          const attributesQuery = value.map(
            ({ key, value }: RubricProductAttributesFilterInput) => {
              return {
                'attributesGroups.attributes': {
                  $elemMatch: {
                    key,
                    value: { $in: value },
                  },
                },
              };
            },
          );

          if (!attributesQuery.length) {
            return acc;
          }

          return {
            ...acc,
            $and: attributesQuery,
          };
        }

        if (key === 'rubrics') {
          const query = alwaysArray(value);
          return { ...acc, rubrics: { $in: query } };
        }

        if (key === 'rubric') {
          const query = alwaysArray(value);
          return { ...acc, rubrics: { $in: query } };
        }

        if (key === 'notInRubric') {
          const query = alwaysArray(value);
          return { ...acc, rubrics: { $nin: query } };
        }

        if (key === 'noRubrics') {
          return { ...acc, rubrics: { $exists: true, $size: 0 } };
        }

        if (key === 'active') {
          return { ...acc, active: value };
        }

        if (key === 'excludedProductsIds') {
          const query = alwaysArray(value);
          return { ...acc, _id: { $nin: query } };
        }
      }

      return acc;
    }, {});

    return {
      ...searchQuery,
      ...additionalQuery,
    };
  }
}

@ObjectType()
export class ProductsCounters {
  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;
}

@ObjectType()
export class ProductConnectionItem {
  @Field(() => Product)
  node: Product;

  @Field(() => String, {
    description: 'Returns first value only because this attribute has to be Select variant',
  })
  value: string;

  @Field(() => String, {
    description: 'Returns name of selected attribute value',
  })
  optionName: string;
}

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
export const ProductModel = getModelForClass(Product);
