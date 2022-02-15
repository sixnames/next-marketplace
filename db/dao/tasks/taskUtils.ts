import { DEFAULT_COMPANY_SLUG, ROLE_SLUG_ADMIN, TASK_STATE_PENDING } from 'lib/config/common';
import { getTaskVariantSlugByRule } from 'lib/config/constantSelects';
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

export interface FindTaskInterface {
  taskId?: string | null;
}

export async function findTask({ taskId }: FindTaskInterface): Promise<TaskModel | null> {
  if (!taskId) {
    return null;
  }
  const { db } = await getDatabase();
  const tasksCollection = db.collection<TaskModel>(COL_TASKS);
  const task = await tasksCollection.findOne({
    _id: new ObjectId(taskId),
  });
  return task;
}

export interface FindOrCreateUserTaskInterface extends FindTaskInterface {
  taskId?: string | null;
  productId?: ObjectIdModel | string;
  executorId: ObjectIdModel | string;
  variantSlug: string;
  companySlug?: string;
}

export async function findOrCreateUserTask({
  taskId,
  executorId,
  productId,
  variantSlug,
  companySlug,
}: FindOrCreateUserTaskInterface): Promise<TaskModel | null> {
  try {
    const { db } = await getDatabase();
    const tasksCollection = db.collection<TaskModel>(COL_TASKS);
    let task = await findTask({
      taskId,
    });

    if (!task) {
      const itemId = await getNextItemId(COL_TASKS);
      const newTaskResult = await tasksCollection.insertOne({
        itemId,
        productId: new ObjectId(productId),
        variantSlug,
        executorId: new ObjectId(executorId),
        createdById: new ObjectId(executorId),
        stateEnum: TASK_STATE_PENDING,
        log: [],
        companySlug: companySlug || DEFAULT_COMPANY_SLUG,
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
  taskId: ObjectIdModel | string;
  prevStateEnum: TaskStateModel;
  nextStateEnum: TaskStateModel;
  diff?: SummaryDiffModel | null;
  draft?: JSONObjectModel | null;
  createdById: ObjectIdModel | string;
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
    _id: new ObjectId(taskId),
  });
  if (!task) {
    return false;
  }

  const taskLogItem: TaskLogModel = {
    _id: new ObjectId(),
    diff,
    prevStateEnum,
    nextStateEnum,
    comment,
    draft,
    createdById: new ObjectId(createdById),
    createdAt: new Date(),
  };

  const updatedTask = await tasksCollection.findOneAndUpdate(
    {
      _id: task._id,
    },
    {
      $set: {
        stateEnum: nextStateEnum,
      },
      $push: {
        log: taskLogItem,
      },
    },
  );

  return Boolean(updatedTask.ok);
}
