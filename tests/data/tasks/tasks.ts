import { TaskModel } from 'db/dbModels';
import { DEFAULT_COMPANY_SLUG, TASK_STATE_PENDING } from 'lib/config/common';
import {
  TASK_VARIANT_SLUG_PRODUCT_ASSETS,
  TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
  TASK_VARIANT_SLUG_PRODUCT_BRANDS,
  TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
  TASK_VARIANT_SLUG_PRODUCT_DETAILS,
  TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
  TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
} from 'lib/config/constantSelects';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

interface TaskBaseModel
  extends Omit<
    TaskModel,
    | '_id'
    | 'createdById'
    | 'createdAt'
    | 'companySlug'
    | 'updatedAt'
    | 'log'
    | 'itemId'
    | 'stateEnum'
  > {}

function generateTasks(bases: TaskBaseModel[]): TaskModel[] {
  return bases.map((base, index) => {
    return {
      ...base,
      _id: getObjectId(`task ${index + 1}`),
      stateEnum: TASK_STATE_PENDING,
      itemId: `00000${index + 1}`,
      companySlug: DEFAULT_COMPANY_SLUG,
      createdById: getObjectId('admin'),
      createdAt: new Date(),
      updatedAt: new Date(),
      log: [],
    };
  });
}

const taskBases: TaskBaseModel[] = [
  {
    productId: getObjectId('000150'),
    variantId: getObjectId('task variant product attributes'),
    variantSlug: TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
  },
  {
    productId: getObjectId('000010'),
    executorId: getObjectId('content manager'),
    variantId: getObjectId('task variant product assets'),
    variantSlug: TASK_VARIANT_SLUG_PRODUCT_ASSETS,
  },
  {
    productId: getObjectId('000010'),
    executorId: getObjectId('content manager'),
    variantId: getObjectId('task variant product seo text'),
    variantSlug: TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
  },
  {
    productId: getObjectId('000010'),
    executorId: getObjectId('content manager'),
    variantId: getObjectId('task variant product categories'),
    variantSlug: TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
  },
  {
    productId: getObjectId('000010'),
    executorId: getObjectId('content manager'),
    variantId: getObjectId('task variant product variants'),
    variantSlug: TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
  },
  {
    productId: getObjectId('000010'),
    executorId: getObjectId('content manager'),
    variantId: getObjectId('task variant product brand'),
    variantSlug: TASK_VARIANT_SLUG_PRODUCT_BRANDS,
  },
  {
    productId: getObjectId('000010'),
    executorId: getObjectId('content manager'),
    variantId: getObjectId('task variant product details'),
    variantSlug: TASK_VARIANT_SLUG_PRODUCT_DETAILS,
  },
];

// @ts-ignore
export = generateTasks(taskBases);
