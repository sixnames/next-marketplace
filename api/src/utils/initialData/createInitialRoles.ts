import { RoleModel } from '../../entities/Role';
import {
  INITIAL_APP_NAVIGATION,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_GUEST,
  ROLE_TEMPLATE_ADMIN,
  ROLE_TEMPLATE_GUEST,
  ROLE_RULES_TEMPLATE,
  ROLE_RULE_OPERATIONS_TEMPLATE,
} from '../../config';
import { NavItemModel } from '../../entities/NavItem';
import { Types } from 'mongoose';
import { RoleRuleModel, RoleRuleOperationModel } from '../../entities/RoleRule';

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
          parent: parentId ? Types.ObjectId(parentId) : null,
          icon: icon ? icon : null,
          children: [],
        });

        parentNavItemId = createdNavItem.id;
        if (parentId) {
          await NavItemModel.findByIdAndUpdate(parentId, {
            $addToSet: {
              children: Types.ObjectId(createdNavItem.id),
            },
          });
        }
      } else {
        parentNavItemId = existingNavItem.id;
        if (parentId) {
          await NavItemModel.findByIdAndUpdate(parentId, {
            $addToSet: {
              children: Types.ObjectId(existingNavItem.id),
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
      return children.reduce((acc: string[], item) => [...acc, ...reducer(item, [])], reducerAcc);
    }
    return [...reducerAcc, id];
  };

  return tree.reduce((acc: string[], item) => {
    return [...acc, ...reducer(item, []), item.id];
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

export async function createInitialRoles(): Promise<string> {
  // Guest role
  let guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
  if (!guestRole) {
    guestRole = await RoleModel.create({ ...ROLE_TEMPLATE_GUEST, allowedAppNavigation: [] });
  }
  // check new rules
  await createRoleRules({ allow: false, roleId: guestRole.id });

  // Admin role
  const adminNavItems = await createInitialAppNavigation({
    navItems: INITIAL_APP_NAVIGATION,
  });
  const allowedAppNavigation = getIdsFromTree(adminNavItems);

  let adminRole = await RoleModel.findOne({ slug: ROLE_SLUG_ADMIN });
  if (!adminRole) {
    adminRole = await RoleModel.create({
      ...ROLE_TEMPLATE_ADMIN,
      allowedAppNavigation,
    });
  }

  // check new nav items
  if (adminRole.allowedAppNavigation.length < allowedAppNavigation.length) {
    await RoleModel.findOneAndUpdate(
      { slug: ROLE_SLUG_ADMIN },
      {
        allowedAppNavigation,
      },
    );
  }

  // check new rules
  await createRoleRules({ allow: true, roleId: adminRole.id });

  return adminRole.id;
}
