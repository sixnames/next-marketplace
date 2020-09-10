import {
  Arg,
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
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { DocumentType } from '@typegoose/typegoose';
import getCityData from '../../utils/getCityData';
import getLangField from '../../utils/translations/getLangField';
import { AssetType, LanguageType } from '../../entities/common';
import PayloadType from '../common/PayloadType';
import { CreateProductInput } from './CreateProductInput';
import storeUploads from '../../utils/assets/storeUploads';
import { generateDefaultLangSlug } from '../../utils/slug';
import { UpdateProductInput } from './UpdateProductInput';
import del from 'del';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { ProductsCountersInput } from './ProductsCountersInput';
import { AttributesGroup, AttributesGroupModel } from '../../entities/AttributesGroup';
import { RubricModel } from '../../entities/Rubric';
import getApiMessage from '../../utils/translations/getApiMessage';
import { createProductSchema, updateProductSchema } from '../../validation/productSchema';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { DEFAULT_PRIORITY } from '../../config';
import { Role } from '../../entities/Role';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = getOperationsConfigs(Product.name);

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
  @AuthMethod(operationConfigRead)
  async getProduct(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ) {
    return ProductModel.findOne({ _id: id, 'cities.key': city, ...customFilter });
  }

  @Query(() => Product)
  @AuthMethod(operationConfigRead)
  async getProductBySlug(
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('slug', (_type) => String) slug: string,
  ) {
    return ProductModel.findOne({
      cities: {
        $elemMatch: {
          key: city,
          'node.slug': slug,
        },
      },
    });
  }

  @Query(() => Product)
  async getProductCard(
    @SessionRole() sessionRole: Role,
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('slug', (_type) => String) slug: string,
  ) {
    // Increase product priority if user not stuff
    const { isStuff } = sessionRole;
    if (!isStuff) {
      await ProductModel.findOneAndUpdate(
        {
          cities: {
            $elemMatch: {
              key: city,
              'node.slug': slug,
            },
          },
        },
        {
          $inc: {
            'cities.$.node.priority': 1,
          },
        },
        { new: true },
      );
    }

    return ProductModel.findOne({
      cities: {
        $elemMatch: {
          key: city,
          'node.slug': slug,
        },
      },
    });
  }

  @Query(() => PaginatedProductsResponse)
  @AuthMethod(operationConfigRead)
  async getAllProducts(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('input', { nullable: true }) input: ProductPaginateInput,
  ): Promise<PaginatedProductsResponse> {
    const {
      limit = 100,
      page = 1,
      sortBy = 'createdAt',
      sortDir = 'desc',
      countActiveProducts = false,
      ...args
    } = input || {};
    const query = getProductsFilter(args, city);
    const activeProductsQuery = getProductsFilter({ ...args, active: true }, city);

    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });

    const paginateResult = await ProductModel.paginate({ ...query, ...customFilter }, options);
    const activeProductsCount = countActiveProducts
      ? await ProductModel.countDocuments(activeProductsQuery)
      : 0;

    return {
      ...paginateResult,
      activeProductsCount,
    };
  }

  @Query(() => ProductsCounters)
  async getProductsCounters(
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('input', { nullable: true, defaultValue: {} }) input: ProductsCountersInput,
  ): Promise<ProductsCounters> {
    const activeProductsQuery = getProductsFilter({ ...input, active: true }, city);
    const allProductsQuery = getProductsFilter(input, city);

    return {
      activeProductsCount: await ProductModel.countDocuments(activeProductsQuery),
      totalProductsCount: await ProductModel.countDocuments(allProductsQuery),
    };
  }

  @Query(() => [AttributesGroup])
  @AuthMethod(operationConfigRead)
  async getFeaturesAst(
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('selectedRubrics', (_type) => [ID]) selectedRubrics: string[],
  ): Promise<AttributesGroup[]> {
    try {
      const rubrics = await RubricModel.find({
        _id: { $in: selectedRubrics },
        'cities.key': city,
      })
        .select({ 'cities.node.attributesGroups': 1, 'cities.key': 1 })
        .lean()
        .exec();
      const attributesGroups = rubrics.reduce((acc: string[], rubric) => {
        const currentCity = getCityData(rubric.cities, city);
        if (!currentCity) {
          return acc;
        }

        const {
          node: { attributesGroups = [] },
        } = currentCity;

        const groups = attributesGroups.map((group) => group.node);

        return [...acc, ...groups];
      }, []);

      return AttributesGroupModel.find({ _id: { $in: attributesGroups } });
    } catch (e) {
      return [];
    }
  }

  @Mutation(() => ProductPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createProductSchema })
  async createProduct(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      const { assets, ...values } = input;
      const slug = generateDefaultLangSlug(values.cardName);
      const assetsResult = await storeUploads({ files: assets, slug, dist: city });

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
          message: await getApiMessage({ key: `products.create.duplicate`, lang }),
        };
      }

      const product = await ProductModel.create({
        cities: [
          {
            key: city,
            node: {
              ...values,
              slug,
              priority: DEFAULT_PRIORITY,
              assets: assetsResult,
              active: true,
            },
          },
        ],
      });

      if (!product) {
        return {
          success: false,
          message: await getApiMessage({ key: `products.create.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `products.create.success`, lang }),
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
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateProductSchema })
  async updateProduct(
    @Localization() { lang, city }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Product>,
    @Arg('input') input: UpdateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      const { id, assets, ...values } = input;

      const nameValues = input.name.map(({ value }) => value);
      const cardNameValues = input.cardName.map(({ value }) => value);
      const exists = await ProductModel.exists({
        $or: [
          {
            _id: { $ne: id },
            'cities.key': city,
            'cities.node.name.value': {
              $in: nameValues,
            },
          },
          {
            _id: { $ne: id },
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
          message: await getApiMessage({ key: `products.update.duplicate`, lang }),
        };
      }

      const product = await ProductModel.findOne({ _id: id, ...customFilter });
      if (!product) {
        return {
          success: false,
          message: await getApiMessage({ key: `products.update.notFound`, lang }),
        };
      }

      const slug = generateDefaultLangSlug(values.cardName);
      const assetsResult = await storeUploads({ files: assets, slug, dist: city });

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
          message: await getApiMessage({ key: `products.update.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `products.update.success`, lang }),
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
  @AuthMethod(operationConfigDelete)
  async deleteProduct(
    @Localization() { lang, city }: LocalizationPayloadInterface,
    @Arg('id', () => ID) id: string,
  ): Promise<ProductPayloadType> {
    try {
      const product = await ProductModel.findOne({
        _id: id,
        'cities.key': city,
      });

      if (!product) {
        return {
          success: false,
          message: await getApiMessage({ key: `products.delete.notFound`, lang }),
        };
      }

      const currentCity = getCityData(product.cities, city);

      if (!currentCity) {
        return {
          success: false,
          message: await getApiMessage({ key: `products.delete.notFound`, lang }),
        };
      }

      const filesPath = `./assets/${city}/${currentCity.node.slug}`;

      if (product.cities.length === 1) {
        const removed = await ProductModel.findByIdAndDelete(id);
        const removedAssets = await del(filesPath);

        if (!removed || !removedAssets) {
          return {
            success: false,
            message: await getApiMessage({ key: `products.delete.error`, lang }),
          };
        }

        return {
          success: true,
          message: await getApiMessage({ key: `products.delete.success`, lang }),
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
          message: await getApiMessage({ key: `products.delete.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `products.delete.success`, lang }),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver((_type) => String)
  async nameString(
    @Root() product: DocumentType<Product>,
    @Localization() { lang, city }: LocalizationPayloadInterface,
  ): Promise<string> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return '';
    }
    return getLangField(productCity.node.name, lang);
  }

  @FieldResolver((_type) => [LanguageType])
  async name(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<LanguageType[]> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return [];
    }
    return productCity.node.name;
  }

  @FieldResolver((_type) => String)
  async cardNameString(
    @Root() product: DocumentType<Product>,
    @Localization() { lang, city }: LocalizationPayloadInterface,
  ): Promise<string> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return '';
    }
    return getLangField(productCity.node.cardName, lang);
  }

  @FieldResolver((_type) => [LanguageType])
  async cardName(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<LanguageType[]> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return [];
    }
    return productCity.node.cardName;
  }

  @FieldResolver((_type) => String)
  async slug(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<string> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return '';
    }
    return productCity.node.slug;
  }

  @FieldResolver((_type) => Int)
  async priority(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<number> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return DEFAULT_PRIORITY;
    }
    return productCity.node.priority;
  }

  @FieldResolver((_type) => String)
  async descriptionString(
    @Root() product: DocumentType<Product>,
    @Localization() { lang, city }: LocalizationPayloadInterface,
  ): Promise<string> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return '';
    }
    return getLangField(productCity.node.description, lang);
  }

  @FieldResolver((_type) => [LanguageType])
  async description(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<LanguageType[]> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return [];
    }
    return productCity.node.description;
  }

  @FieldResolver((_type) => [String])
  async rubrics(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<string[]> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return [];
    }
    return productCity.node.rubrics;
  }

  @FieldResolver((_type) => [ProductAttributesGroup])
  async attributesGroups(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
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
      const productCity = getCityData(populated.cities, city);

      if (!productCity) {
        return [];
      }
      return productCity.node.attributesGroups;
    } catch (e) {
      return [];
    }
  }

  @FieldResolver((_type) => [AssetType])
  async assets(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<AssetType[]> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return [];
    }
    return productCity.node.assets.sort((a, b) => a.index - b.index);
  }

  @FieldResolver((_type) => String)
  async mainImage(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<string> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return '';
    }
    const mainImage = productCity.node.assets.find(({ index }) => index === 0);

    if (!mainImage) {
      return '';
    }
    return mainImage.url;
  }

  @FieldResolver((_type) => Int)
  async price(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<number> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return 0;
    }
    return productCity.node.price;
  }

  @FieldResolver((_type) => Boolean)
  async active(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<boolean> {
    const productCity = getCityData(product.cities, city);
    if (!productCity) {
      return false;
    }
    return productCity.node.active;
  }
}
