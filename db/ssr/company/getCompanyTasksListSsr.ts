import { COL_TASK_VARIANTS, COL_USERS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getTaskNestedFieldsPipeline } from 'db/ssr/company/getCompanyTaskSsr';
import { TaskInterface } from 'db/uiInterfaces';
import { SORT_ASC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';

export interface GetCompanyTasksListSsr {
  companySlug: string;
  locale: string;
}

export async function getCompanyTasksListSsr({
  companySlug,
  locale,
}: GetCompanyTasksListSsr): Promise<TaskInterface[] | null> {
  try {
    const collections = await getDbCollections();
    const tasksCollection = collections.tasksCollection();
    const tasksAggregation = await tasksCollection
      .aggregate<TaskInterface>([
        {
          $match: {
            companySlug,
          },
        },
        {
          $sort: {
            _id: SORT_ASC,
          },
        },
        {
          $lookup: {
            as: 'variant',
            from: COL_TASK_VARIANTS,
            ...getTaskNestedFieldsPipeline('variantId'),
          },
        },
        {
          $lookup: {
            as: 'creator',
            from: COL_USERS,
            ...getTaskNestedFieldsPipeline('createdById'),
          },
        },
        {
          $lookup: {
            as: 'executor',
            from: COL_USERS,
            ...getTaskNestedFieldsPipeline('executorId'),
          },
        },
        {
          $addFields: {
            variant: {
              $arrayElemAt: ['$variant', 0],
            },
            creator: {
              $arrayElemAt: ['$creator', 0],
            },
            executor: {
              $arrayElemAt: ['$executor', 0],
            },
          },
        },
      ])
      .toArray();
    const tasks: TaskInterface[] = tasksAggregation.map((taskVariant) => {
      const variant = taskVariant.variant
        ? {
            ...taskVariant.variant,
            name: getFieldStringLocale(taskVariant.variant.nameI18n, locale),
          }
        : null;
      const originalName = getFieldStringLocale(taskVariant.nameI18n, locale);
      const name = originalName || variant?.name;

      return {
        ...taskVariant,
        name,
        variant,
        creator: taskVariant.creator
          ? {
              ...taskVariant.creator,
              shortName: getShortName(taskVariant.creator),
              formattedPhone: {
                raw: phoneToRaw(taskVariant.creator.phone),
                readable: phoneToReadable(taskVariant.creator.phone),
              },
            }
          : null,
        executor: taskVariant.executor
          ? {
              ...taskVariant.executor,
              shortName: getShortName(taskVariant.executor),
              formattedPhone: {
                raw: phoneToRaw(taskVariant.executor.phone),
                readable: phoneToReadable(taskVariant.executor.phone),
              },
            }
          : null,
      };
    });
    return tasks;
  } catch (e) {
    console.log('getCompanyTasksListSsr error', e);
    return null;
  }
}
