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
import { Product, ProductModel } from '../../entities/Product';
import PaginateType from '../commonInputs/PaginateType';
import { ProductPaginateInput } from './ProductPaginateInput';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { DocumentType } from '@typegoose/typegoose';
import PayloadType from '../commonInputs/PayloadType';
import { CreateProductInput } from './CreateProductInput';
import storeUploads from '../../utils/assets/storeUploads';
import {
  checkIsAllConnectionOptionsUsed,
  createProductSlugWithConnections,
  getConnectionValuesFromProduct,
  getProductAttributeReadableValues,
} from '../../utils/connectios';
import { UpdateProductInput } from './UpdateProductInput';
import del from 'del';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { ProductsCountersInput } from './ProductsCountersInput';
import { AttributesGroup, AttributesGroupModel } from '../../entities/AttributesGroup';
import { RubricModel } from '../../entities/Rubric';
import {
  addProductToConnectionSchema,
  createProductConnectionSchema,
  createProductSchema,
  deleteProductFromConnectionSchema,
  updateProductSchema,
} from '@yagu/validation';
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
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { CreateProductConnectionInput } from './CreateProductConnectionInput';
import { AddProductToConnectionInput } from './AddProductToConnectionInput';
import { DeleteProductFromConnectionInput } from './DeleteProductFromConnectionInput';
import {
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  SORT_ASC,
} from '@yagu/config';
import { generateDefaultLangSlug } from '../../utils/slug';
import {
  ProductCardConnection,
  ProductCardConnectionItem,
} from '../../entities/ProductCardConnection';
import { RoleRuleModel } from '../../entities/RoleRule';
import { Option, OptionModel } from '../../entities/Option';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import { ShopModel } from '../../entities/Shop';
import { max, min } from 'lodash';
import { getCurrencyString } from '@yagu/shared';
import { ProductAttribute } from '../../entities/ProductAttribute';
import { ProductAttributesGroup } from '../../entities/ProductAttributesGroup';
import { ProductCardFeatures } from '../../entities/ProductCardFeatures';
import { ProductCardPrices } from '../../entities/ProductCardPrices';
import { ProductsCounters } from '../../entities/ProductsCounters';
import { ProductConnectionItem } from '../../entities/ProductConnectionItem';
import { ProductConnection, ProductConnectionModel } from '../../entities/ProductConnection';
import { Asset } from '../../entities/Asset';
import { ProductShopsInput } from './ProductShopsInput';
import { GetProductShopsInput } from './GetProductShopsInput';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Product.name);

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
    const query = ProductModel.getProductsFilter(args);
    const activeProductsQuery = ProductModel.getProductsFilter({ ...args, active: true });

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
    const activeProductsQuery = ProductModel.getProductsFilter({ ...input, active: true });
    const allProductsQuery = ProductModel.getProductsFilter(input);

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

  @Query(() => [ShopProduct])
  async getProductShops(
    @Arg('input') input: GetProductShopsInput,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<ShopProduct[]> {
    try {
      const { sortDir, sortBy, productId } = input;
      return ShopProductModel.find({ product: productId, city }).sort([[sortBy, sortDir]]);
    } catch (e) {
      return [];
    }
  }

  @Mutation(() => ProductPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createProductSchema })
  async createProduct(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
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
        views: [],
        assets: assetsResult,
        active: true,
      });

      if (!product) {
        return {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`products.create.success`),
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
    @Localization() { getApiMessage, lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Product>,
    @Arg('input') input: UpdateProductInput,
  ): Promise<ProductPayloadType> {
    try {
      const { id, assets, ...values } = input;

      const product = await ProductModel.findOne({ _id: id, ...customFilter });
      if (!product) {
        return {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
      }

      // Create new slug for product
      const { slug } = await createProductSlugWithConnections({
        product,
        lang,
      });
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
          message: await getApiMessage(`products.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`products.update.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', () => ID) id: string,
  ): Promise<ProductPayloadType> {
    try {
      const product = await ProductModel.findOne({
        _id: id,
      });

      if (!product) {
        return {
          success: false,
          message: await getApiMessage(`products.delete.notFound`),
        };
      }

      const filesPath = `./assets/${ASSETS_DIST_PRODUCTS}/${product.slug}`;

      const removed = await ProductModel.findByIdAndDelete(id);
      const removedAssets = await del(filesPath);

      if (!removed || !removedAssets) {
        return {
          success: false,
          message: await getApiMessage(`products.delete.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`products.delete.success`),
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
    @Localization() { getApiMessage, lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateProductConnectionInput,
  ): Promise<ProductPayloadType> {
    try {
      const { productId, attributeId, attributesGroupId } = input;
      const attribute = await AttributeModel.findById(attributeId);
      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);
      const product = await ProductModel.findById(productId);

      if (!product || !attribute || !attributesGroup) {
        return {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
      }

      if (attribute.variant !== ATTRIBUTE_VARIANT_SELECT) {
        return {
          success: false,
          message: await getApiMessage(`products.update.attributeVariantError`),
        };
      }

      // Check if connection already exist
      const exist = await ProductConnectionModel.findOne({
        attributesGroupId,
        attributeId,
        productsIds: { $in: [productId] },
      });

      if (exist) {
        return {
          success: false,
          message: await getApiMessage(`products.connection.exist`),
        };
      }

      const connection = await ProductConnectionModel.create({
        attributeId: attribute.id,
        attributesGroupId: attributesGroup.id,
        productsIds: [product.id],
      });

      if (!connection) {
        return {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
      }

      // Create new slug for product
      const { slug } = await createProductSlugWithConnections({
        product,
        lang,
      });

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        product.id,
        {
          slug,
        },
        {
          new: true,
        },
      );

      if (!updatedProduct) {
        return {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`products.update.success`),
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

  @Mutation(() => ProductPayloadType)
  @ValidateMethod({ schema: addProductToConnectionSchema })
  @AuthMethod(operationConfigUpdate)
  async addProductToConnection(
    @Localization() { getApiMessage, lang }: LocalizationPayloadInterface,
    @Arg('input') input: AddProductToConnectionInput,
  ): Promise<ProductPayloadType> {
    try {
      const { productId, connectionId, addProductId } = input;
      const product = await ProductModel.findById(productId);
      const addProduct = await ProductModel.findById(addProductId);
      const connection = await ProductConnectionModel.findById(connectionId);

      if (!product || !addProduct || !connection) {
        return {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
      }

      // Check if all attribute options are used for connection
      const allOptionsAreUsed = await checkIsAllConnectionOptionsUsed({ connectionId });
      if (allOptionsAreUsed) {
        return {
          success: false,
          message: await getApiMessage('products.update.allOptionsAreUsed'),
        };
      }

      // Check attribute existence in added product
      // It will throw an Error if attribute not exist
      await getConnectionValuesFromProduct({
        product: addProduct,
        attributeId: connection.attributeId,
        attributesGroupId: connection.attributesGroupId,
        lang,
      });

      const updatedConnection = await ProductConnectionModel.findByIdAndUpdate(
        connection.id,
        {
          $addToSet: {
            productsIds: addProduct.id,
          },
        },
        { new: true },
      );

      if (!updatedConnection) {
        return {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
      }

      // Create new slug for added product
      const { slug } = await createProductSlugWithConnections({
        product: addProduct,
        lang,
      });

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        addProduct.id,
        {
          slug,
        },
        {
          new: true,
        },
      );

      if (!updatedProduct) {
        return {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`products.update.success`),
        product,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
        product: null,
      };
    }
  }

  @Mutation(() => ProductPayloadType)
  @ValidateMethod({ schema: deleteProductFromConnectionSchema })
  @AuthMethod(operationConfigUpdate)
  async deleteProductFromConnection(
    @Localization() { getApiMessage, lang }: LocalizationPayloadInterface,
    @Arg('input') input: DeleteProductFromConnectionInput,
  ): Promise<ProductPayloadType> {
    try {
      const { productId, connectionId, deleteProductId } = input;
      const product = await ProductModel.findById(productId);
      const deleteProduct = await ProductModel.findById(deleteProductId);
      const connection = await ProductConnectionModel.findById(connectionId);
      const minimumProductsCountForConnectionDelete = 1;

      if (!product || !deleteProduct || !connection) {
        return {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
      }

      // Update or delete connection
      if (connection.productsIds.length > minimumProductsCountForConnectionDelete) {
        const updatedConnection = await ProductConnectionModel.findByIdAndUpdate(
          connection.id,
          {
            $pull: {
              productsIds: deleteProduct.id,
            },
          },
          { new: true },
        );

        if (!updatedConnection) {
          return {
            success: false,
            message: await getApiMessage(`products.update.error`),
          };
        }
      } else {
        const removedConnection = await ProductConnectionModel.deleteOne({ _id: connection.id });

        if (!removedConnection.ok) {
          return {
            success: false,
            message: await getApiMessage(`products.update.error`),
          };
        }
      }

      // Create new slug for removed product from connection
      const { slug } = await createProductSlugWithConnections({
        product: deleteProduct,
        lang,
      });

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        deleteProduct.id,
        {
          slug,
        },
        {
          new: true,
        },
      );

      if (!updatedProduct) {
        return {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`products.update.success`),
        product,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
        product: null,
      };
    }
  }

  // Field resolvers
  @FieldResolver((_type) => String)
  async nameString(
    @Root() product: DocumentType<Product>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(product.name);
  }

  @FieldResolver((_type) => String)
  async cardNameString(
    @Root() product: DocumentType<Product>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(product.cardName);
  }

  @FieldResolver((_type) => String)
  async descriptionString(
    @Root() product: DocumentType<Product>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(product.description);
  }

  @FieldResolver((_type) => [Asset])
  async assets(@Root() product: DocumentType<Product>): Promise<Asset[]> {
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

  @FieldResolver((_returns) => [ProductConnection])
  async connections(@Root() product: DocumentType<Product>): Promise<ProductConnection[]> {
    try {
      return ProductConnectionModel.find({
        productsIds: {
          $in: [product.id],
        },
      });
    } catch (e) {
      return [];
    }
  }

  @FieldResolver((_returns) => Int)
  async shopsCount(
    @Root() product: DocumentType<Product>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<number> {
    const shopsProducts = await ShopProductModel.find({ product: product.id, city }, { _id: 1 })
      .lean()
      .exec();
    const shopsProductsIds = shopsProducts.map(({ _id }) => _id);
    return ShopModel.countDocuments({ products: { $in: shopsProductsIds } });
  }

  @FieldResolver((_returns) => [ShopProduct])
  async shops(
    @Localization() { city }: LocalizationPayloadInterface,
    @Root() product: DocumentType<Product>,
    @Arg('input', {
      nullable: true,
      defaultValue: {
        sortDir: SORT_ASC,
        sortBy: 'price',
      },
    })
    input: ProductShopsInput,
  ): Promise<ShopProduct[]> {
    try {
      const { sortDir, sortBy } = input;
      return ShopProductModel.find({ product: product.id, city }).sort([[sortBy, sortDir]]);
    } catch (e) {
      return [];
    }
  }

  @FieldResolver((_returns) => ProductCardPrices)
  async cardPrices(
    @Localization() { lang, city }: LocalizationPayloadInterface,
    @Root() product: DocumentType<Product>,
  ): Promise<ProductCardPrices> {
    try {
      const shopsProducts = await ShopProductModel.find({
        $and: [{ $or: [{ product: product.id }, { product: product._id }] }, { city }],
      })
        .select('price')
        .lean()
        .exec();
      const allPrices = shopsProducts.map(({ price }) => price);

      return {
        min: getCurrencyString({ value: min(allPrices), lang }),
        max: getCurrencyString({ value: max(allPrices), lang }),
      };
    } catch (e) {
      return {
        min: '0',
        max: '0',
      };
    }
  }

  @FieldResolver((_returns) => ProductCardFeatures)
  async cardFeatures(@Root() product: DocumentType<Product>): Promise<ProductCardFeatures> {
    try {
      // Get ids of attributes used in connections
      const connections = await ProductConnectionModel.find({
        productsIds: {
          $in: [product.id],
        },
      }).select({ attributeId: 1 });

      const attributesIdsInConnections = connections.map(({ attributeId }) => attributeId);

      const features: ProductCardFeatures = {
        listFeatures: [],
        textFeatures: [],
        tagFeatures: [],
        iconFeatures: [],
        ratingFeatures: [],
      };

      for await (const productAttributesGroup of product.attributesGroups) {
        if (!productAttributesGroup.showInCard) {
          continue;
        }

        // Find all attributes values
        for await (const productAttribute of productAttributesGroup.attributes) {
          if (!productAttribute.showInCard) {
            continue;
          }

          // Exclude attributes used in connections
          const attribute = await AttributeModel.findOne({
            $and: [{ _id: productAttribute.node }, { _id: { $nin: attributesIdsInConnections } }],
          });
          if (!attribute) {
            continue;
          }

          if (productAttribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_LIST) {
            features.listFeatures.push(productAttribute);
          }

          if (productAttribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_TEXT) {
            features.textFeatures.push(productAttribute);
          }

          if (productAttribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_TAG) {
            features.tagFeatures.push(productAttribute);
          }

          if (productAttribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_ICON) {
            features.iconFeatures.push(productAttribute);
          }

          if (productAttribute.viewVariant === ATTRIBUTE_VIEW_VARIANT_OUTER_RATING) {
            features.ratingFeatures.push(productAttribute);
          }
        }
      }

      return features;
    } catch (e) {
      return {
        listFeatures: [],
        textFeatures: [],
        tagFeatures: [],
        iconFeatures: [],
        ratingFeatures: [],
      };
    }
  }

  @FieldResolver((_returns) => [ProductCardConnection])
  async cardConnections(
    @Root() product: DocumentType<Product>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<ProductCardConnection[]> {
    try {
      // Get all product connections
      const connections = await ProductConnectionModel.find({
        productsIds: {
          $in: [product.id],
        },
      });

      // Cast connections data for product card
      const cardConnections: ProductCardConnection[] = [];
      for await (const connection of connections) {
        const attribute = await AttributeModel.findById(connection.attributeId);
        const products = await ProductModel.find({ _id: { $in: connection.productsIds } });

        if (!attribute) {
          continue;
        }

        cardConnections.push({
          id: connection.id,
          nameString: getLangField(attribute.name),
          products: products.reduce((acc: ProductCardConnectionItem[], connectionProduct) => {
            const productAttributesGroup = connectionProduct.attributesGroups.find(({ node }) => {
              return node.toString() === connection.attributesGroupId.toString();
            });
            if (!productAttributesGroup) {
              return acc;
            }

            const productAttribute = productAttributesGroup.attributes.find(({ node }) => {
              return node.toString() === connection.attributeId.toString();
            });
            if (!productAttribute) {
              return acc;
            }

            const productConnectionValue = productAttribute.value[0];
            if (!productConnectionValue) {
              return acc;
            }

            return [
              ...acc,
              {
                id: connectionProduct.id,
                value: productConnectionValue,
                isCurrent: connectionProduct.id.toString() === product.id.toString(),
                product: connectionProduct,
              },
            ];
          }, []),
        });
      }

      return cardConnections;
    } catch (e) {
      return [];
    }
  }

  @FieldResolver()
  async id(@Root() product: DocumentType<Product>): Promise<string> {
    return product.id || product._id;
  }
}

@Resolver((_for) => ProductConnection)
export class ProductConnectionResolver {
  @FieldResolver((_returns) => [ProductConnectionItem])
  async products(
    @Root() connection: DocumentType<ProductConnection>,
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('activeOnly', () => Boolean, {
      description: 'Shows only active products.',
      nullable: true,
      defaultValue: false,
    })
    activeOnly: boolean,
  ): Promise<ProductConnectionItem[]> {
    const { attributeId, attributesGroupId } = connection;
    const activeQuery = activeOnly ? { active: true } : {};
    const products = await ProductModel.find({
      _id: { $in: connection.productsIds },
      ...activeQuery,
    });
    return Promise.all(
      products.map(async (product) => {
        const { attributeValue, optionName } = await getConnectionValuesFromProduct({
          lang,
          product,
          attributeId,
          attributesGroupId,
        });

        return {
          node: product,
          value: attributeValue,
          optionName,
        };
      }),
    );
  }

  @FieldResolver((_returns) => Attribute)
  async attribute(@Root() connection: DocumentType<ProductConnection>): Promise<Attribute> {
    const attribute = await AttributeModel.findById(connection.attributeId);
    if (!attribute) {
      throw Error('Attribute not found on ProductConnection.attribute');
    }
    return attribute;
  }
}

@Resolver((_for) => ProductAttributesGroup)
export class ProductAttributesGroupResolver {
  @FieldResolver((_returns) => AttributesGroup)
  async node(
    @Root() productAttributesGroup: DocumentType<ProductAttributesGroup>,
  ): Promise<AttributesGroup> {
    const attributesGroup = await AttributesGroupModel.findById(productAttributesGroup.node);
    if (!attributesGroup) {
      throw Error('Attributes group not found on ProductAttributesGroup.node');
    }
    return attributesGroup;
  }
}

@Resolver((_for) => ProductAttribute)
export class ProductAttributeResolver {
  @FieldResolver((_returns) => Attribute)
  async node(@Root() productAttribute: DocumentType<ProductAttribute>): Promise<Attribute> {
    const attribute = await AttributeModel.findById(productAttribute.node);
    if (!attribute) {
      throw Error('Attribute not found on ProductAttributeResolver.node');
    }
    return attribute;
  }

  @FieldResolver((_returns) => [String])
  async readableOptions(
    @Root() productAttribute: DocumentType<ProductAttribute>,
  ): Promise<Option[]> {
    const attribute = await AttributeModel.findById(productAttribute.node);
    if (!attribute) {
      throw Error('Attribute not found on ProductAttributeResolver.readableOptions');
    }

    if (!attribute.optionsGroup) {
      return [];
    }

    const optionsGroup = await OptionsGroupModel.findById(attribute.optionsGroup);
    if (!optionsGroup) {
      throw Error('Options group not found on ProductAttributeResolver.readableOptions');
    }

    const options = await OptionModel.find({
      $and: [
        {
          _id: { $in: optionsGroup.options },
        },
        {
          slug: { $in: productAttribute.value },
        },
      ],
    });
    if (!options) {
      throw Error('Options not found on ProductAttributeResolver.readableOptions');
    }

    return options;
  }

  @FieldResolver((_returns) => [String])
  async readableValue(
    @Root() productAttribute: DocumentType<ProductAttribute>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string[]> {
    const attribute = await AttributeModel.findById(productAttribute.node);
    if (!attribute) {
      throw Error('Attribute not found on ProductAttributeResolver.readableValue');
    }
    return getProductAttributeReadableValues({
      lang,
      productAttributeValues: productAttribute.value,
      attribute,
    });
  }
}
