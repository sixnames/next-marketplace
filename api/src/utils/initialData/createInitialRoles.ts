import { RoleModel } from '../../entities/Role';
import {
  INITIAL_APP_NAVIGATION,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_GUEST,
  ROLE_TEMPLATE_ADMIN,
  ROLE_TEMPLATE_GUEST,
} from '../../config';
import { NavItemModel } from '../../entities/NavItem';
import { Types } from 'mongoose';

// export async function createInitialAppNavigationChildren(parentId: string): Promise<string[]> {}
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
        });
        parentNavItemId = createdNavItem.id;
      } else {
        parentNavItemId = existingNavItem.id;
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

export async function createInitialRoles(): Promise<string> {
  // Guest role
  const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
  if (!guestRole) {
    await RoleModel.create({ ...ROLE_TEMPLATE_GUEST, allowedNavigation: [] });
  }

  // Admin role
  const adminNavItems = await createInitialAppNavigation({
    navItems: INITIAL_APP_NAVIGATION,
  });
  const allowedNavigation = getIdsFromTree(adminNavItems);

  const adminRole = await RoleModel.findOne({ slug: ROLE_SLUG_ADMIN });
  let adminRoleId;
  if (!adminRole) {
    const createdAdminRole = await RoleModel.create({
      ...ROLE_TEMPLATE_ADMIN,
      allowedNavigation,
    });
    adminRoleId = createdAdminRole.id;
  } else {
    if (adminRole.allowedNavigation.length < allowedNavigation.length) {
      await RoleModel.findOneAndUpdate(
        { slug: ROLE_SLUG_ADMIN },
        {
          allowedNavigation,
        },
      );
    }
    adminRoleId = adminRole.id;
  }

  return adminRoleId;
}
