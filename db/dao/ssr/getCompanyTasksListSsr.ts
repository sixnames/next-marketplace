import { SORT_ASC } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getShortName } from '../../../lib/nameUtils';
import { phoneToRaw, phoneToReadable } from '../../../lib/phoneUtils';
import { COL_TASK_VARIANTS, COL_TASKS, COL_USERS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { TaskInterface } from '../../uiInterfaces';
import { getTaskNestedFieldsPipeline } from './getCompanyTaskSsr';

export interface GetCompanyTaskVariantsListSsr {
  companySlug: string;
  locale: string;
}

export async function getCompanyTasksListSsr({
  companySlug,
  locale,
}: GetCompanyTaskVariantsListSsr): Promise<TaskInterface[] | null> {
  try {
    const { db } = await getDatabase();
    const tasksCollection = db.collection<TaskInterface>(COL_TASKS);
    const taskVariantsAggregation = await tasksCollection
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
    const taskVariants: TaskInterface[] = taskVariantsAggregation.map((taskVariant) => {
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
    return taskVariants;
  } catch (e) {
    console.log('getCompanyTaskVariantsListSsr error', e);
    return null;
  }
}
