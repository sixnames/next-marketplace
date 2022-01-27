import { ObjectId } from 'mongodb';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { COL_OPTIONS, COL_PRODUCT_SUMMARIES } from '../db/collectionNames';
import {
  OptionModel,
  ProductVariantItemModel,
  ProductVariantModel,
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
  deleteProductFromConnectionSchema,
} from '../validation/productSchema';

export const ProductConnection = objectType({
  name: 'ProductConnection',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.json('attributeNameI18n');
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
            const updatedVariantProducts: ProductVariantItemModel[] = [
              ...variant.products,
              {
                _id: new ObjectId(),
                optionId: option._id,
                productId: addProductId,
                productSlug: addSummary.slug,
              },
            ];
            const updateProductIds = variant.products.map(({ productId }) => {
              return productId;
            });
            const updatedVariant: ProductVariantModel = {
              ...variant,
              products: updatedVariantProducts,
            };

            // Update connection
            const updatedSummaryResult = await productSummariesCollection.updateMany(
              {
                _id: {
                  $in: updateProductIds,
                },
              },
              {
                $set: {
                  'variants.$[oldVariant]': updatedVariant,
                },
              },
              {
                arrayFilters: [
                  {
                    'oldVariant._id': { $eq: variant._id },
                  },
                ],
              },
            );
            const updatedAddSummaryResult = await productSummariesCollection.findOneAndUpdate(
              {
                _id: addProductId,
              },
              {
                $push: {
                  variants: updatedVariant,
                },
              },
            );
            if (!updatedSummaryResult.acknowledged || !updatedAddSummaryResult.ok) {
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
        const productSummariesCollection =
          db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);

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
            const summary = await productSummariesCollection.findOne({ _id: productId });
            const deleteSummary = await productSummariesCollection.findOne({
              _id: deleteProductId,
            });
            const variant = summary?.variants.find((variant) => {
              return variant._id.equals(connectionId);
            });
            if (!summary || !deleteSummary || !variant) {
              mutationPayload = {
                success: false,
                message: await getApiMessage(`products.update.notFound`),
              };
              await session.abortTransaction();
              return;
            }

            const errorMessage = await getApiMessage('products.connection.deleteError');
            const successMessage = await getApiMessage('products.connection.deleteProductSuccess');

            const updateProductIds: ObjectIdModel[] = [];
            const allVariantProductIds: ObjectIdModel[] = [];
            const updatedVariantProducts = variant.products.reduce(
              (acc: ProductVariantItemModel[], variantProduct) => {
                allVariantProductIds.push(variantProduct.productId);
                if (variantProduct.productId.equals(deleteProductId)) {
                  return acc;
                }

                updateProductIds.push(variantProduct.productId);
                return [...acc, variantProduct];
              },
              [],
            );

            // Delete connection if it has one item
            if (variant.products.length < minimumProductsCountForConnectionDelete) {
              const removedConnectionResult = await productSummariesCollection.updateMany(
                {
                  _id: {
                    $in: allVariantProductIds,
                  },
                },
                {
                  $pull: {
                    variants: {
                      _id: variant._id,
                    },
                  },
                },
              );
              if (!removedConnectionResult.acknowledged) {
                mutationPayload = {
                  success: false,
                  message: errorMessage,
                };
                await session.abortTransaction();
                return;
              }
            } else {
              // Update connection
              const updatedVariantSummariesResult = await productSummariesCollection.updateMany(
                {
                  _id: {
                    $in: updateProductIds,
                  },
                },
                {
                  $set: {
                    'variants.$[oldVariant].products': updatedVariantProducts,
                  },
                },
                {
                  arrayFilters: [
                    {
                      'oldVariant._id': variant._id,
                    },
                  ],
                },
              );
              const updatedOldSummaryResult = await productSummariesCollection.findOneAndUpdate(
                {
                  _id: deleteProductId,
                },
                {
                  $pull: {
                    variants: {
                      _id: variant._id,
                    },
                  },
                },
              );
              if (!updatedVariantSummariesResult.acknowledged || !updatedOldSummaryResult.ok) {
                mutationPayload = {
                  success: false,
                  message: errorMessage,
                };
                await session.abortTransaction();
                return;
              }
            }

            mutationPayload = {
              success: true,
              message: successMessage,
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
  },
});
