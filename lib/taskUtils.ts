import { ROLE_SLUG_ADMIN } from 'config/common';
import {
  TASK_VARIANT_SLUG_PRODUCT_ASSETS,
  TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
  TASK_VARIANT_SLUG_PRODUCT_BRANDS,
  TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
  TASK_VARIANT_SLUG_PRODUCT_DETAILS,
  TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
  TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
} from 'config/constantSelects';
import { ObjectIdModel } from 'db/dbModels';
import { getRoleRules, RoleRuleSlugType } from 'lib/roleRuleUtils';

interface GetUserAllowedTaskVariantsInterface {
  roleId: ObjectIdModel | string;
  roleSlug?: string | null;
}

interface GetUserAllowedTaskVariantsConfigInterface {
  ruleSlug: RoleRuleSlugType;
  taskVariantSlug: string;
}

export async function getUserAllowedTaskVariants({
  roleId,
  roleSlug,
}: GetUserAllowedTaskVariantsInterface): Promise<string[]> {
  const taskVariantSlugs: string[] = [];
  const rules = await getRoleRules({
    roleId,
  });

  const rulesConfigs: GetUserAllowedTaskVariantsConfigInterface[] = [
    {
      ruleSlug: 'updateProductAttributes',
      taskVariantSlug: TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
    },
    {
      ruleSlug: 'updateProductAssets',
      taskVariantSlug: TASK_VARIANT_SLUG_PRODUCT_ASSETS,
    },
    {
      ruleSlug: 'updateProductCategories',
      taskVariantSlug: TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
    },
    {
      ruleSlug: 'updateProductVariants',
      taskVariantSlug: TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
    },
    {
      ruleSlug: 'updateProductBrand',
      taskVariantSlug: TASK_VARIANT_SLUG_PRODUCT_BRANDS,
    },
    {
      ruleSlug: 'updateProductSeoContent',
      taskVariantSlug: TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
    },
    {
      ruleSlug: 'updateProduct',
      taskVariantSlug: TASK_VARIANT_SLUG_PRODUCT_DETAILS,
    },
  ];

  rulesConfigs.forEach(({ taskVariantSlug, ruleSlug }) => {
    const rule = rules.find(({ slug }) => ruleSlug === slug);
    if (rule?.allow || roleSlug === ROLE_SLUG_ADMIN) {
      taskVariantSlugs.push(taskVariantSlug);
    }
  });

  return taskVariantSlugs;
}
