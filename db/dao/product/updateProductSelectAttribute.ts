import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { ObjectId } from 'mongodb';
import { DEFAULT_COMPANY_SLUG, FILTER_SEPARATOR, TASK_STATE_IN_PROGRESS } from 'config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from 'lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { getParentTreeIds } from 'lib/treeUtils';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  AttributeModel,
  ObjectIdModel,
  OptionModel,
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  ShopProductModel,
  SummaryDiffModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, ProductAttributeInterface } from 'db/uiInterfaces';

export interface UpdateProductSelectAttributeInputInterface {
  productId: string;
  productAttributeId: string;
  attributeId: string;
  selectedOptionsIds: string[];
}

export async function updateProductSelectAttribute({
  context,
  input,
}: DaoPropsInterface<UpdateProductSelectAttributeInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

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

      const selectedOptionsIds = input.selectedOptionsIds.map((_id) => new ObjectId(_id));
      const attributeId = new ObjectId(input.attributeId);
      const productAttributeId = new ObjectId(input.productAttributeId);

      // get summary or summary draft
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
          message: await getApiMessage('products.update.notFound'),
        };
        await session.abortTransaction();
        return;
      }
      const { summary } = summaryPayload;
      const updatedSummary = { ...summary };
      const diff: SummaryDiffModel = {};

      // get product attribute
      let productAttribute = summary.attributes.find((productAttribute) => {
        return productAttribute.attributeId.equals(attributeId);
      });
      const productAttributeNotExist = !productAttribute;

      // create new product attribute if original is absent
      if (!productAttribute) {
        productAttribute = {
          _id: productAttributeId,
          attributeId,
          optionIds: [],
          filterSlugs: [],
          number: undefined,
          textI18n: {},
          readableValueI18n: {},
        };
      }

      // get attribute
      const attribute = await attributesCollection.findOne({
        _id: attributeId,
      });
      if (!attribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // update product attribute
      // get selected options tree
      const finalOptionIds: ObjectIdModel[] = [];
      for await (const optionId of selectedOptionsIds) {
        const optionsTreeIds = await getParentTreeIds({
          collectionName: COL_OPTIONS,
          _id: optionId,
          acc: [],
        });
        optionsTreeIds.forEach((_id) => finalOptionIds.push(_id));
      }
      const finalOptions = await optionsCollection
        .find({
          _id: {
            $in: finalOptionIds,
          },
        })
        .toArray();
      const finalFilterSlugs = finalOptions.map(
        ({ slug }) => `${attribute.slug}${FILTER_SEPARATOR}${slug}`,
      );
      const oldFilterSlugs = [...productAttribute.filterSlugs];
      const readableValueI18n = getAttributeReadableValueLocales({
        productAttribute: {
          ...productAttribute,
          attribute: {
            ...attribute,
            options: finalOptions,
          },
        },
        gender: summary.gender,
      });
      productAttribute.readableValueI18n = readableValueI18n;
      productAttribute.optionIds = finalOptionIds;
      productAttribute.filterSlugs = finalFilterSlugs;

      // remove attribute if value is empty
      if (finalOptionIds.length < 1) {
        updatedSummary.attributes = updatedSummary.attributes.filter((productAttribute) => {
          return !productAttribute.attributeId.equals(attributeId);
        });
        updatedSummary.attributeIds = updatedSummary.attributeIds.filter((existingAttributeId) => {
          return !existingAttributeId.equals(attributeId);
        });
        updatedSummary.filterSlugs = updatedSummary.filterSlugs.filter((filterSlug) => {
          return !oldFilterSlugs.includes(filterSlug);
        });
        diff.deleted = {
          selectAttributes: [productAttribute._id],
        };
      } else {
        // add new attribute
        if (productAttributeNotExist) {
          updatedSummary.attributeIds.push(attributeId);
          updatedSummary.attributes.push(productAttribute);
          finalFilterSlugs.forEach((filterSlug) => {
            updatedSummary.filterSlugs.push(filterSlug);
          });
          diff.added = {
            selectAttributes: [productAttribute._id],
          };
        } else {
          // update existing attribute
          updatedSummary.attributes = updatedSummary.attributes.reduce(
            (acc: ProductAttributeInterface[], prevProductAttribute) => {
              if (prevProductAttribute.attributeId.equals(attributeId) && productAttribute) {
                return [...acc, productAttribute];
              }
              return [...acc, prevProductAttribute];
            },
            [],
          );
          updatedSummary.filterSlugs = updatedSummary.filterSlugs.filter((filterSlug) => {
            return !oldFilterSlugs.includes(filterSlug);
          });
          finalFilterSlugs.forEach((filterSlug) => {
            updatedSummary.filterSlugs.push(filterSlug);
          });
          diff.updated = {
            selectAttributes: [productAttribute._id],
          };
        }
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
      const updatedProductAttributeResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            filterSlugs: updatedSummary.filterSlugs,
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
            filterSlugs: updatedSummary.filterSlugs,
            attributeIds: updatedSummary.attributeIds,
          },
        },
      );
      await shopProductsCollection.updateMany(
        {
          productId: summary._id,
        },
        {
          $set: {
            filterSlugs: updatedSummary.filterSlugs,
          },
        },
      );

      // update product title
      execUpdateProductTitles(`productId=${summary._id.toHexString()}`);
      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
        payload: summary,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateProductSelectAttribute', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
