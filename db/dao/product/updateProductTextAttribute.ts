import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import { DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from 'lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { COL_ATTRIBUTES, COL_PRODUCT_FACETS, COL_PRODUCT_SUMMARIES } from 'db/collectionNames';
import {
  AttributeModel,
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  SummaryDiffModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  DaoPropsInterface,
  ProductAttributeInterface,
  ProductSummaryInterface,
} from 'db/uiInterfaces';

export interface UpdateProductTextAttributeItemInputInterface {
  productAttributeId: string;
  attributeId: string;
  textI18n?: TranslationModel | null;
}

export interface UpdateProductTextAttributeInputInterface {
  productId: string;
  attributes: UpdateProductTextAttributeItemInputInterface[];
}

export async function updateProductTextAttribute({
  input,
  context,
}: DaoPropsInterface<UpdateProductTextAttributeInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

  const session = client.startSession();

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
          textAttributes: [],
        },
        updated: {
          textAttributes: [],
        },
        deleted: {
          textAttributes: [],
        },
      };
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductAttributes');
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
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const { summary } = summaryPayload;
      let productAttributes = summary.attributes;
      let attributeIds = summary.attributeIds;

      for await (const inputAttribute of input.attributes) {
        const { textI18n } = inputAttribute;
        const productAttributeId = new ObjectId(inputAttribute.productAttributeId);
        const attributeId = new ObjectId(inputAttribute.attributeId);

        // remove attribute if value not set
        if (!textI18n || !textI18n[DEFAULT_LOCALE]) {
          productAttributes = productAttributes.filter((productAttribute) => {
            return !productAttribute.attributeId.equals(attributeId);
          });
          attributeIds = attributeIds.filter((_id) => {
            return !_id.equals(attributeId);
          });
          diff.deleted?.textAttributes?.push(productAttributeId);
          continue;
        }

        // get product attribute
        let productAttribute = await summary.attributes.find(({ _id }) => {
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
            number: null,
            textI18n,
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
          diff.added?.textAttributes?.push(productAttributeId);
          continue;
        }

        if (
          productAttribute.textI18n?.[DEFAULT_LOCALE] !== textI18n[DEFAULT_LOCALE] ||
          productAttribute.textI18n?.[SECONDARY_LOCALE] !== textI18n[SECONDARY_LOCALE]
        ) {
          productAttribute.textI18n = textI18n;
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
          diff.updated?.textAttributes?.push(productAttributeId);
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
          nextStateEnum: task.stateEnum,
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
    console.log('updateProductTextAttribute', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
