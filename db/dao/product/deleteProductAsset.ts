import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'config/common';
import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { deleteUpload, getMainImage } from 'lib/assetUtils/assetUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { COL_PRODUCT_SUMMARIES, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import {
  ProductPayloadModel,
  ProductSummaryModel,
  ShopProductModel,
  SummaryDiffModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';

export interface DeleteProductAssetInputInterface {
  productId: string;
  assetIndex: number;
  taskId?: string | null;
}

export async function deleteProductAsset({
  input,
  context,
}: DaoPropsInterface<DeleteProductAssetInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

  const session = client.startSession();

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

      const { assetIndex, taskId } = input;

      // get summary or summary draft
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductAssets');
      const summaryPayload = await getFullProductSummaryWithDraft({
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

      // update assets
      let assetUrl: string = '';
      const updatedAssets = updatedSummary.assets.reduce((acc: string[], asset, index) => {
        if (index === assetIndex) {
          assetUrl = asset;
          return acc;
        }
        return [...acc, asset];
      }, []);
      updatedSummary.assets = updatedAssets;
      updatedSummary.mainImage = getMainImage(updatedAssets);
      const diff: SummaryDiffModel = {
        deleted: {
          assets: updatedAssets,
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

      // delete local file
      if (assetUrl) {
        const removedAsset = await deleteUpload(assetUrl);
        if (!removedAsset) {
          mutationPayload = {
            success: false,
            message: await getApiMessage(`products.update.error`),
          };
          await session.abortTransaction();
          return;
        }
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
    console.log('deleteProductAsset error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
