import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import {
  ObjectIdModel,
  ProductPayloadModel,
  ProductVariantItemModel,
  SummaryDiffModel,
} from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  getProductFullSummary,
  getProductFullSummaryWithDraft,
} from 'db/ssr/products/getProductFullSummary';
import { DaoPropsInterface, ProductVariantInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { deleteProductFromConnectionSchema } from 'validation/productSchema';

export interface DeleteProductFromVariantInputInterface {
  taskId?: string | null;
  productId: string;
  deleteProductId: string;
  variantId: string;
}

export async function deleteProductFromVariant({
  context,
  input,
}: DaoPropsInterface<DeleteProductFromVariantInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();

  const session = collections.client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage('products.variant.deleteError'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message, user, role } = await getOperationPermission({
        context,
        slug: 'updateProductVariants',
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
      const variantId = new ObjectId(input.variantId);
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductVariants');
      const summaryPayload = await getProductFullSummaryWithDraft({
        locale,
        taskId: input.taskId,
        productId: input.productId,
        companySlug: DEFAULT_COMPANY_SLUG,
        isContentManager: role.isContentManager,
      });
      if (!summaryPayload) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }
      const { summary } = summaryPayload;
      const updatedSummary = { ...summary };
      const diff: SummaryDiffModel = {};

      const deleteSummaryPayload = await getProductFullSummary({
        locale,
        productId: input.deleteProductId,
        companySlug: DEFAULT_COMPANY_SLUG,
      });
      if (!deleteSummaryPayload) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }
      const deleteSummary = deleteSummaryPayload.summary;

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

      const errorMessage = await getApiMessage('products.variant.deleteError');
      const successMessage = await getApiMessage('products.variant.deleteProductSuccess');

      const updateProductIds: ObjectIdModel[] = [];
      const allVariantProductIds: ObjectIdModel[] = [];
      const updatedVariantProducts = variant.products.reduce(
        (acc: ProductVariantItemModel[], variantProduct) => {
          allVariantProductIds.push(variantProduct.productId);
          if (variantProduct.productId.equals(deleteSummary._id)) {
            return acc;
          }

          updateProductIds.push(variantProduct.productId);
          return [...acc, variantProduct];
        },
        [],
      );

      // delete variant if it has one item or equals current summary
      const isSameProduct = deleteSummary._id.equals(summary._id);
      if (variant.products.length < minimumProductsCountForConnectionDelete || isSameProduct) {
        updatedSummary.variants = updatedSummary.variants.filter(({ _id }) => {
          return !_id.equals(variant._id);
        });
      } else {
        // update variant
        updatedSummary.variants = updatedSummary.variants.reduce(
          (acc: ProductVariantInterface[], prevVariant) => {
            if (prevVariant._id.equals(variant._id)) {
              const products = prevVariant.products.filter(({ productId }) => {
                return !productId.equals(deleteSummary._id);
              });

              return [
                ...acc,
                {
                  ...prevVariant,
                  products,
                },
              ];
            }
            return [...acc, prevVariant];
          },
          [],
        );
      }
      diff.deleted = {
        variantProducts: {
          productId: deleteSummary._id,
          variantId: variant._id,
        },
      };

      // create task log for content manager
      if (role.isContentManager && user) {
        const task = await findOrCreateUserTask({
          productId: summary._id,
          variantSlug: taskVariantSlug,
          executorId: user._id,
          taskId: input.taskId,
        });

        if (!task) {
          mutationPayload = {
            success: false,
            message: await getApiMessage('tasks.create.error'),
          };
          await session.abortTransaction();
          return;
        }

        const newTaskLogResult = await addTaskLogItem({
          taskId: task._id,
          diff,
          prevStateEnum: task.stateEnum,
          nextStateEnum: TASK_STATE_IN_PROGRESS,
          draft: updatedSummary,
          createdById: user._id,
        });
        if (!newTaskLogResult) {
          mutationPayload = {
            success: false,
            message: await getApiMessage('products.update.error'),
          };
          await session.abortTransaction();
          return;
        }

        mutationPayload = {
          success: true,
          message: await getApiMessage('products.update.success'),
        };
        await session.abortTransaction();
        return;
      }

      // update documents
      if (variant.products.length < minimumProductsCountForConnectionDelete) {
        // delete variant if it has one item
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
        // update variant
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
            _id: deleteSummary._id,
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
