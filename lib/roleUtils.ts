import { ObjectId } from 'mongodb';
import { COL_ROLE_RULES } from '../db/collectionNames';
import { ObjectIdModel, RoleRuleBase } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { RoleRuleInterface } from '../db/uiInterfaces';
import { getFieldStringLocale } from './i18n';

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

  // Blog post
  | 'createBlogPost'
  | 'updateBlogPost'
  | 'deleteBlogPost'

  // Blog attribute
  | 'createBlogAttribute'
  | 'updateBlogAttribute'
  | 'deleteBlogAttribute'

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

  // Supplier
  | 'createSupplier'
  | 'updateSupplier'
  | 'deleteSupplier'

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

  // OrderStatus
  | 'createOrderStatus'
  | 'updateOrderStatus'
  | 'deleteOrderStatus'

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
  | 'deleteOrder'
  | 'updateOrder'
  | 'updateOrderProductDiscount'
  | 'confirmOrder'
  | 'cancelOrder'
  | 'createOrder'

  // Product
  | 'createPagesGroup'
  | 'updatePagesGroup'
  | 'deletePagesGroup'
  | 'createPage'
  | 'updatePage'
  | 'deletePage'

  // Product
  | 'createProduct'
  | 'updateProduct'
  | 'deleteProduct'

  // Role
  | 'createRole'
  | 'updateRole'
  | 'deleteRole'

  // Rubric
  | 'createRubric'
  | 'updateRubric'
  | 'deleteRubric'

  // Category
  | 'createCategory'
  | 'updateCategory'
  | 'deleteCategory'

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

  // Promo
  | 'createPromo'
  | 'updatePromo'
  | 'deletePromo'

  // Promo code
  | 'createPromoCode'
  | 'updatePromoCode'
  | 'deletePromoCode'

  // Gift certificate
  | 'createGiftCertificate'
  | 'updateGiftCertificate'
  | 'deleteGiftCertificate'

  // Promo product
  | 'addPromoProduct'
  | 'deletePromoProduct'

  // Task variants
  | 'createTaskVariant'
  | 'updateTaskVariant'
  | 'deleteTaskVariant'

  // User
  | 'createUser'
  | 'updateUser'
  | 'updateUserPassword'
  | 'deleteUser'

  // UserCategory
  | 'createUserCategory'
  | 'updateUserCategory'
  | 'setUserCategory'
  | 'deleteUserCategory';

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

  // Blog post
  {
    allow: false,
    slug: 'createBlogPost',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание блог-поста',
    },
  },
  {
    allow: false,
    slug: 'updateBlogPost',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление блог-поста',
    },
  },
  {
    allow: false,
    slug: 'deleteBlogPost',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление блог-поста',
    },
  },

  // Blog attribute
  {
    allow: false,
    slug: 'createBlogAttribute',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание аттрибута блога',
    },
  },
  {
    allow: false,
    slug: 'updateBlogAttribute',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление аттрибута блога',
    },
  },
  {
    allow: false,
    slug: 'deleteBlogAttribute',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление аттрибута блога',
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

  // Supplier
  {
    allow: false,
    slug: 'createSupplier',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание поставщика',
    },
  },
  {
    allow: false,
    slug: 'updateSupplier',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление поставщика',
    },
  },
  {
    allow: false,
    slug: 'deleteSupplier',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление поставщика',
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

  // OrderStatus
  {
    allow: false,
    slug: 'createOrderStatus',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание статуса заказа',
    },
  },
  {
    allow: false,
    slug: 'updateOrderStatus',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление статуса заказа',
    },
  },
  {
    allow: false,
    slug: 'deleteOrderStatus',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление статуса заказа',
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
    slug: 'updateOrder',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление заказа',
    },
  },
  {
    allow: false,
    slug: 'updateOrderProductDiscount',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Изменение дополнительной скидки товара заказа',
    },
  },
  {
    allow: false,
    slug: 'confirmOrder',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Подтверждение заказа',
    },
  },
  {
    allow: false,
    slug: 'cancelOrder',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Отмена заказа',
    },
  },
  {
    allow: false,
    slug: 'createOrder',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание заказа',
    },
  },
  {
    allow: false,
    slug: 'deleteOrder',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление заказа',
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

  // Page
  {
    allow: false,
    slug: 'createPagesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание группы страниц',
    },
  },
  {
    allow: false,
    slug: 'updatePagesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление группы страниц',
    },
  },
  {
    allow: false,
    slug: 'deletePagesGroup',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление группы страниц',
    },
  },
  {
    allow: false,
    slug: 'createPage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание страницы',
    },
  },
  {
    allow: false,
    slug: 'updatePage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление страницы',
    },
  },
  {
    allow: false,
    slug: 'deletePage',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление страницы',
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
      ru: 'Обновление рубрики',
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

  // Category
  {
    allow: false,
    slug: 'createCategory',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание категории',
    },
  },
  {
    allow: false,
    slug: 'updateCategory',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление категории',
    },
  },
  {
    allow: false,
    slug: 'deleteCategory',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление категории',
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

  // Promo
  {
    allow: false,
    slug: 'createPromo',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание акции',
    },
  },
  {
    allow: false,
    slug: 'updatePromo',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление акции',
    },
  },
  {
    allow: false,
    slug: 'deletePromo',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление акции',
    },
  },

  // Promo code
  {
    allow: false,
    slug: 'createPromoCode',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание поромо-кода',
    },
  },
  {
    allow: false,
    slug: 'updatePromoCode',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление поромо-кода',
    },
  },
  {
    allow: false,
    slug: 'deletePromoCode',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление поромо-кода',
    },
  },

  // Promo product
  {
    allow: false,
    slug: 'addPromoProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Добавление товара к акции',
    },
  },
  {
    allow: false,
    slug: 'deletePromoProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление товара из акции',
    },
  },

  // Gift certificate
  {
    allow: false,
    slug: 'createGiftCertificate',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание подарочного сертификата',
    },
  },
  {
    allow: false,
    slug: 'updateGiftCertificate',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление подарочного сертификата',
    },
  },
  {
    allow: false,
    slug: 'deleteGiftCertificate',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление подарочного сертификата',
    },
  },

  // Task variants
  {
    allow: false,
    slug: 'createTaskVariant',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание типа задачи',
    },
  },
  {
    allow: false,
    slug: 'updateTaskVariant',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление типа задачи',
    },
  },
  {
    allow: false,
    slug: 'deleteTaskVariant',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление типа задачи',
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

  // UserCategory
  {
    allow: false,
    slug: 'createUserCategory',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание категории пользователя',
    },
  },
  {
    allow: false,
    slug: 'updateUserCategory',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Обновление категории пользователя',
    },
  },
  {
    allow: false,
    slug: 'deleteUserCategory',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Удаление категории пользователя',
    },
  },
  {
    allow: false,
    slug: 'setUserCategory',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Назначение категории пользователя',
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
  const { db } = await getDatabase();
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
