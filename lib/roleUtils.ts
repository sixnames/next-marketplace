import { COL_ROLE_RULES } from 'db/collectionNames';
import { ObjectIdModel, RoleRuleBase } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RoleRuleInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';

export type RoleRuleSlugType =
  // Attributes
  | 'createAttributesGroup'
  | 'updateAttributesGroup'
  | 'deleteAttributesGroup'
  | 'createAttribute'
  | 'updateAttribute'
  | 'deleteAttribute'

  // Brand
  | 'createBrand'
  | 'updateBrand'
  | 'deleteBrand'

  // Brand collection
  | 'createBrandCollection'
  | 'updateBrandCollection'
  | 'deleteBrandCollection'

  // City
  | 'createCity'
  | 'updateCity'
  | 'deleteCity'

  // Company
  | 'createCompany'
  | 'updateCompany'
  | 'deleteCompany'
  | 'updateCompanyConfig'

  // Config
  | 'updateConfig'

  // Country
  | 'createCountry'
  | 'updateCountry'
  | 'deleteCountry'

  // Currency
  | 'createCurrency'
  | 'updateCurrency'
  | 'deleteCurrency'

  // Language
  | 'createLanguage'
  | 'updateLanguage'
  | 'deleteLanguage'

  // Manufacturer
  | 'createManufacturer'
  | 'updateManufacturer'
  | 'deleteManufacturer'

  // Message
  | 'createMessagesGroup'
  | 'updateMessagesGroup'
  | 'deleteMessagesGroup'
  | 'createMessage'
  | 'updateMessage'
  | 'deleteMessage'

  // Metric
  | 'createMetric'
  | 'updateMetric'
  | 'deleteMetric'

  // NavItem
  | 'createNavItem'
  | 'updateNavItem'
  | 'deleteNavItem'

  // Option
  | 'createOptionsGroup'
  | 'updateOptionsGroup'
  | 'deleteOptionsGroup'
  | 'createOption'
  | 'updateOption'
  | 'deleteOption'

  // Order
  | 'updateOrder'
  | 'deleteOrder'

  // Product
  | 'createProduct'
  | 'updateProduct'
  | 'updateProductAssets'
  | 'deleteProduct'

  // Role
  | 'createRole'
  | 'updateRole'
  | 'deleteRole'
  | 'updateRoleRule'

  // Rubric
  | 'createRubric'
  | 'updateRubric'
  | 'deleteRubric'

  // RubricVariant
  | 'createRubricVariant'
  | 'updateRubricVariant'
  | 'deleteRubricVariant'

  // Shop
  | 'createShop'
  | 'updateShop'
  | 'deleteShop'

  // ShopProduct
  | 'createShopProduct'
  | 'updateShopProduct'
  | 'deleteShopProduct'

  // User
  | 'createUser'
  | 'updateUser'
  | 'updateUserRole'
  | 'deleteUser';

interface RoleRuleBaseExtended extends Omit<RoleRuleBase, 'slug'> {
  slug: RoleRuleSlugType;
}

const baseRoleRules: RoleRuleBaseExtended[] = [
  // User
  {
    allow: false,
    slug: 'createUser',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание пользователя',
    },
  },
  {
    allow: false,
    slug: 'updateUser',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление пользователя',
    },
  },
  {
    allow: false,
    slug: 'deleteUser',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление пользователя',
    },
  },
  {
    allow: false,
    slug: 'updateUserRole',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление роли пользователя',
    },
  },

  // Product
  {
    allow: false,
    slug: 'createProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание товара',
    },
  },
  {
    allow: false,
    slug: 'updateProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление товара',
    },
  },
  {
    allow: false,
    slug: 'updateProductAssets',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление изображений товара',
    },
  },
  {
    allow: false,
    slug: 'deleteProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление товара',
    },
  },
];

interface GetRoleRulesAstInterface {
  roleId: ObjectIdModel;
  locale: string;
}

export async function getRoleRulesAst({
  roleId,
  locale,
}: GetRoleRulesAstInterface): Promise<RoleRuleInterface[]> {
  const db = await getDatabase();
  const roleRulesCollection = db.collection<RoleRuleInterface>(COL_ROLE_RULES);
  const initialRoleRules = await roleRulesCollection
    .find({
      roleId,
    })
    .toArray();

  const roleRulesAst = baseRoleRules.reduce((acc: RoleRuleInterface[], base) => {
    const existingRule = initialRoleRules.find(({ slug }) => base.slug === slug);
    if (!existingRule) {
      return [
        ...acc,
        {
          ...base,
          roleId,
          _id: new ObjectId(),
          name: getFieldStringLocale(base.nameI18n, locale),
          description: getFieldStringLocale(base.descriptionI18n, locale),
        },
      ];
    }
    return [
      ...acc,
      {
        ...base,
        roleId,
        _id: existingRule._id,
        name: getFieldStringLocale(base.nameI18n, locale),
        description: getFieldStringLocale(base.descriptionI18n, locale),
        allow: existingRule.allow,
      },
    ];
  }, []);

  return roleRulesAst;
}
