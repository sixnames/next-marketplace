import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { ProductPayloadModel, SummaryDiffModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { NextContextInterface } from 'db/uiInterfaces';
import { getMainImage, storeUploads } from 'lib/assetUtils/assetUtils';
import {
  ASSETS_DIST_PRODUCTS,
  ASSETS_PRODUCT_IMAGE_WIDTH,
  DEFAULT_COMPANY_SLUG,
  TASK_STATE_IN_PROGRESS,
} from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { parseApiFormData } from 'lib/restApi';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';

export interface AddProductAssetInterface {
  productId: string;
  taskId?: string | null;
}

export async function addProductAsset(context: NextContextInterface): Promise<ProductPayloadModel> {
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();
  const shopProductsCollection = collections.shopProductsCollection();
  const { getApiMessage, locale } = await getRequestParams(context);

  const session = collections.client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage('products.update.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message, role, user } = await getOperationPermission({
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

      // check input
      const formData = await parseApiFormData<AddProductAssetInterface>(context.req);
      if (!formData || !formData.files || !formData.fields) {
        await session.abortTransaction();
        return;
      }

      // get summary or summary draft
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductAssets');
      const summaryPayload = await getFullProductSummaryWithDraft({
        locale,
        taskId: formData.fields.taskId,
        productId: formData.fields.productId,
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

      // upload assets
      const initialAssets = updatedSummary.assets;
      const assets = await storeUploads({
        files: formData.files,
        dist: ASSETS_DIST_PRODUCTS,
        dirName: summary.itemId,
        width: ASSETS_PRODUCT_IMAGE_WIDTH,
      });
      if (!assets) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }
      const finalAssets = [...initialAssets, ...assets];
      updatedSummary.assets = finalAssets;
      updatedSummary.mainImage = getMainImage(finalAssets);
      const diff: SummaryDiffModel = {
        added: {
          assets,
        },
      };

      // create task log for content manager
      if (role.isContentManager && user) {
        const task = await findOrCreateUserTask({
          productId: summary._id,
          variantSlug: taskVariantSlug,
          executorId: user._id,
          taskId: formData.fields.taskId,
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
      return;
    });

    return mutationPayload;
  } catch (e) {
    console.log('addProductAsset error', e);
    return mutationPayload;
  } finally {
    await session.endSession();
  }
}
