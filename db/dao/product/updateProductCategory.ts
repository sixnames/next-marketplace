import { COL_CATEGORIES } from 'db/collectionNames';
import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { ProductPayloadModel, SummaryDiffModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG, TASK_STATE_IN_PROGRESS } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { getParentTreeSlugs } from 'lib/treeUtils';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { ObjectId } from 'mongodb';

export interface UpdateProductCategoryInputInterface {
  productId: string;
  categoryId: string;
  taskId?: string | null;
}

export async function updateProductCategory({
  input,
  context,
}: DaoPropsInterface<UpdateProductCategoryInputInterface>): Promise<ProductPayloadModel> {
  const collections = await getDbCollections();
  const { getApiMessage, locale } = await getRequestParams(context);
  const productSummariesCollection = collections.productSummariesCollection();
  const productFacetsCollection = collections.productFacetsCollection();
  const shopProductsCollection = collections.shopProductsCollection();
  const categoriesCollection = collections.categoriesCollection();

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
        slug: 'updateProductCategories',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // get summary or summary draft
      const taskVariantSlug = getTaskVariantSlugByRule('updateProductCategories');
      const summaryPayload = await getFullProductSummaryWithDraft({
        taskId: input.taskId,
        locale,
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

      // get category
      const category = await categoriesCollection.findOne({ _id: new ObjectId(input.categoryId) });
      if (!category) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.error`),
        };
        await session.abortTransaction();
        return;
      }

      // get category siblings
      let countSelectedSiblings = 0;
      if (category.parentId) {
        countSelectedSiblings = await categoriesCollection.countDocuments({
          _id: {
            $ne: category._id,
          },
          parentId: category.parentId,
          slug: {
            $in: summary.filterSlugs,
          },
        });
      }

      // toggle category in product
      const selected = summary.filterSlugs.some((slug) => slug === category.slug);
      const categoryParentTreeSlugs = await getParentTreeSlugs({
        _id: category._id,
        collectionName: COL_CATEGORIES,
        acc: [],
      });
      if (selected) {
        if (countSelectedSiblings > 0) {
          updatedSummary.filterSlugs = updatedSummary.filterSlugs.filter((slug) => {
            return slug !== category.slug;
          });
          updatedSummary.titleCategorySlugs = updatedSummary.titleCategorySlugs.filter((slug) => {
            return slug !== category.slug;
          });
          diff.deleted = {
            categories: [category.slug],
          };
        } else {
          updatedSummary.filterSlugs = updatedSummary.filterSlugs.filter((slug) => {
            return !categoryParentTreeSlugs.includes(slug);
          });
          updatedSummary.titleCategorySlugs = updatedSummary.titleCategorySlugs.filter((slug) => {
            return !categoryParentTreeSlugs.includes(slug);
          });
          diff.deleted = {
            categories: categoryParentTreeSlugs,
          };
        }
      } else {
        categoryParentTreeSlugs.forEach((slug) => {
          updatedSummary.filterSlugs.push(slug);
        });
        diff.added = {
          categories: categoryParentTreeSlugs,
        };
      }

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
      const updatedProductAttributeResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            filterSlugs: updatedSummary.filterSlugs,
            titleCategorySlugs: updatedSummary.titleCategorySlugs,
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
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateProductCategory error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
