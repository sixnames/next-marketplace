import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import {
  Product,
  ProductAttributesGroup,
  ProductModel,
  ProductsCounters,
} from '../../entities/Product';
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
import del from 'del';
import { getMessageTranslation } from '../../config/translations';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { createProductSchema, updateProductSchema } from '@rg/validation';
import { ProductsCountersInput } from './ProductsCountersInput';

@ObjectType()
export class PaginatedProductsResponse extends PaginateType(Product) {
  @Field((_type) => Int, { nullable: true })
  activeProductsCount?: number;
}

@ObjectType()
class ProductPayloadType extends PayloadType() {
  @Field((_type) => Product, { nullable: true })
  product?: Product | null;
}

@Resolver((_of) => Product)
export class ProductResolver {
  @Query(() => Product)
  async getProduct(@Ctx() ctx: ContextInterface, @Arg('id', (_type) => ID) id: string) {
    return ProductModel.findOne({ _id: id, 'cities.key': ctx.req.session!.city });
  }

  @Query(() => PaginatedProductsResponse)
  async getAllProducts(
    @Ctx() ctx: ContextInterface,
    @Arg('input', { nullable: true }) input: ProductPaginateInput = {},
  ): Promise<PaginatedProductsResponse> {
    const city = ctx.req.session!.city;
    const {
      limit = 100,
      page = 1,
      sortBy = 'createdAt',
      sortDir = 'desc',
      countActiveProducts = false,
      ...args
    } = input;
    const query = getProductsFilter(args, city);
    const activeProductsQuery = getProductsFilter({ ...args, active: true }, city);

    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });

    const paginateResult = await ProductModel.paginate(query, options);

    return {
      ...paginateResult,
      activeProductsCount: countActiveProducts
        ? await ProductModel.countDocuments(activeProductsQuery)
        : 0,
    };
  }

  @Query(() => ProductsCounters)
  async getProductsCounters(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: ProductsCountersInput,
  ): Promise<ProductsCounters> {
    const city = ctx.req.session!.city;
    const activeProductsQuery = getProductsFilter({ ...input, active: true }, city);
    const allProductsQuery = getProductsFilter(input, city);

    return {
      activeProductsCount: await ProductModel.countDocuments(activeProductsQuery),
      totalProductsCount: await ProductModel.countDocuments(allProductsQuery),
    };
  }

  @Mutation(() => ProductPayloadType)
  async createProduct(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      await createProductSchema.validate(input);

      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;

      const { assets, ...values } = input;
      const slug = generateDefaultLangSlug(values.cardName);
      const assetsResult = await storeUploads({ files: assets, slug, city });

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
          message: getMessageTranslation(`product.create.duplicate.${lang}`),
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
              active: true,
            },
          },
        ],
      });

      if (!product) {
        return {
          success: false,
          message: getMessageTranslation(`product.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`product.create.success.${lang}`),
        product,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => ProductPayloadType)
  async updateProduct(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      await updateProductSchema.validate(input);

      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;

      const { id, assets, ...values } = input;
      const slug = generateDefaultLangSlug(values.cardName);
      const assetsResult = await storeUploads({ files: assets, slug, city });

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
          message: getMessageTranslation(`product.update.duplicate.${lang}`),
        };
      }

      const product = await ProductModel.findById(id);
      if (!product) {
        return {
          success: false,
          message: getMessageTranslation(`product.update.notFound.${lang}`),
        };
      }

      const currentCity = getCityData(product.cities, city);
      const filesPath = `./assets/${city}/${currentCity!.node.slug}`;
      const removedAssets = await del(filesPath);
      if (!removedAssets.length) {
        return {
          success: false,
          message: getMessageTranslation(`product.update.assetsError.${lang}`),
        };
      }

      const updatedProduct = await ProductModel.findOneAndUpdate(
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

      if (!updatedProduct) {
        return {
          success: false,
          message: getMessageTranslation(`product.update.updateError.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`product.update.success.${lang}`),
        product: updatedProduct,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => ProductPayloadType)
  async deleteProduct(
    @Ctx() ctx: ContextInterface,
    @Arg('id', () => ID) id: string,
  ): Promise<ProductPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;

      const product = await ProductModel.findOne({
        _id: id,
        'cities.key': city,
      });

      if (!product) {
        return {
          success: false,
          message: getMessageTranslation(`product.delete.notFound.${lang}`),
        };
      }

      const currentCity = getCityData(product.cities, city);
      const filesPath = `./assets/${city}/${currentCity!.node.slug}`;

      if (product.cities.length === 1) {
        const removed = await ProductModel.findByIdAndDelete(id);
        const removedAssets = await del(filesPath);

        if (!removed || !removedAssets) {
          return {
            success: false,
            message: getMessageTranslation(`product.delete.error.${lang}`),
          };
        }

        return {
          success: true,
          message: getMessageTranslation(`product.delete.success.${lang}`),
        };
      }

      const removed = await ProductModel.updateOne(
        {
          _id: id,
          'cities.key': city,
        },
        {
          $pull: {
            cities: {
              key: city,
            },
          },
        },
      );

      const removedAssets = await del(filesPath);

      if (!removed.ok || !removedAssets) {
        return {
          success: false,
          message: getMessageTranslation(`product.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`product.delete.success.${lang}`),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
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
    return city.node.assets.sort((a, b) => a.index - b.index);
  }

  @FieldResolver()
  async mainImage(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    const mainImage = city.node.assets.find(({ index }) => index === 0);

    if (!mainImage) {
      return '';
    }
    return mainImage.url;
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
