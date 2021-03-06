import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { ProductPayloadModel, SummaryDiffModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getProductFullSummaryWithDraft } from 'db/ssr/products/getProductFullSummary';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { checkBarcodeIntersects } from 'lib/barcode';
import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { trimProductName } from 'lib/i18n';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { updateProductSchema } from 'validation/productSchema';
import { CreateProductInputInterface } from './createProduct';

export interface UpdateProductInputInterface extends Omit<CreateProductInputInterface, 'rubricId'> {
  taskId?: string | null;
  productId: string;
}

export async function updateProduct({
  context,
  input,
}: DaoPropsInterface<UpdateProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();

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

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: updateProductSchema,
      });
      await validationSchema.validate(input);

      const { productId, taskId, ...values } = input;

      // get summary or summary draft
      const taskVariantSlug = getTaskVariantSlugByRule('updateProduct');
      const summaryPayload = await getProductFullSummaryWithDraft({
        taskId,
        locale,
        productId,
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
      const { originalName, nameI18n } = trimProductName({
        nameI18n: values.nameI18n,
        originalName: values.originalName,
      });
      const updatedSummary = {
        ...summary,
        ...values,
        videos: (values.videos || []).filter((url) => url),
        nameI18n,
        originalName,
      };
      const diff: SummaryDiffModel = {
        updated: {
          details: values,
        },
      };

      // check barcode intersects
      const barcodeDoubles = await checkBarcodeIntersects({
        locale,
        barcode: values.barcode,
        productId: summary._id,
      });
      if (barcodeDoubles.length > 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
          barcodeDoubles,
        };
        await session.abortTransaction();
        return;
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
      const updatedProductResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            ...values,
            videos: (values.videos || []).filter((url) => url),
            nameI18n,
            originalName,
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

      // update product title
      execUpdateProductTitles(`productId=${updatedProduct._id.toHexString()}`);

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
        payload: updatedProduct,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateProduct error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
