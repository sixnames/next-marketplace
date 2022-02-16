import { COL_PRODUCT_SUMMARIES, COL_TASK_VARIANTS, COL_USERS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { TaskInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName, getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';

export interface GetCompanyTaskSsr {
  taskId: string;
  locale: string;
  noProduct?: boolean;
}

export function getTaskNestedFieldsPipeline(field: string) {
  return {
    let: {
      [field]: `$${field}`,
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $cond: [
              {
                $eq: [
                  {
                    $type: `$$${field}`,
                  },
                  'missing',
                ],
              },
              {
                $eq: ['$_id', null],
              },
              {
                $eq: ['$_id', `$$${field}`],
              },
            ],
          },
        },
      },
    ],
  };
}

export async function getCompanyTaskSsr({
  taskId,
  locale,
  noProduct,
}: GetCompanyTaskSsr): Promise<TaskInterface | null> {
  try {
    const collections = await getDbCollections();
    const tasksCollection = collections.tasksCollection();
    const tasksAggregation = await tasksCollection
      .aggregate<TaskInterface>([
        {
          $match: {
            _id: new ObjectId(taskId),
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
          $lookup: {
            as: 'product',
            from: COL_PRODUCT_SUMMARIES,
            ...getTaskNestedFieldsPipeline('productId'),
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
            product: {
              $arrayElemAt: ['$product', 0],
            },
          },
        },
      ])
      .toArray();
    const taskAggregationResult = tasksAggregation[0];
    if (!taskAggregationResult) {
      return null;
    }

    const variant = taskAggregationResult.variant
      ? {
          ...taskAggregationResult.variant,
          name: getFieldStringLocale(taskAggregationResult.variant.nameI18n, locale),
        }
      : null;
    const originalName = getFieldStringLocale(taskAggregationResult.nameI18n, locale);
    const name = originalName || variant?.name;

    const task: TaskInterface = {
      ...taskAggregationResult,
      name,
      variant,
      product: taskAggregationResult.product
        ? {
            ...taskAggregationResult.product,
            snippetTitle: getFieldStringLocale(
              taskAggregationResult.product.snippetTitleI18n,
              locale,
            ),
          }
        : null,
      creator: taskAggregationResult.creator
        ? {
            ...taskAggregationResult.creator,
            shortName: getShortName(taskAggregationResult.creator),
            fullName: getFullName(taskAggregationResult.creator),
            formattedPhone: {
              raw: phoneToRaw(taskAggregationResult.creator.phone),
              readable: phoneToReadable(taskAggregationResult.creator.phone),
            },
          }
        : null,
      executor: taskAggregationResult.executor
        ? {
            ...taskAggregationResult.executor,
            shortName: getShortName(taskAggregationResult.executor),
            fullName: getFullName(taskAggregationResult.executor),
            formattedPhone: {
              raw: phoneToRaw(taskAggregationResult.executor.phone),
              readable: phoneToReadable(taskAggregationResult.executor.phone),
            },
          }
        : null,
    };

    return {
      ...task,
      product: noProduct ? null : task.product,
    };
  } catch (e) {
    console.log('getCompanyTaskVariantsListSsr error', e);
    return null;
  }
}
