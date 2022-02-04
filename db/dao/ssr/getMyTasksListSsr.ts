import { SORT_ASC } from 'config/common';
import { TaskVariantModel } from 'db/dbModels';
import { getFieldStringLocale } from 'lib/i18n';
import { getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { COL_TASK_VARIANTS, COL_TASKS, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { TaskInterface, UserInterface } from 'db/uiInterfaces';
import { getUserAllowedTaskVariants } from 'lib/taskUtils';
import { ObjectId } from 'mongodb';
import { getTaskNestedFieldsPipeline } from './getCompanyTaskSsr';

export interface GetMyTasksListSsr {
  sessionUser: UserInterface;
  locale: string;
  companySlug?: string;
}

export async function getMyTasksListSsr({
  sessionUser,
  companySlug,
  locale,
}: GetMyTasksListSsr): Promise<TaskInterface[]> {
  try {
    const { db } = await getDatabase();
    const tasksCollection = db.collection<TaskInterface>(COL_TASKS);
    const tasksVariantsCollection = db.collection<TaskVariantModel>(COL_TASK_VARIANTS);
    const taskVariantSlugs = await getUserAllowedTaskVariants({
      roleId: sessionUser.roleId,
      roleSlug: sessionUser.role?.slug,
    });

    // get allowed task variants
    const taskVariants = await tasksVariantsCollection
      .find(
        {
          slug: {
            $in: taskVariantSlugs,
          },
        },
        {
          projection: {
            _id: true,
          },
        },
      )
      .toArray();
    const taskVariantIds = taskVariants.map(({ _id }) => _id);
    if (taskVariantIds.length < 1) {
      return [];
    }
    const taskVariantIdsMatch = {
      variantId: {
        $in: taskVariantIds,
      },
    };

    const tasksCommonPipeline = [
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
    ];

    const companyMatch = companySlug ? { companySlug } : {};

    // get user assigned tasks
    const userTasksAggregation = await tasksCollection
      .aggregate<TaskInterface>([
        {
          $match: {
            ...companyMatch,
            ...taskVariantIdsMatch,
            executorId: new ObjectId(sessionUser._id),
          },
        },
        ...tasksCommonPipeline,
      ])
      .toArray();

    // get not assigned tasks
    const newTasksAggregation = await tasksCollection
      .aggregate<TaskInterface>([
        {
          $match: {
            ...companyMatch,
            ...taskVariantIdsMatch,
            executorId: null,
          },
        },
        ...tasksCommonPipeline,
      ])
      .toArray();

    const tasksAggregation = [...userTasksAggregation, ...newTasksAggregation];
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
    console.log('getMyTasksListSsr error', e);
    return [];
  }
}
