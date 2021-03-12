import { noNaN } from 'lib/numbers';
import { createProductSlugWithConnections } from 'lib/productConnectiosUtils';
import { recalculateRubricProductCounters } from 'lib/rubricUtils';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributeModel,
  ManufacturerModel,
  OptionModel,
  OptionsGroupModel,
  ProductConnectionModel,
  ProductModel,
  ProductPayloadModel,
  RubricModel,
} from 'db/dbModels';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams, getResolverValidationSchema, getSessionRole } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_OPTIONS_GROUPS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { ASSETS_DIST_PRODUCTS, ATTRIBUTE_VARIANT_SELECT, VIEWS_COUNTER_STEP } from 'config/common';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  addProductToConnectionSchema,
  createProductConnectionSchema,
  createProductSchema,
  deleteProductFromConnectionSchema,
  addProductAssetsSchema,
  updateProductSchema,
} from 'validation/productSchema';
import { deleteUpload, reorderAssets, storeUploads } from 'lib/assets';

export const ProductPayload = objectType({
  name: 'ProductPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Product',
    });
  },
});

export const ProductAttributeInput = inputObjectType({
  name: 'ProductAttributeInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.boolean('showInCard');
    t.nonNull.boolean('showAsBreadcrumb');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.nonNull.json('attributeNameI18n');
    t.nonNull.field('attributeViewVariant', {
      type: 'AttributeViewVariant',
    });
    t.nonNull.field('attributeVariant', {
      type: 'AttributeVariant',
    });
    t.json('textI18n');
    t.float('number');
    t.nonNull.list.nonNull.field('selectedOptionsSlugs', {
      type: 'String',
      description: 'List of selected options slug',
    });
  },
});

export const CreateProductInput = inputObjectType({
  name: 'CreateProductInput',
  definition(t) {
    t.nonNull.boolean('active');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.list.nonNull.upload('assets');
    t.nonNull.objectId('rubricId');
    t.string('brandSlug');
    t.string('brandCollectionSlug');
    t.string('manufacturerSlug');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttributeInput',
    });
  },
});

export const UpdateProductAssetsInput = inputObjectType({
  name: 'AddProductAssetsInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.list.nonNull.upload('assets');
  },
});

export const DeleteProductAssetInput = inputObjectType({
  name: 'DeleteProductAssetInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.int('assetIndex');
  },
});

export const UpdateProductAssetIndexInput = inputObjectType({
  name: 'UpdateProductAssetIndexInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.string('assetUrl');
    t.nonNull.int('assetNewIndex');
  },
});

export const UpdateProductInput = inputObjectType({
  name: 'UpdateProductInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.boolean('active');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.objectId('rubricId');
    t.string('brandSlug');
    t.string('brandCollectionSlug');
    t.string('manufacturerSlug');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttributeInput',
    });
  },
});

export const CreateProductConnectionInput = inputObjectType({
  name: 'CreateProductConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('attributeId');
  },
});

export const AddProductToConnectionInput = inputObjectType({
  name: 'AddProductToConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('addProductId');
    t.nonNull.objectId('connectionId');
  },
});

export const DeleteProductFromConnectionInput = inputObjectType({
  name: 'DeleteProductFromConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('deleteProductId');
    t.nonNull.objectId('connectionId');
  },
});

export const UpdateProductCounterInput = inputObjectType({
  name: 'UpdateProductCounterInput',
  definition(t) {
    t.nonNull.string('productSlug');
  },
});

