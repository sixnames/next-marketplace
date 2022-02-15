import { getTextContents, Value } from '@react-page/editor';
import { reactPageCellPlugins } from 'components/PageEditor';
import { DEFAULT_LOCALE, TASK_STATE_IN_PROGRESS } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
import { COL_LANGUAGES } from 'db/collectionNames';
import { getCitiesList } from 'db/dao/cities/getCitiesList';
import { addTaskLogItem, findOrCreateUserTask } from 'db/dao/tasks/taskUtils';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateCitiesSeoContent } from 'lib/seoContentUniquenessUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { LanguageModel, ProductPayloadModel, SummaryDiffModel } from 'db/dbModels';
import { DaoPropsInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';

export interface UpdateProductCardContentInputInterface {
  taskId?: string | null;
  seoContentsList: SeoContentCitiesInterface;
  companySlug: string;
  productId: string;
}

export async function updateProductCardContent({
  context,
  input,
}: DaoPropsInterface<UpdateProductCardContentInputInterface>): Promise<ProductPayloadModel> {
  try {
    const { db } = await getDatabase();
    const { getApiMessage } = await getRequestParams(context);
    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('products.update.error'),
      };
    }

    // permission
    const { allow, message, role, user } = await getOperationPermission({
      context,
      slug: 'updateProductSeoContent',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }
    const { seoContentsList, companySlug, productId, taskId } = input;

    const taskVariantSlug = getTaskVariantSlugByRule('updateProductSeoContent');
    const diff: SummaryDiffModel = {};

    // create task log for content manager
    if (role.isContentManager && user) {
      const task = await findOrCreateUserTask({
        productId,
        variantSlug: taskVariantSlug,
        executorId: user._id,
        companySlug,
        taskId,
      });
      if (!task) {
        return {
          success: false,
          message: await getApiMessage('tasks.create.error'),
        };
      }

      const cities = await getCitiesList();
      const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
      const languages = await languagesCollection.find({}).toArray();
      const locales = languages.map(({ slug }) => slug);

      let symbolCounter = 0;
      for await (const city of cities) {
        const seoContent = seoContentsList[city.slug];
        if (seoContent) {
          for await (const locale of locales) {
            const isDefaultLocale = locale === DEFAULT_LOCALE;
            const rawText = JSON.parse(seoContent.content);
            const textContents = getTextContents(rawText as Value, {
              lang: locale,
              cellPlugins: reactPageCellPlugins(),
            }).join(' ');

            if (!isDefaultLocale) {
              const defaultLocaleTextContents = getTextContents(rawText as Value, {
                lang: DEFAULT_LOCALE,
                cellPlugins: reactPageCellPlugins(),
              }).join(' ');
              if (defaultLocaleTextContents === textContents) {
                continue;
              }
            }
            symbolCounter += textContents.length;
          }
        }
      }
      diff.updated = {
        seoContent: symbolCounter,
      };

      const newTaskLogResult = await addTaskLogItem({
        taskId: task._id,
        diff,
        prevStateEnum: task.stateEnum,
        nextStateEnum: TASK_STATE_IN_PROGRESS,
        draft: seoContentsList,
        createdById: user._id,
      });

      if (!newTaskLogResult) {
        return {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('products.update.success'),
      };
    }

    await updateCitiesSeoContent({
      seoContentsList,
      companySlug,
    });

    return {
      success: true,
      message: await getApiMessage('products.update.success'),
    };
  } catch (e) {
    console.log('updateProductCardContent error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
