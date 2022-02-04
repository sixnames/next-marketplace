import { ROLE_SLUG_ADMIN } from 'config/common';
import { getTaskVariantSlugByRule } from 'config/constantSelects';
import { ObjectIdModel } from 'db/dbModels';
import { getRoleRules, RoleRuleSlugType } from 'lib/roleRuleUtils';

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
