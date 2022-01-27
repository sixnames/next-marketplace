import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { deleteProductFromConnectionSchema } from '../../../validation/productSchema';
import { COL_PRODUCT_SUMMARIES } from '../../collectionNames';
import {
  ObjectIdModel,
  ProductPayloadModel,
  ProductSummaryModel,
  ProductVariantItemModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface DeleteProductFromVariantInputInterface {
  productId: string;
  deleteProductId: string;
  variantId: string;
}

export async function deleteProductFromVariant({
  context,
  input,
}: DaoPropsInterface<DeleteProductFromVariantInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage('products.connection.deleteError'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
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

      // check input
      if (!input) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: deleteProductFromConnectionSchema,
      });
      await validationSchema.validate(input);

      const minimumProductsCountForConnectionDelete = 2;

      // check all entities availability
      const productId = new ObjectId(input.productId);
      const deleteProductId = new ObjectId(input.deleteProductId);
      const variantId = new ObjectId(input.variantId);
      const summary = await productSummariesCollection.findOne({ _id: productId });
      const deleteSummary = await productSummariesCollection.findOne({
        _id: deleteProductId,
      });
      const variant = summary?.variants.find((variant) => {
        return variant._id.equals(variantId);
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
    console.log('deleteProductFromVariant', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
