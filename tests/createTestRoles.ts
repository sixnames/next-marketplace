import { INITIAL_APP_NAVIGATION } from 'db/createInitialRoles';
import { NavItemModel, RoleBase, RoleModel } from 'db/dbModels';
import {
  DEFAULT_LOCALE,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_COMPANY_MANAGER,
  ROLE_SLUG_COMPANY_OWNER,
  ROLE_SLUG_GUEST,
  SECONDARY_LOCALE,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import { COL_NAV_ITEMS, COL_ROLES } from 'db/collectionNames';
import { Collection } from 'mongodb';

interface CreateRoleInterface {
  template: RoleBase;
  rolesCollection: Collection<RoleModel>;
}

export async function createRole({
  template,
  rolesCollection,
}: CreateRoleInterface): Promise<RoleModel> {
  let role = await rolesCollection.findOne({ slug: template.slug });
  if (!role) {
    const createdRole = await rolesCollection.insertOne({
      ...template,
      rules: [],
      allowedAppNavigation: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!createdRole.result.ok) {
      throw Error('Initial role creation error');
    }

    role = createdRole.ops[0];
  }

  return role;
}

export interface CreateTestRolesPayloadInterface {
  adminRole: RoleModel;
  guestRole: RoleModel;
  companyOwnerRole: RoleModel;
  companyManagerRole: RoleModel;
}

export async function createTestRoles(): Promise<CreateTestRolesPayloadInterface> {
  const db = await getDatabase();
  const rolesCollection = db.collection<RoleModel>(COL_ROLES);
  const navItemsCollection = db.collection<NavItemModel>(COL_NAV_ITEMS);

  // Guest role
  const guestRole = await createRole({
    rolesCollection,
    template: {
      nameI18n: {
        [DEFAULT_LOCALE]: 'Гость',
        [SECONDARY_LOCALE]: 'Guest',
      },
      description: 'Роль назначается новым или не авторизованным пользователям',
      slug: ROLE_SLUG_GUEST,
      isStuff: false,
    },
  });

  // Company owner role
  const companyOwnerRole = await createRole({
    rolesCollection,
    template: {
      nameI18n: {
        [DEFAULT_LOCALE]: 'Владелец компании',
        [SECONDARY_LOCALE]: 'Company owner',
      },
      description: 'Владелец компании',
      slug: ROLE_SLUG_COMPANY_OWNER,
      isStuff: false,
    },
  });

  // Company manager role
  const companyManagerRole = await createRole({
    rolesCollection,
    template: {
      nameI18n: {
        [DEFAULT_LOCALE]: 'Сотрудник компании',
        [SECONDARY_LOCALE]: 'Company manager',
      },
      description: 'Сотрудник компании',
      slug: ROLE_SLUG_COMPANY_MANAGER,
      isStuff: false,
    },
  });

  // Admin role
  const adminRole = await createRole({
    rolesCollection,
    template: {
      nameI18n: {
        [DEFAULT_LOCALE]: 'Админ',
        [SECONDARY_LOCALE]: 'Admin',
      },
      description: 'Администратор сайта',
      slug: ROLE_SLUG_ADMIN,
      isStuff: true,
    },
  });

  // Nav items
  await navItemsCollection.insertMany(INITIAL_APP_NAVIGATION);

  return {
    adminRole,
    guestRole,
    companyOwnerRole,
    companyManagerRole,
  };
}
