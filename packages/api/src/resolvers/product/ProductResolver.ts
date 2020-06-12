import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Product, ProductAttributesGroup, ProductModel } from '../../entities/Product';
import PaginateType from '../common/PaginateType';
import { ProductPaginateInput } from './ProductPaginateInput';
import { getProductsFilter } from '../../utils/getProductsFilter';
import { ContextInterface } from '../../types/context';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { DocumentType } from '@typegoose/typegoose';
import getCityData from '../../utils/getCityData';
import getLangField from '../../utils/getLangField';
import { AssetType } from '../../entities/common';
import PayloadType from '../common/PayloadType';
import { CreateProductInput } from './CreateProductInput';
import storeUploads from '../../utils/assets/storeUploads';
import { generateDefaultLangSlug } from '../../utils/slug';
import { UpdateProductInput } from './UpdateProductInput';

@ObjectType()
class PaginatedProductsResponse extends PaginateType(Product) {}

@ObjectType()
class ProductPayloadType extends PayloadType() {
  @Field((_type) => Product, { nullable: true })
  product?: Product | null;
}

@Resolver((_of) => Product)
export class ProductResolver {
  @Query(() => Product)
  async getProduct(@Arg('id', (_type) => ID) id: string) {
    return ProductModel.findById(id);
  }

  @Query(() => PaginatedProductsResponse)
  async getAllProducts(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: ProductPaginateInput,
  ): Promise<PaginatedProductsResponse> {
    const city = ctx.req.session!.city;
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc', ...args } = input;
    const query = getProductsFilter(args, city);
    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });

    return ProductModel.paginate(query, options);
  }

  @Mutation(() => ProductPayloadType)
  async createProduct(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      // TODO translations and validation
      const { assets, ...values } = input;
      const slug = generateDefaultLangSlug(values.cardName);
      const assetsResult = await storeUploads({ files: assets, slug });

      const city = ctx.req.session!.city;
      // const lang = ctx.req.session!.lang;

      const nameValues = input.name.map(({ value }) => value);
      const cardNameValues = input.cardName.map(({ value }) => value);
      const exists = await ProductModel.exists({
        $or: [
          {
            'cities.key': city,
            'cities.node.name.value': {
              $in: nameValues,
            },
          },
          {
            'cities.key': city,
            'cities.node.cardName.value': {
              $in: cardNameValues,
            },
          },
        ],
      });

      if (exists) {
        return {
          success: false,
          message: 'exists.',
        };
      }

      const product = await ProductModel.create({
        cities: [
          {
            key: city,
            node: {
              ...values,
              slug,
              assets: assetsResult,
            },
          },
        ],
      });

      if (!product) {
        return {
          success: false,
          message: 'Ошибка создания товара.',
        };
      }

      return {
        success: true,
        message: 'Товар создан.',
        product,
      };
    } catch (e) {
      return {
        success: false,
        message: 'Ошибка создания товара.',
      };
    }
  }

  @Mutation(() => ProductPayloadType)
  async updateProduct(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      // TODO translations and validation
      const { id, assets, ...values } = input;
      const slug = generateDefaultLangSlug(values.cardName);
      const assetsResult = await storeUploads({ files: assets, slug });

      const city = ctx.req.session!.city;
      // const lang = ctx.req.session!.lang;

      const nameValues = input.name.map(({ value }) => value);
      const cardNameValues = input.cardName.map(({ value }) => value);
      const exists = await ProductModel.exists({
        $or: [
          {
            'cities.key': city,
            'cities.node.name.value': {
              $in: nameValues,
            },
          },
          {
            'cities.key': city,
            'cities.node.cardName.value': {
              $in: cardNameValues,
            },
          },
        ],
      });

      if (exists) {
        return {
          success: false,
          message: 'exists.',
        };
      }

      const product = await ProductModel.findOneAndUpdate(
        {
          _id: id,
          'cities.key': city,
        },
        {
          $set: {
            'cities.$.node': {
              ...values,
              slug,
              assets: assetsResult,
            },
          },
        },
        {
          new: true,
        },
      );

      if (!product) {
        return {
          success: false,
          message: 'Ошибка обновления товара.',
        };
      }

      return {
        success: true,
        message: 'Товар обновлён.',
        product,
      };
    } catch (e) {
      return {
        success: false,
        message: 'Ошибка обновления товара.',
      };
    }
  }

  @FieldResolver()
  async name(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city.node.name, ctx.req.session!.lang);
  }

  @FieldResolver()
  async cardName(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city.node.cardName, ctx.req.session!.lang);
  }

  @FieldResolver()
  async slug(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return city.node.slug;
  }

  @FieldResolver()
  async description(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city.node.description, ctx.req.session!.lang);
  }

  @FieldResolver()
  async rubrics(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string[]> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return [];
    }
    return city.node.rubrics;
  }

  @FieldResolver()
  async attributesSource(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string | null> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return null;
    }
    return city.node.attributesSource;
  }

  @FieldResolver()
  async attributesGroups(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<ProductAttributesGroup[]> {
    try {
      const populated = await product
        .populate({
          path: 'cities.node.attributesGroups.node',
          model: 'AttributesGroup',
        })
        .populate({
          path: 'cities.node.attributesGroups.attributes.node',
          model: 'Attribute',
        })
        .execPopulate();
      const city = getCityData(populated.cities, ctx.req.session!.city);

      if (!city) {
        return [];
      }
      return city.node.attributesGroups;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  @FieldResolver()
  async assets(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<AssetType[]> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return [];
    }
    return city.node.assets;
  }

  @FieldResolver()
  async price(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<number> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return 0;
    }
    return city.node.price;
  }
}
