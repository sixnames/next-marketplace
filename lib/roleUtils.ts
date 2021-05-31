import { COL_ROLE_RULES } from 'db/collectionNames';
import { ObjectIdModel, RoleRuleBase } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RoleRuleInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';

export type RoleRuleSlugType =
  // Attributes
  | 'createAttributesGroup' // done
  | 'updateAttributesGroup' // done
  | 'deleteAttributesGroup' // done
  | 'createAttribute' // done
  | 'updateAttribute' // done
  | 'deleteAttribute' // done

  // Brand
  | 'createBrand' // done
  | 'updateBrand' // done
  | 'deleteBrand' // done

  // Brand collection
  | 'createBrandCollection' // done
  | 'updateBrandCollection' // done
  | 'deleteBrandCollection' // done

  // City
  | 'createCity' // done
  | 'updateCity' // done
  | 'deleteCity' // done

  // Company
  | 'createCompany' // done
  | 'updateCompany' // done
  | 'deleteCompany' // done
  | 'updateCompanyConfig' // done

  // Config
  | 'updateConfig' // done

  // Country
  | 'createCountry' // done
  | 'updateCountry' // done
  | 'deleteCountry' // done

  // Currency
  | 'createCurrency' // done
  | 'updateCurrency' // done
  | 'deleteCurrency' // done

  // Language
  | 'createLanguage' // done
  | 'updateLanguage' // done
  | 'deleteLanguage' // done

  // Manufacturer
  | 'createManufacturer' // done
  | 'updateManufacturer' // done
  | 'deleteManufacturer' // done

  // Message
  | 'createMessagesGroup'
  | 'updateMessagesGroup'
  | 'deleteMessagesGroup'
  | 'createMessage'
  | 'updateMessage'
  | 'deleteMessage'

  // Metric
  | 'createMetric' // done
  | 'updateMetric' // done
  | 'deleteMetric' // done

  // NavItem
  | 'createNavItem' // done
  | 'updateNavItem' // done
  | 'deleteNavItem' // done

  // Option
  | 'createOptionsGroup' // done
  | 'updateOptionsGroup' // done
  | 'deleteOptionsGroup' // done
  | 'createOption' // done
  | 'updateOption' // done
  | 'deleteOption' // done

  // Order
  | 'deleteOrder'

  // Product
  | 'createProduct' // done
  | 'updateProduct' // done
  | 'deleteProduct' // done

  // Role
  | 'createRole' // done
  | 'updateRole' // done
  | 'deleteRole' // done

  // Rubric
  | 'createRubric' // done
  | 'updateRubric' // done
  | 'deleteRubric' // done

  // RubricVariant
  | 'createRubricVariant' // done
  | 'updateRubricVariant' // done
  | 'deleteRubricVariant' // done

  // Shop
  | 'createShop' // done
  | 'updateShop' // done
  | 'deleteShop' // done

  // ShopProduct
  | 'createShopProduct' // done
  | 'updateShopProduct' // done
  | 'deleteShopProduct' // done

  // User
  | 'createUser' // done
  | 'updateUser' // done
  | 'updateUserPassword' // done
  | 'deleteUser'; // done

interface RoleRuleBaseExtended extends Omit<RoleRuleBase, 'slug'> {
  slug: RoleRuleSlugType;
}

