import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, index, plugin, prop } from '@typegoose/typegoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Aggregate, FilterQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { ProductCardConnection } from './ProductCardConnection';
import { RubricProductAttributesFilterInput } from '../resolvers/rubric/RubricProductPaginateInput';
import { ProductAttributesGroup } from './ProductAttributesGroup';
import { ProductCardFeatures } from './ProductCardFeatures';
import { ProductCardPrices } from './ProductCardPrices';
import { ProductConnection } from './ProductConnection';
import { CityCounter } from './CityCounter';
import { Asset } from './Asset';
import { Translation } from './Translation';
import { ShopProduct } from './ShopProduct';
import { ProductCardBreadcrumb } from './ProductCardBreadcrumb';
import { Brand } from './Brand';
import { BrandCollection } from './BrandCollection';
import { Manufacturer } from './Manufacturer';
import { alwaysArray } from '../utils/alwaysArray';

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
  readonly _id?: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field(() => Boolean)
  @prop({ required: true, default: true })
  active: boolean;

  @Field(() => [CityCounter])
  @prop({ type: CityCounter, required: true })
  views: CityCounter[];

  @Field(() => [CityCounter])
  @prop({ type: CityCounter, required: true })
  priorities: CityCounter[];

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  cardName: Translation[];

  @Field(() => String)
  @prop({ required: true })
  originalName: string;

  @Field(() => String)
  @prop({ required: true })
  slug: string;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  description: Translation[];

  @Field(() => [ID])
  @prop({ type: String, required: true })
  rubrics: string[];

  @Field(() => [ProductAttributesGroup])
  @prop({ type: ProductAttributesGroup, required: true })
  attributesGroups: ProductAttributesGroup[];

  @Field(() => [Asset])
  @prop({ type: Asset, required: true })
  assets: Asset[];

  @Field(() => Int, { nullable: true })
  @prop({ type: Number })
  price?: number | null;

  @Field(() => Brand, { nullable: true })
  @prop({ type: String })
  brand?: string;

  @Field(() => BrandCollection, { nullable: true })
  @prop({ type: String })
  brandCollection?: string;

  @Field(() => Manufacturer, { nullable: true })
  @prop({ type: String })
  manufacturer?: string;

  @Field(() => ProductCardPrices)
  readonly cardPrices: ProductCardPrices;

  @Field(() => [ProductConnection])
  readonly connections: ProductConnection[];

  @Field(() => [ProductCardBreadcrumb])
  readonly cardBreadcrumbs: ProductCardBreadcrumb[];

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

  @Field(() => Int)
  readonly shopsCount: number;

  @Field(() => [ShopProduct])
  readonly shops: ShopProduct[];

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

export const ProductModel = getModelForClass(Product);
