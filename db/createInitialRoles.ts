import { RoleBase, RoleModel, NavItemModel, ObjectIdModel } from 'db/dbModels';
import {
  DEFAULT_LOCALE,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_COMPANY_MANAGER,
  ROLE_SLUG_COMPANY_OWNER,
  ROLE_SLUG_GUEST,
  ROUTE_APP,
  ROUTE_APP_NAV_GROUP,
  ROUTE_CMS,
  ROUTE_CMS_NAV_GROUP,
  SECONDARY_LOCALE,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import { COL_NAV_ITEMS, COL_ROLES } from 'db/collectionNames';
import { Collection, ObjectId } from 'mongodb';

const appRouteId = new ObjectId();
const appRoute: NavItemModel = {
  _id: appRouteId,
  slug: 'app',
  nameI18n: {
    [DEFAULT_LOCALE]: `Главная`,
    [SECONDARY_LOCALE]: `Main`,
  },
  index: 0,
  icon: 'cart',
  path: ROUTE_APP,
  navGroup: ROUTE_APP_NAV_GROUP,
};

const cmsRoute: NavItemModel[] = [
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Заказы`,
      [SECONDARY_LOCALE]: `Orders`,
    },
    index: 0,
    slug: 'cms-orders',
    path: `${ROUTE_CMS}/orders`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Товары`,
      [SECONDARY_LOCALE]: `Products`,
    },
    index: 1,
    slug: 'cms-products',
    path: `${ROUTE_CMS}/products`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Рубрикатор`,
      [SECONDARY_LOCALE]: `Rubrics`,
    },
    index: 2,
    slug: 'cms-rubrics',
    path: `${ROUTE_CMS}/rubrics`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Компании`,
      [SECONDARY_LOCALE]: `Companies`,
    },
    index: 3,
    slug: 'cms-companies',
    path: `${ROUTE_CMS}/companies`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Магазины`,
      [SECONDARY_LOCALE]: `Shops`,
    },
    index: 4,
    slug: 'cms-shops',
    path: `${ROUTE_CMS}/shops`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Типы рубрик`,
      [SECONDARY_LOCALE]: `Rubric variants`,
    },
    index: 5,
    slug: 'cms-rubric-variants',
    path: `${ROUTE_CMS}/rubric-variants`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Группы атрибутов`,
      [SECONDARY_LOCALE]: `Attributes groups`,
    },
    index: 6,
    slug: 'cms-attributes-groups',
    path: `${ROUTE_CMS}/attributes-groups`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Группы опций`,
      [SECONDARY_LOCALE]: `Options groups`,
    },
    index: 7,
    slug: 'cms-options-groups',
    path: `${ROUTE_CMS}/options-groups`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Языки сайта`,
      [SECONDARY_LOCALE]: `Site languages`,
    },
    index: 8,
    slug: 'cms-languages',
    path: `${ROUTE_CMS}/languages`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Настройки сайта`,
      [SECONDARY_LOCALE]: `Site settings`,
    },
    index: 98,
    slug: 'cms-config',
    path: `${ROUTE_CMS}/config`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
  {
    _id: new ObjectId(),
    nameI18n: {
      [DEFAULT_LOCALE]: `Роли`,
      [SECONDARY_LOCALE]: `Roles`,
    },
    index: 99,
    slug: 'cms-roles',
    path: `${ROUTE_CMS}/roles`,
    navGroup: ROUTE_CMS_NAV_GROUP,
  },
];

export const INITIAL_APP_NAVIGATION = [appRoute, ...cmsRoute];

interface CreateInitialAppNavigationInterface {
  navItems: NavItemModel[];
  navItemsCollection: Collection<NavItemModel>;
}

export async function createInitialAppNavigation({
  navItems,
  navItemsCollection,
}: CreateInitialAppNavigationInterface): Promise<ObjectIdModel[]> {
  const payload: ObjectIdModel[] = [];
  for await (const navItem of navItems) {
    const { slug } = navItem;
    const existingNavItem = await navItemsCollection.findOne({ slug });

    if (!existingNavItem) {
      const createdNavItem = await navItemsCollection.insertOne(navItem);

      if (!createdNavItem.result.ok || !createdNavItem.ops[0]) {
        throw Error('Initial nav item creation error');
      }
      payload.push(createdNavItem.ops[0]._id);
    } else {
      payload.push(existingNavItem?._id);
    }
  }

  return payload;
}

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

export interface CreateInitialRolesPayloadInterface {
  adminRole: RoleModel;
  guestRole: RoleModel;
  companyOwnerRole: RoleModel;
  companyManagerRole: RoleModel;
}

export async function createInitialRoles(): Promise<CreateInitialRolesPayloadInterface> {
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

  // check new nav items
  await createInitialAppNavigation({
    navItemsCollection,
    navItems: INITIAL_APP_NAVIGATION,
  });

  return {
    adminRole,
    guestRole,
    companyOwnerRole,
    companyManagerRole,
  };
}
