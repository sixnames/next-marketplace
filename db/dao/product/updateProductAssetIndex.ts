import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { ProductPayloadModel, SummaryDiffModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getProductFullSummaryWithDraft } from 'db/ssr/products/getProductFullSummary';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { getMainImage, reorderAssets } from 'lib/assetUtils/assetUtils';
import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';

export interface UpdateProductAssetIndexInputInterface {
  taskId?: string | null;
  productId: string;
  assetUrl: string;
  assetNewIndex: number;
}

export async function updateProductAssetIndex({
  context,
  input,
}: DaoPropsInterface<UpdateProductAssetIndexInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();
  const shopProductsCollection = collections.shopProductsCollection();

  const session = collections.client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.update.error`),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // permission
      const { allow, message, user, role } = await getOperationPermission({
        context,
        slug: 'updateProductAssets',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }
      const { assetNewIndex, assetUrl, taskId } = input;

      // get summary or summary draft
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductAssets');
      const summaryPayload = await getProductFullSummaryWithDraft({
        taskId,
        locale,
        productId: input.productId,
        companySlug: DEFAULT_COMPANY_SLUG,
        isContentManager: role.isContentManager,
      });
      if (!summaryPayload) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }
      const { summary } = summaryPayload;
      const updatedSummary = { ...summary };

      // reorder assets
      const initialAssets = updatedSummary.assets;
      const reorderedAssets = reorderAssets({
        assetUrl,
        assetNewIndex,
        initialAssets,
      });
      if (!reorderedAssets) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }
      updatedSummary.assets = reorderedAssets;
      updatedSummary.mainImage = getMainImage(reorderedAssets);
      const diff: SummaryDiffModel = {
        updated: {
          assets: reorderedAssets,
        },
      };

      // create task log for content manager
      if (role.isContentManager && user) {
        const task = await findOrCreateUserTask({
          productId: summary._id,
          variantSlug: taskVariantSlug,
          executorId: user._id,
          taskId,
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
      const updatedProductAssetsResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            assets: updatedSummary.assets,
            mainImage: updatedSummary.mainImage,
          },
        },
      );
      if (!updatedProductAssetsResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }
      await shopProductsCollection.updateMany(
        {
          productId: summary._id,
        },
        {
          $set: {
            mainImage: updatedSummary.mainImage,
          },
        },
      );

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateProductAssetIndex error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
