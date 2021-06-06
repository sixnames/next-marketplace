import { ATTRIBUTE_VARIANT_SELECT } from 'config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  OptionModel,
  ProductAttributeModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  ProductPayloadModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
} from 'db/collectionNames';
import {
  addProductToConnectionSchema,
  createProductConnectionSchema,
  deleteProductFromConnectionSchema,
} from 'validation/productSchema';

export const ProductConnectionItem = objectType({
  name: 'ProductConnectionItem',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductModel> => {
        const { db } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const product = await productsCollection.findOne({ _id: source.productId });
        if (!product) {
          throw Error('Product not found in ProductConnectionItem');
        }
        return product;
      },
    });
  },
});

export const ProductConnection = objectType({
  name: 'ProductConnection',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.json('attributeNameI18n');
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

export const ProductConnectionMutations = extendType({
  type: 'Mutation',
  definition(t) {
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const productsAttributesCollection = db.collection<ProductAttributeModel>(
          COL_PRODUCT_ATTRIBUTES,
        );
        const productConnectionsCollection = db.collection<ProductConnectionModel>(
          COL_PRODUCT_CONNECTIONS,
        );
        const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
          COL_PRODUCT_CONNECTION_ITEMS,
        );
        const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

        const session = client.startSession();
        let mutationPayload: ProductPayloadModel = {
          success: false,
          message: await getApiMessage(`products.connection.createError`),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: createProductConnectionSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { productId, attributeId } = input;

            // Check all entities availability
            const product = await productsCollection.findOne({ _id: productId });
            const productConnections = await productConnectionsCollection
              .aggregate([
                {
                  $match: { productIds: productId },
                },
              ])
              .toArray();
            const productAttribute = await productsAttributesCollection.findOne({
              productId,
              attributeId,
            });

            // Find current attribute in product
            if (!product || !productAttribute) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Check attribute variant. Must be as Select
            if (productAttribute.variant !== ATTRIBUTE_VARIANT_SELECT) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.attributeVariantError`),
              };
              await session.abortTransaction();
              return;
            }

            // Check if connection already exist
            const exist = productConnections.some((connection) => {
              return connection.attributeId.equals(attributeId);
            });
            if (exist) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.exist`),
              };
              await session.abortTransaction();
              return;
            }

            // Find current option
            const optionId = productAttribute.selectedOptionsIds[0];
            if (!optionId) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.createError`),
              };
              await session.abortTransaction();
              return;
            }
            const option = await optionsCollection.findOne({ _id: optionId });
            if (!option) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.createError`),
              };
              await session.abortTransaction();
              return;
            }

            // Create connection
            const createdConnectionResult = await productConnectionsCollection.insertOne({
              attributeId: productAttribute.attributeId,
              attributeSlug: productAttribute.slug,
              productsIds: [productId],
            });
            const createdConnection = createdConnectionResult.ops[0];
            if (!createdConnectionResult.result.ok || !createdConnection) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.createError`),
              };
              await session.abortTransaction();
              return;
            }

            // Create connection item
            const createdConnectionItemResult = await productConnectionItemsCollection.insertOne({
              optionId,
              productId,
              productSlug: product.slug,
              connectionId: createdConnection._id,
            });
            const createdConnectionItem = createdConnectionItemResult.ops[0];
            if (!createdConnectionItemResult.result.ok || !createdConnectionItem) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.createError`),
              };
              await session.abortTransaction();
              return;
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
              },
              {
                returnOriginal: false,
              },
            );
            const updatedProduct = updatedProductResult.value;
            if (!updatedProductResult.ok || !updatedProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.error`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.connection.createSuccess'),
              payload: updatedProduct,
            };
          });

          return mutationPayload;
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
        const productsAttributesCollection = db.collection<ProductAttributeModel>(
          COL_PRODUCT_ATTRIBUTES,
        );
        const productConnectionsCollection = db.collection<ProductConnectionModel>(
          COL_PRODUCT_CONNECTIONS,
        );
        const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
          COL_PRODUCT_CONNECTION_ITEMS,
        );
        const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

        const session = client.startSession();

        let mutationPayload: ProductPayloadModel = {
          success: false,
          message: await getApiMessage(`products.connection.updateError`),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            // Validate
            const validationSchema = await getResolverValidationSchema({
              context,
              schema: addProductToConnectionSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { productId, addProductId, connectionId } = input;

            // Check all entities availability
            const product = await productsCollection.findOne({ _id: productId });
            const addProduct = await productsCollection.findOne({ _id: addProductId });
            const connection = await productConnectionsCollection.findOne({ _id: connectionId });
            if (!product || !addProduct || !connection) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Get all connection items
            const connectionItems = await productConnectionItemsCollection
              .find({ connectionId: connection._id })
              .toArray();

            // Check attribute existence in added product
            const addProductAttribute = await productsAttributesCollection.findOne({
              productId: addProductId,
              attributeId: connection.attributeId,
            });
            const addProductOptionId = addProductAttribute?.selectedOptionsIds[0];
            if (!addProductAttribute || !addProductOptionId) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.connection.noAttributeError'),
              };
              await session.abortTransaction();
              return;
            }

            // Check attribute value in added product
            // it should have attribute value and shouldn't intersect with existing values in connection
            const connectionOptionIds = connectionItems.reduce((acc: ObjectId[], { optionId }) => {
              return [...acc, optionId];
            }, []);
            const includes = connectionOptionIds.some((_id) => {
              return _id.equals(addProductOptionId);
            });
            if (includes) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.connection.intersect'),
              };
              await session.abortTransaction();
              return;
            }

            // Find current option
            const option = await optionsCollection.findOne({
              _id: addProductOptionId,
            });
            if (!option) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.updateError`),
              };
              await session.abortTransaction();
              return;
            }
            if (!option) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.updateError`),
              };
              await session.abortTransaction();
              return;
            }

            // Create connection item
            const createdConnectionItemResult = await productConnectionItemsCollection.insertOne({
              optionId: option._id,
              productId: addProductId,
              productSlug: addProduct.slug,
              connectionId,
            });

            const createdConnectionItem = createdConnectionItemResult.ops[0];
            if (!createdConnectionItemResult.result.ok || !createdConnectionItem) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.updateError`),
              };
              await session.abortTransaction();
              return;
            }

            // Update connection
            const updatedConnectionResult = await productConnectionsCollection.findOneAndUpdate(
              {
                _id: connectionId,
              },
              {
                $push: {
                  productsIds: addProductId,
                },
              },
            );
            const updatedConnection = updatedConnectionResult.value;
            if (!updatedConnectionResult.ok || !updatedConnection) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.connection.updateError`),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.connection.addProductSuccess'),
              payload: product,
            };
          });

          return mutationPayload;
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });

    // Should delete product from connection and delete connection
    // if there is no products left
    t.nonNull.field('deleteProductFromConnection', {
      type: 'ProductPayload',
      description:
        'Should delete product from connection and delete connection if there is no products left',
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
          const { db } = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const productConnectionsCollection = db.collection<ProductConnectionModel>(
            COL_PRODUCT_CONNECTIONS,
          );
          const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
            COL_PRODUCT_CONNECTION_ITEMS,
          );
          const { input } = args;
          const { productId, deleteProductId, connectionId } = input;
          const minimumProductsCountForConnectionDelete = 2;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const deleteProduct = await productsCollection.findOne({ _id: deleteProductId });
          const connection = await productConnectionsCollection.findOne({ _id: connectionId });
          if (!product || !deleteProduct || !connection) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Get connection items
          const connectionItems = await productConnectionItemsCollection
            .find({ connectionId })
            .toArray();

          const errorMessage = await getApiMessage('products.connection.deleteError');
          const successMessage = await getApiMessage('products.connection.deleteProductSuccess');

          // Delete connection if it has one item
          if (connectionItems.length < minimumProductsCountForConnectionDelete) {
            const removedConnectionResult = await productConnectionsCollection.findOneAndDelete({
              _id: connectionId,
            });
            if (!removedConnectionResult.ok) {
              return {
                success: false,
                message: errorMessage,
              };
            }
          } else {
            // Update connection
            const updatedConnectionResult = await productConnectionsCollection.findOneAndUpdate(
              {
                _id: connectionId,
              },
              {
                $pull: {
                  productsIds: deleteProductId,
                },
              },
            );
            const updatedConnection = updatedConnectionResult.value;
            if (!updatedConnectionResult.ok || !updatedConnection) {
              return {
                success: false,
                message: errorMessage,
              };
            }
          }

          // Remove connection item
          const removedConnectionItemResult = await productConnectionItemsCollection.findOneAndDelete(
            {
              productId: deleteProductId,
            },
          );
          if (!removedConnectionItemResult.ok) {
            return {
              success: false,
              message: errorMessage,
            };
          }
          const removedConnectionItem = removedConnectionItemResult.value;
          if (!removedConnectionItemResult.ok || !removedConnectionItem) {
            return {
              success: false,
              message: errorMessage,
            };
          }

          return {
            success: true,
            message: successMessage,
            payload: product,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
