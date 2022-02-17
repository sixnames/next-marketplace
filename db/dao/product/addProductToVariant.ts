import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { ObjectIdModel, ProductPayloadModel, SummaryDiffModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  getProductFullSummary,
  getProductFullSummaryWithDraft,
} from 'db/ssr/products/getProductFullSummary';
import {
  DaoPropsInterface,
  ProductVariantInterface,
  ProductVariantItemInterface,
} from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getFieldStringLocale } from 'lib/i18n';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { addProductToConnectionSchema } from 'validation/productSchema';

export interface AddProductToVariantInputInterface {
  taskId?: string | null;
  productId: string;
  addProductId: string;
  variantId: string;
}

export async function addProductToVariant({
  input,
  context,
}: DaoPropsInterface<AddProductToVariantInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();
  const optionsCollection = collections.optionsCollection();

  const session = collections.client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.variant.updateError`),
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
        schema: addProductToConnectionSchema,
      });
      await validationSchema.validate(input);

      // get summary or summary draft
      const addProductId = new ObjectId(input.addProductId);
      const variantId = new ObjectId(input.variantId);
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductVariants');
      const summaryPayload = await getProductFullSummaryWithDraft({
        locale,
        productId: input.productId,
        companySlug: DEFAULT_COMPANY_SLUG,
        taskId: input.taskId,
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

      const addSummaryPayload = await getProductFullSummary({
        locale,
        productId: input.addProductId,
        companySlug: DEFAULT_COMPANY_SLUG,
      });
      if (!addSummaryPayload) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }
      const addSummary = addSummaryPayload.summary;

      const variant = updatedSummary.variants.find((variant) => {
        return variant._id.equals(variantId);
      });
      if (!addSummary || !variant) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // check attribute existence in added product
      const addProductAttribute = addSummary.attributes.find(({ attributeId }) => {
        return variant.attributeId.equals(attributeId);
      });
      const addProductOptionId = addProductAttribute?.optionIds[0];
      if (!addProductAttribute || !addProductOptionId) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.variant.noAttributeError'),
        };
        await session.abortTransaction();
        return;
      }

      // check attribute value in added product
      // it should have attribute value and shouldn't intersect with existing values in variant
      const variantOptionIds = variant.products.reduce((acc: ObjectId[], { optionId }) => {
        return [...acc, optionId];
      }, []);
      const includes = variantOptionIds.some((_id) => {
        return _id.equals(addProductOptionId);
      });

      if (includes) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.variant.intersect'),
        };
        await session.abortTransaction();
        return;
      }

      // find current option
      const option = await optionsCollection.findOne({
        _id: addProductOptionId,
      });
      if (!option) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.variant.updateError`),
        };
        await session.abortTransaction();
        return;
      }

      // update variants with new variant item
      const updateProductIds: ObjectIdModel[] = [];
      const updatedVariantProducts: ProductVariantItemInterface[] = [
        ...variant.products,
        {
          _id: new ObjectId(),
          optionId: option._id,
          productId: addProductId,
          productSlug: addSummary.slug,
          isCurrent: false,
          summary: {
            ...addSummary,
            variants: [],
          },
          option: {
            ...option,
            name: getFieldStringLocale(option.nameI18n, locale),
          },
        },
      ];
      updatedVariantProducts.forEach(({ productId }) => {
        if (!productId.equals(addSummary._id)) {
          updateProductIds.push(productId);
        }
      });
      const updatedVariant: ProductVariantInterface = {
        ...variant,
        products: updatedVariantProducts,
      };

      const updateVariants = updatedSummary.variants.reduce(
        (acc: ProductVariantInterface[], variant) => {
          if (variant._id.equals(variantId)) {
            return [...acc, updatedVariant];
          }
          return [...acc, variant];
        },
        [],
      );
      updatedSummary.variants = updateVariants;
      diff.added = {
        variantProducts: {
          productId: addSummary._id,
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
      if (updateProductIds.length > 0) {
        const updatedSummaryResult = await productSummariesCollection.updateMany(
          {
            _id: {
              $in: updateProductIds,
            },
          },
          {
            $set: {
              'variants.$[oldVariant].products': updatedVariantProducts.map((variantProduct) => {
                return {
                  _id: variantProduct._id,
                  optionId: variantProduct.optionId,
                  productId: variantProduct.productId,
                  productSlug: variantProduct.productSlug,
                };
              }),
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
        if (!updatedSummaryResult.acknowledged) {
          mutationPayload = {
            success: false,
            message: await getApiMessage(`products.variant.updateError`),
          };
          await session.abortTransaction();
          return;
        }
      }
      const updatedAddedSummaryResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: addSummary._id,
        },
        {
          $push: {
            variants: {
              _id: updatedVariant._id,
              attributeId: updatedVariant.attributeId,
              attributeSlug: updatedVariant.attributeSlug,
              products: updatedVariantProducts.map((variantProduct) => {
                return {
                  _id: variantProduct._id,
                  optionId: variantProduct.optionId,
                  productId: variantProduct.productId,
                  productSlug: variantProduct.productSlug,
                };
              }),
            },
          },
        },
      );
      if (!updatedAddedSummaryResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.variant.updateError`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.variant.addProductSuccess'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('addProductToVariant', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
