import { Role, RoleModel } from '../../entities/Role';
import { NavItemModel } from '../../entities/NavItem';
import { RoleRuleModel, RoleRuleOperationModel } from '../../entities/RoleRule';
import { DocumentType } from '@typegoose/typegoose';
import { Translation } from '../../entities/Translation';
import {
  DEFAULT_LANG,
  OPERATION_TYPE_CREATE,
  OPERATION_TYPE_DELETE,
  OPERATION_TYPE_READ,
  OPERATION_TYPE_UPDATE,
  ROLE_EMPTY_CUSTOM_FILTER,
  SECONDARY_LANG,
  ROLE_SLUG_GUEST,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_COMPANY_OWNER,
  ROLE_SLUG_COMPANY_MANAGER,
} from '@yagu/shared';

export const ROUTE_APP = '/app';
export const ROUTE_APP_NAV_GROUP = 'app';
export const ROUTE_CMS = `${ROUTE_APP}/cms`;
export const QUERY_DATA_LAYOUT_FILTER = 'isFilterVisible';
export const QUERY_DATA_LAYOUT_FILTER_VALUE = '1';
export const QUERY_DATA_LAYOUT_FILTER_ENABLED = `?${QUERY_DATA_LAYOUT_FILTER}=${QUERY_DATA_LAYOUT_FILTER_VALUE}`;

export const appRoute = {
  slug: 'app',
  name: [
    {
      key: DEFAULT_LANG,
      value: 'Главная',
    },
    {
      key: SECONDARY_LANG,
      value: 'Main',
    },
  ],
  order: 0,
  icon: 'cart',
  path: ROUTE_APP,
  navGroup: ROUTE_APP_NAV_GROUP,
  children: [],
};

export const cmsRoute = {
  slug: 'cms',
  name: [
    {
      key: DEFAULT_LANG,
      value: 'CMS',
    },
    {
      key: SECONDARY_LANG,
      value: 'CMS',
    },
  ],
  order: 999,
  icon: 'gear',
  navGroup: ROUTE_APP_NAV_GROUP,
  path: '',
  children: [
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Заказы',
        },
        {
          key: SECONDARY_LANG,
          value: 'Orders',
        },
      ],
      slug: 'cms-orders',
      path: `${ROUTE_CMS}/orders${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Товары',
        },
        {
          key: SECONDARY_LANG,
          value: 'Products',
        },
      ],
      slug: 'cms-products',
      path: `${ROUTE_CMS}/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Рубрикатор',
        },
        {
          key: SECONDARY_LANG,
          value: 'Rubrics',
        },
      ],
      slug: 'cms-rubrics',
      path: `${ROUTE_CMS}/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Компании',
        },
        {
          key: SECONDARY_LANG,
          value: 'Companies',
        },
      ],
      slug: 'cms-companies',
      path: `${ROUTE_CMS}/companies${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Магазины',
        },
        {
          key: SECONDARY_LANG,
          value: 'Shops',
        },
      ],
      slug: 'cms-shops',
      path: `${ROUTE_CMS}/shops${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Типы рубрик',
        },
        {
          key: SECONDARY_LANG,
          value: 'Rubric variants',
        },
      ],
      slug: 'cms-rubric-variants',
      path: `${ROUTE_CMS}/rubric-variants`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Группы атрибутов',
        },
        {
          key: SECONDARY_LANG,
          value: 'Attributes groups',
        },
      ],
      slug: 'cms-attributes-groups',
      path: `${ROUTE_CMS}/attributes-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Группы опций',
        },
        {
          key: SECONDARY_LANG,
          value: 'Options groups',
        },
      ],
      slug: 'cms-options-groups',
      path: `${ROUTE_CMS}/options-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Языки сайта',
        },
        {
          key: SECONDARY_LANG,
          value: 'Site languages',
        },
      ],
      slug: 'cms-languages',
      path: `${ROUTE_CMS}/languages`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Настройки сайта',
        },
        {
          key: SECONDARY_LANG,
          value: 'Site settings',
        },
      ],
      slug: 'cms-config',
      path: `${ROUTE_CMS}/config`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
    {
      name: [
        {
          key: DEFAULT_LANG,
          value: 'Роли',
        },
        {
          key: SECONDARY_LANG,
          value: 'Roles',
        },
      ],
      slug: 'cms-roles',
      path: `${ROUTE_CMS}/roles${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
      icon: '',
      children: [],
      navGroup: ROUTE_APP_NAV_GROUP,
    },
  ],
};

export const INITIAL_APP_NAVIGATION = [appRoute, cmsRoute];