const baseRoleRules: RoleRuleBaseExtended[] = [
  // Attributes
  {
    allow: false,
    slug: 'createAttributesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание группы атрибутов',
    },
  },
  {
    allow: false,
    slug: 'updateAttributesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление группы атрибутов',
    },
  },
  {
    allow: false,
    slug: 'deleteAttributesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление группы атрибутов',
    },
  },
  {
    allow: false,
    slug: 'createAttribute',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание атрибута',
    },
  },
  {
    allow: false,
    slug: 'updateAttribute',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление атрибута',
    },
  },
  {
    allow: false,
    slug: 'deleteAttribute',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление атрибута',
    },
  },

  // Brand
  {
    allow: false,
    slug: 'createBrand',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание бренда',
    },
  },
  {
    allow: false,
    slug: 'updateBrand',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление бренда',
    },
  },
  {
    allow: false,
    slug: 'deleteBrand',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление бренда',
    },
  },

  // Brand collection
  {
    allow: false,
    slug: 'createBrandCollection',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание линейки бренда',
    },
  },
  {
    allow: false,
    slug: 'updateBrandCollection',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление линейки бренда',
    },
  },
  {
    allow: false,
    slug: 'deleteBrandCollection',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление линейки бренда',
    },
  },

  // City
  {
    allow: false,
    slug: 'createCity',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание города',
    },
  },
  {
    allow: false,
    slug: 'updateCity',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление города',
    },
  },
  {
    allow: false,
    slug: 'deleteCity',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление города',
    },
  },

  // Company
  {
    allow: false,
    slug: 'createCompany',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание компании',
    },
  },
  {
    allow: false,
    slug: 'updateCompany',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление компании',
    },
  },
  {
    allow: false,
    slug: 'deleteCompany',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление компании',
    },
  },
  {
    allow: false,
    slug: 'updateCompanyConfig',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление настроек компании',
    },
  },

  // Config
  {
    allow: false,
    slug: 'updateConfig',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление настроек сайта',
    },
  },

  // Country
  {
    allow: false,
    slug: 'createCountry',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание страны',
    },
  },
  {
    allow: false,
    slug: 'updateCountry',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление страны',
    },
  },
  {
    allow: false,
    slug: 'deleteCountry',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление страны',
    },
  },

  // Currency
  {
    allow: false,
    slug: 'createCurrency',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание валюты',
    },
  },
  {
    allow: false,
    slug: 'updateCurrency',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление валюты',
    },
  },
  {
    allow: false,
    slug: 'deleteCurrency',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление валюты',
    },
  },

  // Language
  {
    allow: false,
    slug: 'createLanguage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание языка',
    },
  },
  {
    allow: false,
    slug: 'updateLanguage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление языка',
    },
  },
  {
    allow: false,
    slug: 'deleteLanguage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление языка',
    },
  },

  // Manufacturer
  {
    allow: false,
    slug: 'createManufacturer',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание производителя',
    },
  },
  {
    allow: false,
    slug: 'updateManufacturer',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление производителя',
    },
  },
  {
    allow: false,
    slug: 'deleteManufacturer',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление производителя',
    },
  },

  // Message
  {
    allow: false,
    slug: 'createMessagesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание группы сообщений',
    },
  },
  {
    allow: false,
    slug: 'updateMessagesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление группы сообщений',
    },
  },
  {
    allow: false,
    slug: 'deleteMessagesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление группы сообщений',
    },
  },
  {
    allow: false,
    slug: 'createMessage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание API сообщения',
    },
  },
  {
    allow: false,
    slug: 'updateMessage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление API сообщения',
    },
  },
  {
    allow: false,
    slug: 'deleteMessage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление API сообщения',
    },
  },

  // Metric
  {
    allow: false,
    slug: 'createMetric',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание еденицы измерения',
    },
  },
  {
    allow: false,
    slug: 'updateMetric',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление еденицы измерения',
    },
  },
  {
    allow: false,
    slug: 'deleteMetric',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление еденицы измерения',
    },
  },

  // NavItem
  {
    allow: false,
    slug: 'createNavItem',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание навигации в кабинете',
    },
  },
  {
    allow: false,
    slug: 'updateNavItem',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление навигации в кабинете',
    },
  },
  {
    allow: false,
    slug: 'deleteNavItem',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление навигации в кабинете',
    },
  },

  // Option
  {
    allow: false,
    slug: 'createOptionsGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание группы опций',
    },
  },
  {
    allow: false,
    slug: 'updateOptionsGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление группы опций',
    },
  },
  {
    allow: false,
    slug: 'deleteOptionsGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление группы опций',
    },
  },
  {
    allow: false,
    slug: 'createOption',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание опции',
    },
  },
  {
    allow: false,
    slug: 'updateOption',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление опции',
    },
  },
  {
    allow: false,
    slug: 'deleteOption',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление опции',
    },
  },

  // Order
  {
    allow: false,
    slug: 'deleteOrder',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление каказа',
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
    slug: 'deleteProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление товара',
    },
  },

  // Role
  {
    allow: false,
    slug: 'createRole',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание роли',
    },
  },
  {
    allow: false,
    slug: 'updateRole',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление роли',
    },
  },
  {
    allow: false,
    slug: 'deleteRole',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление роли',
    },
  },

  // Rubric
  {
    allow: false,
    slug: 'createRubric',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание рубрики',
    },
  },
  {
    allow: false,
    slug: 'updateRubric',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновлениеубрикили',
    },
  },
  {
    allow: false,
    slug: 'deleteRubric',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление рубрики',
    },
  },

  // RubricVariant
  {
    allow: false,
    slug: 'createRubricVariant',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание типа рубрики',
    },
  },
  {
    allow: false,
    slug: 'updateRubricVariant',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление типа рубрикили',
    },
  },
  {
    allow: false,
    slug: 'deleteRubricVariant',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление типа рубрики',
    },
  },

  // Shop
  {
    allow: false,
    slug: 'createShop',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание магазина',
    },
  },
  {
    allow: false,
    slug: 'updateShop',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление магазина',
    },
  },
  {
    allow: false,
    slug: 'deleteShop',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление магазина',
    },
  },

  // ShopProduct
  {
    allow: false,
    slug: 'createShopProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание товара магазина',
    },
  },
  {
    allow: false,
    slug: 'updateShopProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление товара магазина',
    },
  },
  {
    allow: false,
    slug: 'deleteShopProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление товара магазина',
    },
  },

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
    slug: 'updateUserPassword',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление пароля пользователя',
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
