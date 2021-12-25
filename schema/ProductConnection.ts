import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { ATTRIBUTE_VARIANT_SELECT } from '../config/common';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_VARIANT_ITEMS,
  COL_PRODUCT_VARIANTS,
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
} from '../db/collectionNames';
import {
  AttributeModel,
  OptionModel,
  ProductVariantItemModel,
  ProductVariantModel,
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  ObjectIdModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../lib/sessionHelpers';
import {
  addProductToConnectionSchema,
  createProductConnectionSchema,
  deleteProductFromConnectionSchema,
} from '../validation/productSchema';

export const ProductConnectionItem = objectType({
  name: 'ProductConnectionItem',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.field('product', {
      type: 'Product',
      resolve: async (source): Promise<ProductFacetModel> => {
        const { db } = await getDatabase();
        const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
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
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const productSummariesCollection =
          db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
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
            const summary = await productSummariesCollection.findOne({ _id: productId });
            const productAttribute = summary?.attributes.find((productAttribute) => {
              return productAttribute.attributeId.equals(attributeId);
            });
            const attribute = await attributesCollection.findOne({
              _id: attributeId,
            });

            // Find current attribute in product
            if (!summary || !productAttribute || !attribute) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Check attribute variant. Must be as Select
            if (attribute.variant !== ATTRIBUTE_VARIANT_SELECT) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.attributeVariantError`),
              };
              await session.abortTransaction();
              return;
            }

            // Check if connection already exist
            const exist = summary.variants.some((connection) => {
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
            const optionId = productAttribute.optionIds[0];
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

            // Update product
            const updatedProductResult = await productSummariesCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $push: {
                  variants: {
                    _id: new ObjectId(),
                    attributeId: attribute._id,
                    attributeSlug: attribute.slug,
                    products: [
                      {
                        _id: new ObjectId(),
                        productId,
                        optionId,
                        productSlug: summary.slug,
                      },
                    ],
                  },
                },
                $set: {
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
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
        const productSummariesCollection =
          db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
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
            const summary = await productSummariesCollection.findOne({ _id: productId });
            const addSummary = await productSummariesCollection.findOne({ _id: addProductId });
            const variant = summary?.variants.find((variant) => {
              return variant._id.equals(connectionId);
            });
            if (!summary || !addSummary || !variant) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            // Check attribute existence in added product
            const addProductAttribute = addSummary.attributes.find(({ attributeId }) => {
              return variant.attributeId.equals(attributeId);
            });
            const addProductOptionId = addProductAttribute?.optionIds[0];
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
            const connectionOptionIds = variant.products.reduce((acc: ObjectId[], { optionId }) => {
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

            // Create connection item
            const updateProductIds: ObjectIdModel[] = [];
            const updatedVariants = summary.variants.reduce(
              (acc: ProductVariantModel[], summaryVariant) => {
                if (!summaryVariant._id.equals(variant._id)) {
                  return [...acc, summaryVariant];
                }

                const products = [
                  ...summaryVariant.products,
                  {
                    _id: new ObjectId(),
                    optionId: option._id,
                    productId: addProductId,
                    productSlug: addSummary.slug,
                  },
                ];

                products.forEach(({ productId }) => {
                  updateProductIds.push(productId);
                });

                return [
                  ...acc,
                  {
                    ...summaryVariant,
                    products,
                  },
                ];
              },
              [],
            );

            // Update connection
            const updatedSummaryResult = await productSummariesCollection.updateMany(
              {
                _id: {
                  $in: updateProductIds,
                },
              },
              {
                $set: {
                  variants: updatedVariants,
                },
              },
            );
            if (!updatedSummaryResult.acknowledged) {
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
              payload: summary,
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
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
        const productConnectionsCollection =
          db.collection<ProductVariantModel>(COL_PRODUCT_VARIANTS);
        const productConnectionItemsCollection =
          db.collection<ProductVariantItemModel>(COL_PRODUCT_VARIANT_ITEMS);

        const session = client.startSession();

        let mutationPayload: ProductPayloadModel = {
          success: false,
          message: await getApiMessage('products.connection.deleteError'),
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
              schema: deleteProductFromConnectionSchema,
            });
            await validationSchema.validate(args.input);

            const { input } = args;
            const { productId, deleteProductId, connectionId } = input;
            const minimumProductsCountForConnectionDelete = 2;

            // Check all entities availability
            const product = await productsCollection.findOne({ _id: productId });
            const deleteProduct = await productsCollection.findOne({ _id: deleteProductId });
            const connection = await productConnectionsCollection.findOne({ _id: connectionId });
            if (!product || !deleteProduct || !connection) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
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
                mutationPayload = {
                  success: false,
                  message: errorMessage,
                };
                await session.abortTransaction();
                return;
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
                mutationPayload = {
                  success: false,
                  message: errorMessage,
                };
                await session.abortTransaction();
                return;
              }
            }

            // Remove connection item
            const removedConnectionItemResult =
              await productConnectionItemsCollection.findOneAndDelete({
                productId: deleteProductId,
              });
            if (!removedConnectionItemResult.ok) {
              mutationPayload = {
                success: false,
                message: errorMessage,
              };
              await session.abortTransaction();
              return;
            }
            const removedConnectionItem = removedConnectionItemResult.value;
            if (!removedConnectionItemResult.ok || !removedConnectionItem) {
              mutationPayload = {
                success: false,
                message: errorMessage,
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: successMessage,
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
  },
});
