import {
  DEFAULT_COMPANY_SLUG,
  ROLE_SLUG_ADMIN,
  TASK_STATE_IN_PROGRESS,
  TASK_STATE_PENDING,
} from 'config/common';
import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { COL_TASKS } from 'db/collectionNames';
import {
  JSONObjectModel,
  ObjectIdModel,
  SummaryDiffModel,
  TaskLogModel,
  TaskModel,
  TaskStateModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getNextItemId } from 'lib/itemIdUtils';
import { getRoleRules, RoleRuleSlugType } from 'lib/roleRuleUtils';
import { ObjectId } from 'mongodb';

interface GetUserAllowedTaskVariantsInterface {
  roleId: ObjectIdModel | string;
  roleSlug?: string | null;
}

export async function getUserAllowedTaskVariants({
  roleId,
  roleSlug,
}: GetUserAllowedTaskVariantsInterface): Promise<string[]> {
  const taskVariantSlugs: string[] = [];
  const rules = await getRoleRules({
    roleId,
  });

  const rulesConfigs: RoleRuleSlugType[] = [
    'updateProductAttributes',
    'updateProductAssets',
    'updateProductCategories',
    'updateProductVariants',
    'updateProductBrand',
    'updateProductSeoContent',
    'updateProduct',
  ];

  rulesConfigs.forEach((ruleSlug) => {
    const rule = rules.find(({ slug }) => ruleSlug === slug);
    if (rule?.allow || roleSlug === ROLE_SLUG_ADMIN) {
      const taskVariantSlug = getTaskVariantSlugByRule(ruleSlug);
      taskVariantSlugs.push(taskVariantSlug);
    }
  });

  return taskVariantSlugs;
}

export interface FindOrCreateUserTaskInterface {
  productId?: ObjectIdModel;
  executorId: ObjectIdModel;
  variantSlug: string;
}

export async function findOrCreateUserTask({
  executorId,
  productId,
  variantSlug,
}: FindOrCreateUserTaskInterface): Promise<TaskModel | null> {
  try {
    const { db } = await getDatabase();
    const tasksCollection = db.collection<TaskModel>(COL_TASKS);

    const productIdQuery = productId ? { productId } : {};
    let task = await tasksCollection.findOne({
      ...productIdQuery,
      variantSlug,
      executorId,
      stateEnum: {
        $in: [TASK_STATE_IN_PROGRESS, TASK_STATE_PENDING],
      },
    });

    if (!task) {
      const itemId = await getNextItemId(COL_TASKS);
      const newTaskResult = await tasksCollection.insertOne({
        itemId,
        productId,
        // variantSlug: getTaskVariantSlugByRule('updateProductAttributes'),
        variantSlug,
        executorId,
        createdById: executorId,
        stateEnum: TASK_STATE_IN_PROGRESS,
        log: [],
        companySlug: DEFAULT_COMPANY_SLUG,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      task = await tasksCollection.findOne({
        _id: newTaskResult.insertedId,
      });
    }

    if (!task) {
      return null;
    }

    return task;
  } catch (e) {
    console.log('findOrCreateUserTask error', e);
    return null;
  }
}

export interface AddTaskLogItemInterface {
  taskId: ObjectIdModel;
  prevStateEnum: TaskStateModel;
  nextStateEnum: TaskStateModel;
  diff?: SummaryDiffModel | null;
  draft?: JSONObjectModel | null;
  createdById: ObjectIdModel;
  comment?: string;
}

export async function addTaskLogItem({
  comment,
  createdById,
  diff,
  draft,
  nextStateEnum,
  prevStateEnum,
  taskId,
}: AddTaskLogItemInterface): Promise<boolean> {
  const { db } = await getDatabase();
  const tasksCollection = db.collection<TaskModel>(COL_TASKS);
  const task = await tasksCollection.findOne({
    _id: taskId,
  });
  if (!task) {
    return false;
  }

  const taskLogItem: TaskLogModel = {
    _id: new ObjectId(),
    diff,
    prevStateEnum,
    nextStateEnum,
    createdAt: new Date(),
    comment,
    draft,
    createdById,
  };
  const updatedTask = await tasksCollection.findOneAndUpdate(
    {
      _id: task._id,
    },
    {
      $push: {
        log: taskLogItem,
      },
    },
  );

  return Boolean(updatedTask.ok);
}
