import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { ProductPayloadModel, SummaryDiffModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  DaoPropsInterface,
  ProductAttributeInterface,
  ProductSummaryInterface,
} from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from 'lib/productAttributesUtils';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface UpdateProductNumberAttributeItemInputInterface {
  productAttributeId: string;
  attributeId: string;
  number?: number | null;
}

export interface UpdateProductNumberAttributeInputInterface {
  productId: string;
  taskId?: string | null;
  attributes: UpdateProductNumberAttributeItemInputInterface[];
}

export async function updateProductNumberAttribute({
  input,
  context,
}: DaoPropsInterface<UpdateProductNumberAttributeInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();
  const productFacetsCollection = collections.productFacetsCollection();
  const attributesCollection = collections.attributesCollection();

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
        slug: 'updateProductAttributes',
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

      // get summary or summary draft
      const diff: SummaryDiffModel = {
        added: {
          numberAttributes: [],
        },
        updated: {
          numberAttributes: [],
        },
        deleted: {
          numberAttributes: [],
        },
      };
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductAttributes');
      const summaryPayload = await getFullProductSummaryWithDraft({
        locale,
        taskId: input.taskId,
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
      let productAttributes = summary.attributes;
      let attributeIds = summary.attributeIds;

      for await (const inputAttribute of input.attributes) {
        const { number } = inputAttribute;
        const productAttributeId = new ObjectId(inputAttribute.productAttributeId);
        const attributeId = new ObjectId(inputAttribute.attributeId);

        // remove attribute if value not set
        if (!number && number !== 0) {
          productAttributes = productAttributes.filter((productAttribute) => {
            return !productAttribute.attributeId.equals(attributeId);
          });
          attributeIds = attributeIds.filter((_id) => {
            return !_id.equals(attributeId);
          });
          diff.deleted?.numberAttributes?.push(productAttributeId);
          continue;
        }

        // get product attribute
        let productAttribute = summary.attributes.find(({ _id }) => {
          return _id.equals(productAttributeId);
        });

        // get attribute
        const attribute = await attributesCollection.findOne({ _id: attributeId });
        if (!attribute) {
          continue;
        }
        const productAttributeNotExist = !productAttribute;

        // create new product attribute if original is absent
        if (!productAttribute) {
          productAttribute = {
            _id: productAttributeId,
            attributeId,
            optionIds: [],
            filterSlugs: [],
            number,
            textI18n: {},
            readableValueI18n: {},
          };
        }
        const readableValueI18n = getAttributeReadableValueLocales({
          productAttribute: {
            ...productAttribute,
            attribute,
          },
          gender: summary.gender,
        });
        productAttribute.readableValueI18n = readableValueI18n;

        // add new attribute
        if (productAttributeNotExist) {
          productAttributes.push(productAttribute);
          attributeIds.push(attributeId);
          diff.added?.numberAttributes?.push(productAttributeId);
          continue;
        }

        if (productAttribute.number !== number) {
          productAttribute.number = number;

          // update existing attribute
          productAttributes = productAttributes.reduce(
            (acc: ProductAttributeInterface[], prevProductAttribute) => {
              if (prevProductAttribute._id.equals(productAttributeId) && productAttribute) {
                return [...acc, productAttribute];
              }
              return [...acc, prevProductAttribute];
            },
            [],
          );
          diff.updated?.numberAttributes?.push(productAttributeId);
        }
      }

      // create task log for content manager
      const updatedSummary: ProductSummaryInterface = {
        ...summary,
        attributeIds,
        attributes: productAttributes,
      };
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
      const updatedProductAttributeResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            attributeIds: updatedSummary.attributeIds,
            attributes: updatedSummary.attributes.map((productAttribute) => {
              return {
                _id: productAttribute._id,
                attributeId: productAttribute.attributeId,
                filterSlugs: productAttribute.filterSlugs,
                optionIds: productAttribute.optionIds,
                readableValueI18n: productAttribute.readableValueI18n,
                number: productAttribute.number,
                textI18n: productAttribute.textI18n,
              };
            }),
          },
        },
      );
      if (!updatedProductAttributeResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }
      await productFacetsCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            attributeIds: updatedSummary.attributeIds,
          },
        },
      );

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
        payload: summary,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateProductNumberAttribute', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
