import { Role, RoleModel } from '../../entities/Role';
import {
  INITIAL_APP_NAVIGATION,
  ROLE_TEMPLATE_ADMIN,
  ROLE_TEMPLATE_GUEST,
  ROLE_RULES_TEMPLATE,
  ROLE_RULE_OPERATIONS_TEMPLATE,
  ROLE_TEMPLATE_COMPANY_OWNER,
  ROLE_TEMPLATE_COMPANY_MANAGER,
} from '@yagu/config';
import { NavItemModel } from '../../entities/NavItem';
import { RoleRuleModel, RoleRuleOperationModel } from '../../entities/RoleRule';
import { LanguageType } from '../../entities/common';
import { DocumentType } from '@typegoose/typegoose';

interface CreateInitialAppNavigationInterface {
  navItems: typeof INITIAL_APP_NAVIGATION;
  parentId?: string;
}
interface CreateInitialAppNavigationPayloadInterface {
  id: string;
  children: CreateInitialAppNavigationPayloadInterface[];
}

export async function createInitialAppNavigation({
  navItems,
  parentId,
}: CreateInitialAppNavigationInterface): Promise<CreateInitialAppNavigationPayloadInterface[]> {
  return Promise.all(
    navItems.map(async (navItem) => {
      const { children, slug, icon, ...rest } = navItem;
      const existingNavItem = await NavItemModel.findOne({ slug });

      let parentNavItemId: string;
      if (!existingNavItem) {
        const createdNavItem = await NavItemModel.create({
          ...rest,
          slug,
          parent: parentId ? parentId : null,
          icon: icon ? icon : null,
          children: [],
        });

        parentNavItemId = createdNavItem.id;
        if (parentId) {
          await NavItemModel.findByIdAndUpdate(parentId, {
            $addToSet: {
              children: createdNavItem.id,
            },
          });
        }
      } else {
        parentNavItemId = existingNavItem.id;
        if (parentId) {
          await NavItemModel.findByIdAndUpdate(parentId, {
            $addToSet: {
              children: existingNavItem.id,
            },
          });
        }
      }

      let currentChildren: CreateInitialAppNavigationPayloadInterface[] = [];
      if (children && children.length) {
        currentChildren = await createInitialAppNavigation({
          navItems: children,
          parentId: parentNavItemId,
        });
      }

      return {
        id: parentNavItemId,
        children: currentChildren,
      };
    }),
  );
}

function getIdsFromTree(tree: CreateInitialAppNavigationPayloadInterface[]) {
  const reducer = (
    item: CreateInitialAppNavigationPayloadInterface,
    reducerAcc: string[],
  ): string[] => {
    const { id, children } = item;
    if (children && children.length) {
      return [...children, { ...item, children: [] }].reduce(
        (acc: string[], item) => [...acc, ...reducer(item, [])],
        reducerAcc,
      );
    }
    return [...reducerAcc, id];
  };

  return tree.reduce((acc: string[], item) => {
    return [...acc, ...reducer(item, [])];
  }, []);
}

interface CreateRoleRulesInterface {
  allow: boolean;
  roleId: string;
}

export async function createRoleRules({ allow, roleId }: CreateRoleRulesInterface) {
  for await (const rule of ROLE_RULES_TEMPLATE) {
    const existingRule = await RoleRuleModel.findOne({ entity: rule.entity, roleId });
    if (!existingRule) {
      const operationsTemplate = ROLE_RULE_OPERATIONS_TEMPLATE.map((operation) => ({
        ...operation,
        allow,
      }));
      const operations = await RoleRuleOperationModel.insertMany(operationsTemplate);
      const operationsIds = operations.map(({ id }) => id);
      await RoleRuleModel.create({
        ...rule,
        roleId,
        operations: operationsIds,
        restrictedFields: [],
      });
    }
  }
}

interface RoleTemplateInterface {
  name: LanguageType[];
  description: string;
  slug: string;
  isStuff: boolean;
}

interface CreateRoleInterface {
  template: RoleTemplateInterface;
  allowedAppNavigation: string[];
  allow?: boolean;
}

export async function createRole({
  template,
  allowedAppNavigation,
  allow = false,
}: CreateRoleInterface): Promise<DocumentType<Role>> {
  let role = await RoleModel.findOne({ slug: template.slug });
  if (!role) {
    role = await RoleModel.create({ ...ROLE_TEMPLATE_GUEST, allowedAppNavigation });
  }
  // check new rules
  await createRoleRules({ allow, roleId: role.id });

  return role;
}

export interface CreateInitialRolesPayloadInterface {
  adminRoleId: string;
  guestRoleId: string;
  companyOwnerRoleId: string;
  companyManagerRoleId: string;
}

export async function createInitialRoles(): Promise<CreateInitialRolesPayloadInterface> {
  // Guest role
  const guestRole = await createRole({
    template: ROLE_TEMPLATE_GUEST,
    allowedAppNavigation: [],
  });

  // Company owner role
  const companyOwnerRole = await createRole({
    template: ROLE_TEMPLATE_COMPANY_OWNER,
    allowedAppNavigation: [],
  });

  // Company owner manager
  const companyManagerRole = await createRole({
    template: ROLE_TEMPLATE_COMPANY_MANAGER,
    allowedAppNavigation: [],
  });

  // Admin role
  const adminNavItems = await createInitialAppNavigation({
    navItems: INITIAL_APP_NAVIGATION,
  });
  const allowedAppNavigation = getIdsFromTree(adminNavItems);

  const adminRole = await createRole({
    template: ROLE_TEMPLATE_ADMIN,
    allowedAppNavigation,
    allow: true,
  });

  // check new nav items
  if (adminRole.allowedAppNavigation.length !== allowedAppNavigation.length) {
    await RoleModel.findOneAndUpdate(
      { slug: ROLE_TEMPLATE_ADMIN.slug },
      {
        allowedAppNavigation,
      },
    );
  }

  // check new rules
  await createRoleRules({ allow: true, roleId: adminRole.id });

  return {
    adminRoleId: adminRole.id,
    guestRoleId: guestRole.id,
    companyOwnerRoleId: companyOwnerRole.id,
    companyManagerRoleId: companyManagerRole.id,
  };
}
