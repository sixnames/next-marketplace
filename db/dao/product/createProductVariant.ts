import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import {
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COMPANY_SLUG,
  TASK_STATE_IN_PROGRESS,
} from 'config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { createProductConnectionSchema } from 'validation/productSchema';
import { COL_ATTRIBUTES, COL_OPTIONS, COL_PRODUCT_SUMMARIES } from 'db/collectionNames';
import {
  AttributeModel,
  OptionModel,
  ProductPayloadModel,
  ProductSummaryModel,
  SummaryDiffModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, ProductVariantInterface } from 'db/uiInterfaces';

export interface CreateProductVariantInputInterface {
  productId: string;
  attributeId: string;
  taskId?: string | null;
}

export async function createProductVariant({
  input,
  context,
}: DaoPropsInterface<CreateProductVariantInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

  const session = client.startSession();
  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.variant.createError`),
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
        schema: createProductConnectionSchema,
      });
      await validationSchema.validate(input);

      // get summary or summary draft
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductVariants');
      const attributeId = new ObjectId(input.attributeId);
      const summaryPayload = await getFullProductSummaryWithDraft({
        locale,
        productId: input.productId,
        companySlug: DEFAULT_COMPANY_SLUG,
        isContentManager: role.isContentManager,
        taskId: input.taskId,
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
      const productAttribute = updatedSummary?.attributes.find((productAttribute) => {
        return productAttribute.attributeId.equals(attributeId);
      });
      const attribute = await attributesCollection.findOne({
        _id: attributeId,
      });

      // find current attribute in product
      if (!productAttribute || !attribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // check attribute variant. Must be as select
      if (attribute.variant !== ATTRIBUTE_VARIANT_SELECT) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.attributeVariantError`),
        };
        await session.abortTransaction();
        return;
      }

      // check if variant already exist
      const exist = summary.variants.some((variant) => {
        return variant.attributeId.equals(attributeId);
      });
      if (exist) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.variant.exist`),
        };
        await session.abortTransaction();
        return;
      }

      // find current option
      const optionId = productAttribute.optionIds[0];
      if (!optionId) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.variant.createError`),
        };
        await session.abortTransaction();
        return;
      }
      const option = await optionsCollection.findOne({ _id: optionId });
      if (!option) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.variant.createError`),
        };
        await session.abortTransaction();
        return;
      }

      // create new variant
      const newVariant: ProductVariantInterface = {
        _id: new ObjectId(),
        attributeSlug: attribute.slug,
        attributeId: attribute._id,
        attribute: {
          ...attribute,
          name: getFieldStringLocale(attribute.nameI18n, locale),
        },
        products: [
          {
            _id: new ObjectId(),
            productSlug: updatedSummary.slug,
            productId: updatedSummary._id,
            optionId: option._id,
            isCurrent: true,
            summary: {
              ...updatedSummary,
              variants: [],
            },
            option: {
              ...option,
              name: getFieldStringLocale(option.nameI18n, locale),
            },
          },
        ],
      };
      updatedSummary.variants.push(newVariant);
      diff.added = {
        variants: newVariant._id,
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
      const updatedProductSummaryResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            variants: updatedSummary.variants.map((variant) => {
              return {
                _id: variant._id,
                attributeId: variant.attributeId,
                attributeSlug: variant.attributeSlug,
                products: variant.products.map((variantProduct) => {
                  return {
                    _id: variantProduct._id,
                    optionId: variantProduct.optionId,
                    productId: variantProduct.productId,
                    productSlug: variantProduct.productSlug,
                  };
                }),
              };
            }),
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
        },
      );
      if (!updatedProductSummaryResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.variant.createSuccess'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('createProductVariant error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