// Product Mutations
export const ProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create product
    t.nonNull.field('createProduct', {
      type: 'ProductPayload',
      description: 'Should create product',
      args: {
        input: nonNull(
          arg({
            type: 'CreateProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createProductSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
          const brandsCollection = db.collection<ProductModel>(COL_BRANDS);
          const brandCollectionsCollection = db.collection<ProductModel>(COL_BRAND_COLLECTIONS);
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const { input } = args;
          const { manufacturerSlug, brandSlug, brandCollectionSlug, rubricId, ...values } = input;

          const manufacturerEntity = manufacturerSlug
            ? await manufacturersCollection.findOne({ slug: manufacturerSlug })
            : null;
          const brandEntity = brandSlug
            ? await brandsCollection.findOne({ slug: brandSlug })
            : null;
          const brandCollectionEntity = brandCollectionSlug
            ? await brandCollectionsCollection.findOne({
                slug: brandCollectionSlug,
              })
            : null;

          // Store product assets
          const itemId = await getNextItemId(COL_PRODUCTS);
          const assets = await storeUploads({
            itemId,
            dist: ASSETS_DIST_PRODUCTS,
            files: input.assets,
          });

          // Get selected options
          const selectedOptionsSlugs = values.attributes.reduce((acc: string[], attributeInput) => {
            const { selectedOptionsSlugs } = attributeInput;
            return [...acc, ...selectedOptionsSlugs];
          }, []);
          const optionsGroups = await optionsGroupsCollection
            .find({
              'options.slug': { $in: selectedOptionsSlugs },
            })
            .toArray();
          const options = optionsGroups.reduce((acc: OptionModel[], optionsGroup) => {
            return [...acc, ...optionsGroup.options];
          }, []);

          // Create product
          const slug = generateDefaultLangSlug(values.nameI18n);

          const createdProductResult = await productsCollection.insertOne({
            ...values,
            itemId,
            assets,
            slug,
            manufacturerSlug: manufacturerEntity ? manufacturerEntity.slug : undefined,
            brandSlug: brandEntity ? brandEntity.slug : undefined,
            brandCollectionSlug: brandCollectionEntity ? brandCollectionEntity.slug : undefined,
            active: true,
            priorities: {},
            views: {},
            shopProductsIds: [],
            shopProductsCountCities: {},
            minPriceCities: {},
            maxPriceCities: {},
            connections: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            rubricId,
            selectedOptionsSlugs,
            attributes: values.attributes.map((attributeInput) => {
              let selectedOptions: OptionModel[] = [];
              const { selectedOptionsSlugs } = attributeInput;
              if (selectedOptionsSlugs.length > 0) {
                selectedOptions = options.filter(({ slug }) => selectedOptionsSlugs.includes(slug));
              }
              return {
                ...attributeInput,
                selectedOptions,
              };
            }),
          });

          const createdProduct = createdProductResult.ops[0];
          if (!createdProductResult.result.ok || !createdProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.create.error`),
            };
          }

          // Recalculate rubric
          await recalculateRubricProductCounters({ rubricId });

          return {
            success: true,
            message: await getApiMessage('products.create.success'),
            payload: createdProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product
    t.nonNull.field('updateProduct', {
      type: 'ProductPayload',
      description: 'Should update product',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateProductSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
          const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
          const { input } = args;
          const { productId, rubricId, ...values } = input;

          // Get selected rubrics
          const rubrics = await rubricsCollection.find({ _id: rubricId }).toArray();
          const rubricsSlugs = rubrics.map(({ slug }) => slug);

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Get selected options
          const selectedOptionsSlugs = values.attributes.reduce((acc: string[], attributeInput) => {
            const { selectedOptionsSlugs } = attributeInput;
            return [...acc, ...selectedOptionsSlugs];
          }, []);
          const optionsGroups = await optionsGroupsCollection
            .find({
              'options.slug': { $in: selectedOptionsSlugs },
            })
            .toArray();
          const options = optionsGroups.reduce((acc: OptionModel[], optionsGroup) => {
            return [...acc, ...optionsGroup.options];
          }, []);

          // Create new slug for product
          const { updatedSlug } = createProductSlugWithConnections({
            product,
            connections: product.connections,
          });

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                ...values,
                slug: updatedSlug,
                updatedAt: new Date(),
                rubricId,
                selectedOptionsSlugs: [...rubricsSlugs, ...selectedOptionsSlugs],
                attributes: values.attributes.map((attributeInput) => {
                  let selectedOptions: OptionModel[] = [];
                  const { selectedOptionsSlugs } = attributeInput;
                  if (selectedOptionsSlugs.length > 0) {
                    selectedOptions = options.filter(({ slug }) =>
                      selectedOptionsSlugs.includes(slug),
                    );
                  }
                  return {
                    ...attributeInput,
                    selectedOptions,
                  };
                }),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Recalculate rubric
          await recalculateRubricProductCounters({ rubricId });

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add product assets
    t.nonNull.field('addProductAssets', {
      type: 'ProductPayload',
      description: 'Should add product assets',
      args: {
        input: nonNull(
          arg({
            type: 'AddProductAssetsInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addProductAssetsSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Update product assets
          const sortedAssets = product.assets.sort((assetA, assetB) => {
            return assetB.index - assetA.index;
          });
          const firstAsset = sortedAssets[0];
          const startIndex = noNaN(firstAsset?.index);
          const assets = await storeUploads({
            itemId: product.itemId,
            dist: ASSETS_DIST_PRODUCTS,
            files: input.assets,
            startIndex,
          });

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                updatedAt: new Date(),
              },
              $push: {
                assets: {
                  $each: assets,
                },
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete product asset
    t.nonNull.field('deleteProductAsset', {
      type: 'ProductPayload',
      description: 'Should update product assets',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductAssetInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, assetIndex } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Delete product asset
          const currentAsset = product.assets.find(({ index }) => index === assetIndex);
          const removedAsset = await deleteUpload({ filePath: `${currentAsset?.url}` });
          if (!removedAsset) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                updatedAt: new Date(),
              },
              $pull: {
                assets: {
                  index: assetIndex,
                },
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product asset index
    t.nonNull.field('updateProductAssetIndex', {
      type: 'ProductPayload',
      description: 'Should update product asset index',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductAssetIndexInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, assetNewIndex, assetUrl } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Reorder assets
          const reorderedAssetsWithUpdatedIndexes = reorderAssets({
            assetUrl,
            assetNewIndex,
            initialAssets: product.assets,
          });
          if (!reorderedAssetsWithUpdatedIndexes) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                assets: reorderedAssetsWithUpdatedIndexes,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should create product connection
    t.nonNull.field('createProductConnection', {
      type: 'ProductPayload',
      description: 'Should create product connection',
      args: {
        input: nonNull(
          arg({
            type: 'CreateProductConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createProductConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const { input } = args;
          const { productId, attributeId } = input;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const attribute = await attributesCollection.findOne({ _id: attributeId });

          if (!product || !attribute) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Check attribute variant. Must be as Select
          if (attribute.variant !== ATTRIBUTE_VARIANT_SELECT) {
            return {
              success: false,
              message: await getApiMessage(`products.update.attributeVariantError`),
            };
          }

          // Check if connection already exist
          const exist = product.connections.some((connection) => {
            return connection.attributeId.equals(attributeId);
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.exist`),
            };
          }

          // Find current attribute in product
          const productAttribute = product.attributes.find((productAttribute) => {
            return productAttribute.attributeId.equals(attributeId);
          });
          if (!productAttribute) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Find current option
          const option = attribute.options.find(({ slug }) => {
            return slug === productAttribute.selectedOptionsSlugs[0];
          });
          if (!option) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Create connection
          const createdConnection: ProductConnectionModel = {
            _id: new ObjectId(),
            attributeId: attribute._id,
            attributeSlug: attribute.slug,
            attributeNameI18n: attribute.nameI18n,
            attributeVariant: attribute.variant,
            attributeViewVariant: attribute.viewVariant,
            connectionProducts: [
              {
                _id: productId,
                option: {
                  ...option,
                  options: [],
                },
                productId,
              },
            ],
          };

          // Create new slug for product
          const { updatedSlug } = createProductSlugWithConnections({
            product,
            connections: [...product.connections, createdConnection],
          });

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                slug: updatedSlug,
                updatedAt: new Date(),
              },
              $push: {
                connections: createdConnection,
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.connection.createSuccess'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add product to connection
    t.nonNull.field('addProductToConnection', {
      type: 'ProductPayload',
      description: 'Should create product connection',
      args: {
        input: nonNull(
          arg({
            type: 'AddProductToConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addProductToConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, addProductId, connectionId } = input;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const addProduct = await productsCollection.findOne({ _id: addProductId });
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const connection = product?.connections.find(({ _id }) => {
            return _id.equals(connectionId);
          });

          const attribute = connection
            ? await attributesCollection.findOne({ _id: connection.attributeId })
            : null;

          if (!product || !addProduct || !connection || !attribute) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Check attribute existence in added product
          const attributeExist = addProduct.attributes.some((productAttribute) => {
            return productAttribute.attributeId.equals(connection.attributeId);
          });
          if (!attributeExist) {
            return {
              success: false,
              message: await getApiMessage('products.connection.noAttributeError'),
            };
          }

          // Check attribute value in added product
          // it should have attribute value and shouldn't intersect with existing values in connection
          const addProductConnectionAttribute = addProduct.attributes.find((attribute) => {
            return attribute.attributeId.equals(connection.attributeId);
          });
          if (!addProductConnectionAttribute) {
            return {
              success: false,
              message: await getApiMessage('products.connection.noAttributeError'),
            };
          }
          const connectionValues = connection.connectionProducts.reduce(
            (acc: string[], { option }) => {
              return [...acc, option.slug];
            },
            [],
          );
          const includes = connectionValues.includes(
            addProductConnectionAttribute.selectedOptionsSlugs[0],
          );
          if (includes) {
            return {
              success: false,
              message: await getApiMessage('products.connection.intersect'),
            };
          }

          // Find current option
          const option = attribute.options.find(({ slug }) => {
            return slug === addProductConnectionAttribute.selectedOptionsSlugs[0];
          });
          if (!option) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Update connections
          const updatedConnection = {
            ...connection,
            connectionProducts: [
              ...connection.connectionProducts,
              {
                _id: addProductId,
                option,
                productId: addProductId,
              },
            ],
          };
          const updatedConnectionsList = product.connections.reduce(
            (acc: ProductConnectionModel[], productConnection) => {
              if (productConnection._id.equals(connectionId)) {
                return [...acc, updatedConnection];
              }
              return [...acc, productConnection];
            },
            [],
          );

          // Create new slug for added product
          const { updatedSlug: addProductSlug } = createProductSlugWithConnections({
            product: addProduct,
            connections: [...addProduct.connections, updatedConnection],
          });

          // Update product with new slug and connection
          const updatedAddProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: addProductId,
            },
            {
              $push: {
                connections: updatedConnection,
              },
              $set: {
                slug: addProductSlug,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedAddProduct = updatedAddProductResult.value;
          if (!updatedAddProductResult.ok || !updatedAddProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Create new slug for product
          const { updatedSlug: productSlug } = createProductSlugWithConnections({
            product,
            connections: updatedConnectionsList,
          });

          // Update product with new slug
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                slug: productSlug,
                updatedAt: new Date(),
                connections: updatedConnectionsList,
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.connection.addProductSuccess'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete product from connection and delete connection
    // if there is no products left
    t.nonNull.field('deleteProductFromConnection', {
      type: 'ProductPayload',
      description: 'Should create product connection',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductFromConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: deleteProductFromConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, deleteProductId, connectionId } = input;
          const minimumProductsCountForConnectionDelete = 1;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const deleteProduct = await productsCollection.findOne({ _id: deleteProductId });
          const connection = product?.connections.find(({ _id }) => {
            return _id.equals(connectionId);
          });

          if (!product || !deleteProduct || !connection) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Update or delete connection
          const connectionProductIds = connection.connectionProducts.map(
            ({ productId }) => productId,
          );

          const errorMessage = await getApiMessage('products.connection.deleteError');
          const successMessage = await getApiMessage('products.connection.deleteProductSuccess');

          if (connection.connectionProducts.length > minimumProductsCountForConnectionDelete) {
            const updatedProductsResult = await productsCollection.updateMany(
              { _id: { $in: connectionProductIds } },
              {
                $pull: {
                  'connections.$[connection].connectionProducts': {
                    productId: deleteProductId,
                  },
                },
              },
              { arrayFilters: [{ 'connection._id': { $eq: connectionId } }] },
            );

            if (!updatedProductsResult.result.ok) {
              return {
                success: false,
                message: errorMessage,
              };
            }

            const updatedCurrentProduct = await productsCollection.findOne({ _id: productId });
            return {
              success: true,
              message: successMessage,
              payload: updatedCurrentProduct,
            };
          } else {
            const updatedProductResult = await productsCollection.findOneAndUpdate(
              { _id: deleteProductId },
              {
                $pull: {
                  connections: {
                    _id: connectionId,
                  },
                },
              },
              {
                returnOriginal: false,
              },
            );
            const updatedProduct = updatedProductResult.value;
            if (!updatedProductResult.ok || !updatedProduct) {
              return {
                success: false,
                message: errorMessage,
              };
            }

            // Create new slug for product
            const { updatedSlug } = createProductSlugWithConnections({
              product: updatedProduct,
              connections: updatedProduct.connections,
            });
            const updatedProductSlugResult = await productsCollection.findOneAndUpdate(
              { _id: productId },
              {
                $set: {
                  slug: updatedSlug,
                },
              },
              { returnOriginal: false },
            );
            const updatedProductSlug = updatedProductSlugResult.value;
            if (!updatedProductSlugResult.ok || !updatedProductSlug) {
              return {
                success: false,
                message: errorMessage,
              };
            }

            return {
              success: true,
              message: successMessage,
              payload: updatedProductSlug,
            };
          }
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product counter
    t.nonNull.field('updateProductCounter', {
      type: 'Boolean',
      description: 'Should update product counter',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductCounterInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<boolean> => {
        try {
          const db = await getDatabase();
          const sessionRole = await getSessionRole(context);
          const { city } = await getRequestParams(context);
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          if (!sessionRole.isStuff) {
            // Args
            const { input } = args;
            await productsCollection.findOneAndUpdate(
              { slug: input.productSlug },
              {
                $inc: {
                  [`views.${city}`]: VIEWS_COUNTER_STEP,
                },
              },
            );
          }
          return true;
        } catch (e) {
          return false;
        }
      },
    });
  },
});
