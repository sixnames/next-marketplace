import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { ProductPayloadModel, SummaryDiffModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getProductFullSummaryWithDraft } from 'db/ssr/products/getProductFullSummary';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';

export interface UpdateProductBrandInputInterface {
  taskId?: string | null;
  productId: string;
  brandSlug?: string | null;
}

export async function updateProductBrand({
  context,
  input,
}: DaoPropsInterface<UpdateProductBrandInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();
  const productFacetsCollection = collections.productFacetsCollection();
  const shopProductsCollection = collections.shopProductsCollection();

  const session = collections.client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage('products.update.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message, user, role } = await getOperationPermission({
        context,
        slug: 'updateProductBrand',
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
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const { brandSlug, taskId } = input;

      // get summary or summary draft
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductBrand');
      const summaryPayload = await getProductFullSummaryWithDraft({
        locale,
        taskId,
        productId: input.productId,
        companySlug: DEFAULT_COMPANY_SLUG,
        isContentManager: role.isContentManager,
      });
      if (!summaryPayload) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.notFound'),
        };
        await session.abortTransaction();
        return;
      }
      const { summary } = summaryPayload;
      const updatedSummary = { ...summary };
      const diff: SummaryDiffModel = {};

      if (!brandSlug) {
        updatedSummary.brandSlug = undefined;
        updatedSummary.brandCollectionSlug = undefined;
        diff.deleted = {
          brand: updatedSummary.brandSlug,
        };
      } else {
        updatedSummary.brandSlug = brandSlug;
        diff.updated = {
          brand: brandSlug,
        };
      }

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
      const updater = {
        brandSlug,
        brandCollectionSlug: brandSlug ? summary.brandCollectionSlug : null,
      };

      const updatedSummaryResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            ...updater,
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
        },
      );
      if (!updatedSummaryResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const updatedFacetResult = await productFacetsCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            ...updater,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      if (!updatedFacetResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const updatedShopProduct = await shopProductsCollection.updateMany(
        {
          productId: summary._id,
        },
        {
          $set: {
            ...updater,
            updatedAt: new Date(),
          },
        },
      );
      if (!updatedShopProduct.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // update algolia object
      execUpdateProductTitles(`productId=${summary._id.toHexString()}`);

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateProductBrand', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
