import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { getFullProductSummary } from 'lib/productUtils';
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
  COL_TASKS,
} from 'db/collectionNames';
import {
  AttributeModel,
  ObjectIdModel,
  OptionModel,
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  ShopProductModel,
  TaskModel,
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

      // get summary
      const summaryPayload = await getFullProductSummary({
        locale,
        productId: input.productId,
        companySlug: DEFAULT_COMPANY_SLUG,
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

      const updatedSummary = { ...summary };

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
      } else {
        // add new attribute
        if (productAttributeNotExist) {
          updatedSummary.attributeIds.push(attributeId);
          updatedSummary.attributes.push(productAttribute);
          finalFilterSlugs.forEach((filterSlug) => {
            updatedSummary.filterSlugs.push(filterSlug);
          });
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
        }
      }

      // TODO draft
      if (role.isContentManager && user) {
        const tasksCollection = db.collection<TaskModel>(COL_TASKS);

        const task = await tasksCollection.findOne({
          productId: summary._id,
          variantSlug: getTaskVariantSlugByRule('updateProductAttributes'),
          executorId: user._id,
          stateEnum: TASK_STATE_IN_PROGRESS,
        });
        console.log(task);

        if (!task) {
          mutationPayload = {
            success: false,
            message: await getApiMessage('products.update.error'),
          };
          await session.abortTransaction();
          return;
        } else {
          mutationPayload = {
            success: false,
            message: await getApiMessage('products.update.error'),
          };
          await session.abortTransaction();
          return;
        }
      }

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
