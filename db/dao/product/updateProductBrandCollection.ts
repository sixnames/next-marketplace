import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'config/common';
import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { COL_PRODUCT_FACETS, COL_PRODUCT_SUMMARIES, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import {
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  ShopProductModel,
  SummaryDiffModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';

export interface UpdateProductBrandCollectionInputInterface {
  productId: string;
  brandCollectionSlug?: string | null;
}

export async function updateProductBrandCollection({
  context,
  input,
}: DaoPropsInterface<UpdateProductBrandCollectionInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

  const session = client.startSession();

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

      const { brandCollectionSlug } = input;

      // get summary or summary draft
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductBrand');
      const summaryPayload = await getFullProductSummaryWithDraft({
        locale,
        productId: input.productId,
        companySlug: DEFAULT_COMPANY_SLUG,
        taskVariantSlug,
        userId: user?._id,
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

      if (!brandCollectionSlug) {
        updatedSummary.brandCollectionSlug = undefined;
        diff.deleted = {
          brandCollection: updatedSummary.brandCollectionSlug,
        };
      } else {
        updatedSummary.brandCollectionSlug = brandCollectionSlug;
        diff.updated = {
          brandCollection: brandCollectionSlug,
        };
      }

      // create task log for content manager
      if (role.isContentManager && user) {
        const task = await findOrCreateUserTask({
          productId: summary._id,
          variantSlug: taskVariantSlug,
          executorId: user._id,
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
      const updatedSummaryResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            brandCollectionSlug,
            updatedAt: new Date(),
          },
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
            brandCollectionSlug,
          },
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
            brandCollectionSlug,
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
    console.log('updateProductBrandCollection', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
