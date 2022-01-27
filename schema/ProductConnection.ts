import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { COL_PRODUCT_SUMMARIES } from '../db/collectionNames';
import {
  ProductVariantItemModel,
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
import { deleteProductFromConnectionSchema } from '../validation/productSchema';

export const ProductConnection = objectType({
  name: 'ProductConnection',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.json('attributeNameI18n');
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
