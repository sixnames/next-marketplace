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
  ProductConnection,
  ProductModel,
  ProductsCounters,
} from '../../entities/Product';
import PaginateType from '../common/PaginateType';
import { ProductPaginateInput } from './ProductPaginateInput';
import { getProductsFilter } from '../../utils/getProductsFilter';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { DocumentType } from '@typegoose/typegoose';
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
import {
  createProductConnectionSchema,
  createProductSchema,
  updateProductSchema,
} from '@yagu/validation';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { ASSETS_DIST_PRODUCTS } from '../../config';
import { Role } from '../../entities/Role';
import { updateModelViews } from '../../utils/updateModelViews';
import { AttributeModel } from '../../entities/Attribute';
import { CreateProductConnectionInput } from './CreateProductConnectionInput';
import { AddProductToConnectionInput } from './AddProductToConnectionInput';

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
    @Arg('id', (_type) => ID) id: string,
  ) {
    return ProductModel.findOne({ _id: id, ...customFilter });
  }

  @Query(() => Product)
  @AuthMethod(operationConfigRead)
  async getProductBySlug(@Arg('slug', (_type) => String) slug: string) {
    return ProductModel.findOne({ slug });
  }

  @Query(() => Product)
  async getProductCard(
    @SessionRole() sessionRole: Role,
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('slug', (_type) => String) slug: string,
  ): Promise<Product> {
    const product = await ProductModel.findOne({ slug });
    if (!product) {
      throw new Error('Product not found');
    }

    // Increase product priority
    const { isStuff } = sessionRole;
    if (!isStuff) {
      await updateModelViews({
        model: ProductModel,
        document: product,
        city,
        findCurrentView: ({ key }) => key === city,
      });
    }

    return product;
  }

  @Query(() => PaginatedProductsResponse)
  @AuthMethod(operationConfigRead)
  async getAllProducts(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Product>,
    @Arg('input', { nullable: true, defaultValue: {} }) input: ProductPaginateInput,
  ): Promise<PaginatedProductsResponse> {
    const {
      limit = 100,
      page = 1,
      sortBy = 'createdAt',
      sortDir = 'desc',
      countActiveProducts = false,
      ...args
    } = input;
    const query = getProductsFilter(args);
    const activeProductsQuery = getProductsFilter({ ...args, active: true });

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
    @Arg('input', { nullable: true, defaultValue: {} }) input: ProductsCountersInput,
  ): Promise<ProductsCounters> {
    const activeProductsQuery = getProductsFilter({ ...input, active: true });
    const allProductsQuery = getProductsFilter(input);

    return {
      activeProductsCount: await ProductModel.countDocuments(activeProductsQuery),
      totalProductsCount: await ProductModel.countDocuments(allProductsQuery),
    };
  }

  @Query(() => [AttributesGroup])
  @AuthMethod(operationConfigRead)
  async getFeaturesAst(
    @Arg('selectedRubrics', (_type) => [ID]) selectedRubrics: string[],
  ): Promise<AttributesGroup[]> {
    try {
      const rubrics = await RubricModel.find({
        _id: { $in: selectedRubrics },
      })
        .select({ attributesGroups: 1 })
        .lean()
        .exec();

      const attributesGroups = rubrics.reduce((acc: string[], { attributesGroups = [] }) => {
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      const { assets, ...values } = input;
      const slug = generateDefaultLangSlug(values.cardName);
      const assetsResult = await storeUploads({ files: assets, slug, dist: ASSETS_DIST_PRODUCTS });

      const product = await ProductModel.create({
        ...values,
        slug,
        priorities: [],
        connections: [],
        views: [],
        assets: assetsResult,
        active: true,
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Product>,
    @Arg('input') input: UpdateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      const { id, assets, ...values } = input;

      const product = await ProductModel.findOne({ _id: id, ...customFilter });
      if (!product) {
        return {
          success: false,
          message: await getApiMessage({ key: `products.update.notFound`, lang }),
        };
      }

      const slug = generateDefaultLangSlug(values.cardName);
      const assetsResult = await storeUploads({ files: assets, slug, dist: ASSETS_DIST_PRODUCTS });

      const updatedProduct = await ProductModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          ...values,
          slug,
          assets: assetsResult,
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('id', () => ID) id: string,
  ): Promise<ProductPayloadType> {
    try {
      const product = await ProductModel.findOne({
        _id: id,
      });

      if (!product) {
        return {
          success: false,
          message: await getApiMessage({ key: `products.delete.notFound`, lang }),
        };
      }

      const filesPath = `./assets/${ASSETS_DIST_PRODUCTS}/${product.slug}`;

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
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => ProductPayloadType)
  @ValidateMethod({ schema: createProductConnectionSchema })
  @AuthMethod(operationConfigUpdate)
  async createProductConnection(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateProductConnectionInput,
  ): Promise<ProductPayloadType> {
    try {
      const { productId, attributeId } = input;
      const attribute = await AttributeModel.findById(attributeId);
      const product = await ProductModel.findById(productId);

      if (!product || !attribute) {
        return {
          success: false,
          message: await getApiMessage({ key: `products.update.notFound`, lang }),
        };
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        product.id,
        {
          $push: {
            connections: {
              key: attribute.slug,
              attribute: attribute.id,
              products: [product.id],
            },
          },
        },
        { new: true },
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
        product: null,
      };
    }
  }

  // TODO validation
  @Mutation(() => ProductPayloadType)
  @AuthMethod(operationConfigUpdate)
  async addProductToConnection(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: AddProductToConnectionInput,
  ): Promise<ProductPayloadType> {
    try {
      const { productId, addProductId, connectionKey } = input;
      const product = await ProductModel.findById(productId);
      const addProduct = await ProductModel.findById(addProductId);
      console.log({ connectionKey, product, addProduct });

      return {
        success: false,
        message: await getApiMessage({ key: `products.update.notFound`, lang }),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
        product: null,
      };
    }
  }

  @FieldResolver((_type) => String)
  async nameString(
    @Root() product: DocumentType<Product>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(product.name, lang);
  }

  @FieldResolver((_type) => [LanguageType])
  async name(@Root() product: DocumentType<Product>): Promise<LanguageType[]> {
    return product.name;
  }

  @FieldResolver((_type) => String)
  async cardNameString(
    @Root() product: DocumentType<Product>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(product.cardName, lang);
  }

  @FieldResolver((_type) => [LanguageType])
  async cardName(@Root() product: DocumentType<Product>): Promise<LanguageType[]> {
    return product.cardName;
  }

  @FieldResolver((_type) => String)
  async slug(@Root() product: DocumentType<Product>): Promise<string> {
    return product.slug;
  }

  @FieldResolver((_type) => String)
  async descriptionString(
    @Root() product: DocumentType<Product>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(product.description, lang);
  }

  @FieldResolver((_type) => [LanguageType])
  async description(@Root() product: DocumentType<Product>): Promise<LanguageType[]> {
    return product.description;
  }

  @FieldResolver((_type) => [String])
  async rubrics(@Root() product: DocumentType<Product>): Promise<string[]> {
    return product.rubrics;
  }

  @FieldResolver((_type) => [ProductAttributesGroup])
  async attributesGroups(
    @Root() product: DocumentType<Product>,
  ): Promise<ProductAttributesGroup[]> {
    try {
      const populated = await product
        .populate({
          path: 'attributesGroups.node',
          model: 'AttributesGroup',
        })
        .populate({
          path: 'attributesGroups.attributes.node',
          model: 'Attribute',
        })
        .execPopulate();
      return populated.attributesGroups;
    } catch (e) {
      return [];
    }
  }

  @FieldResolver((_type) => [AssetType])
  async assets(@Root() product: DocumentType<Product>): Promise<AssetType[]> {
    return product.assets.sort((a, b) => a.index - b.index);
  }

  @FieldResolver((_type) => String)
  async mainImage(@Root() product: DocumentType<Product>): Promise<string> {
    const mainImage = product.assets.find(({ index }) => index === 0);

    if (!mainImage) {
      return '';
    }
    return mainImage.url;
  }

  @FieldResolver((_type) => Int)
  async price(@Root() product: DocumentType<Product>): Promise<number> {
    return product.price;
  }

  @FieldResolver((_type) => Boolean)
  async active(@Root() product: DocumentType<Product>): Promise<boolean> {
    return product.active;
  }

  @FieldResolver((_returns) => [ProductConnection])
  async connections(@Root() product: DocumentType<Product>): Promise<ProductConnection[]> {
    try {
      // Populate all nested fields and
      // exclude current product from all connections
      const populated = await product
        .populate({
          path: 'connections.attribute',
          model: 'Attribute',
        })
        .populate({
          path: 'connections.products',
          model: 'Product',
          match: {
            _id: { $ne: product.id },
          },
        })
        .execPopulate();
      return populated.connections;
    } catch (e) {
      return [];
    }
  }

  @FieldResolver()
  async id(@Root() product: DocumentType<Product>): Promise<string> {
    return product.id || product._id;
  }
}