const ROLE_RULES_TEMPLATE = [
  {
    nameString: 'Атрибуты',
    entity: 'Attribute',
  },
  {
    nameString: 'Группы атрибутов',
    entity: 'AttributesGroup',
  },
  {
    nameString: 'Настройки сайта',
    entity: 'Config',
  },
  {
    nameString: 'Города',
    entity: 'City',
  },
  {
    nameString: 'Страны',
    entity: 'Country',
  },
  {
    nameString: 'Валюта',
    entity: 'Currency',
  },
  {
    nameString: 'Языки',
    entity: 'Language',
  },
  {
    nameString: 'Сообщения системы',
    entity: 'Message',
  },
  {
    nameString: 'Единицы измерения',
    entity: 'Metric',
  },
  {
    nameString: 'Опции',
    entity: 'Option',
  },
  {
    nameString: 'Группы опций',
    entity: 'OptionsGroup',
  },
  {
    nameString: 'Товары',
    entity: 'Product',
  },
  {
    nameString: 'Роли',
    entity: 'Role',
  },
  {
    nameString: 'Рубрики',
    entity: 'Rubric',
  },
  {
    nameString: 'Типы рубрик',
    entity: 'RubricVariant',
  },
  {
    nameString: 'Пользователи',
    entity: 'User',
  },
  {
    nameString: 'Компании',
    entity: 'Company',
  },
  {
    nameString: 'Магазин',
    entity: 'Shop',
  },
  {
    nameString: 'Товар магазина',
    entity: 'ShopProduct',
  },
  {
    nameString: 'Заказ',
    entity: 'Order',
  },
  {
    nameString: 'Бренд',
    entity: 'Brand',
  },
  {
    nameString: 'Линейка бренда',
    entity: 'BrandCollection',
  },
  {
    nameString: 'Производитель',
    entity: 'Manufacturer',
  },
];

const ROLE_RULE_OPERATIONS_TEMPLATE = [
  {
    operationType: OPERATION_TYPE_CREATE,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
    order: 0,
  },
  {
    operationType: OPERATION_TYPE_READ,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
    order: 1,
  },
  {
    operationType: OPERATION_TYPE_UPDATE,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
    order: 2,
  },
  {
    operationType: OPERATION_TYPE_DELETE,
    customFilter: ROLE_EMPTY_CUSTOM_FILTER,
    order: 3,
  },
];

export const ROLE_TEMPLATE_ADMIN = {
  name: [
    { key: DEFAULT_LANG, value: 'Админ' },
    { key: SECONDARY_LANG, value: 'Admin' },
  ],
  description: 'Администратор сайта',
  slug: ROLE_SLUG_ADMIN,
  isStuff: true,
};

export const ROLE_TEMPLATE_GUEST = {
  name: [
    { key: DEFAULT_LANG, value: 'Гость' },
    { key: SECONDARY_LANG, value: 'Guest' },
  ],
  description: 'Роль назначается новым или не авторизованным пользователям',
  slug: ROLE_SLUG_GUEST,
  isStuff: false,
};

export const ROLE_TEMPLATE_COMPANY_OWNER = {
  name: [
    { key: DEFAULT_LANG, value: 'Владелец компании' },
    { key: SECONDARY_LANG, value: 'Company owner' },
  ],
  description: 'Владелец компании',
  slug: ROLE_SLUG_COMPANY_OWNER,
  isStuff: false,
};

export const ROLE_TEMPLATE_COMPANY_MANAGER = {
  name: [
    { key: DEFAULT_LANG, value: 'Сотрудник компании' },
    { key: SECONDARY_LANG, value: 'Company manager' },
  ],
  description: 'Сотрудник компании',
  slug: ROLE_SLUG_COMPANY_MANAGER,
  isStuff: false,
};

interface NavItemInterface {
  name: { key: string; value: string }[];
  slug: string;
  path: string;
  icon?: string;
  children?: NavItemInterface[];
  navGroup: string;
  order?: number;
}

interface CreateInitialAppNavigationInterface {
  navItems: NavItemInterface[];
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
    navItems.map(async (navItem, topIndex) => {
      const { children, slug, icon, order, ...rest } = navItem;
      const existingNavItem = await NavItemModel.findOne({ slug });

      let parentNavItemId: string;
      if (!existingNavItem) {
        const createdNavItem = await NavItemModel.create({
          ...rest,
          order: order || topIndex,
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
  name: Translation[];
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
    role = await RoleModel.create({ ...template, allowedAppNavigation });
  }
  // check new rules
  await createRoleRules({ allow, roleId: role.id });

  return role;
}

export interface CreateInitialRolesPayloadInterface {
  adminRole: Role;
  guestRole: Role;
  companyOwnerRole: Role;
  companyManagerRole: Role;
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
    adminRole,
    guestRole,
    companyOwnerRole,
    companyManagerRole,
  };
}
