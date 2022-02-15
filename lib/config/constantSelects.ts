import { RoleRuleSlugType } from 'lib/roleRuleUtils';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VARIANTS_ENUMS,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  DEFAULT_LOCALE,
  GENDER_ENUMS,
  OPTIONS_GROUP_VARIANT_ENUMS,
  ORDER_DELIVERY_VARIANT_COURIER,
  ORDER_DELIVERY_VARIANT_PICKUP,
  ORDER_PAYMENT_VARIANT_RECEIPT,
  SECONDARY_LOCALE,
  SUPPLIER_PRICE_VARIANT_CHARGE,
  SUPPLIER_PRICE_VARIANT_DISCOUNT,
  TASK_STATE_DONE,
  TASK_STATE_IN_PROGRESS,
  TASK_STATE_INSPECTION,
  TASK_STATE_MODERATION,
  TASK_STATE_PENDING,
} from 'lib/config/common';
import { TranslationModel } from 'db/dbModels';
import { getFieldStringLocale } from 'lib/i18n';
import { iconTypesList } from 'types/iconTypes';
import { getConstantTranslation } from 'lib/config/constantTranslations';

export const DEFAULT_LAYOUT = 'default';

export interface ConstantOptionInterface {
  _id: string;
  nameI18n: TranslationModel;
  name?: string | null;
}

export type ConstantOptionsType = ConstantOptionInterface[];

export interface LayoutOptionInterface {
  _id: string;
  asset: string;
}

export type LayoutOptionsType = LayoutOptionInterface[];

// card layout
export const CARD_LAYOUT_HALF_COLUMNS = 'half-columns';
export const CARD_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/card/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: CARD_LAYOUT_HALF_COLUMNS,
    asset: `/layout/card/${CARD_LAYOUT_HALF_COLUMNS}.png`,
  },
];

// nav dropdown layout
export const NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY = 'options-only';
export const NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES = 'with-categories';
export const NAV_DROPDOWN_LAYOUT_WITHOUT_SUBCATEGORIES = 'without-subcategories';
export const NAV_DROPDOWN_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/nav-dropdown/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY,
    asset: `/layout/nav-dropdown/${NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY}.png`,
  },
  {
    _id: NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES,
    asset: `/layout/nav-dropdown/${NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES}.png`,
  },
  {
    _id: NAV_DROPDOWN_LAYOUT_WITHOUT_SUBCATEGORIES,
    asset: `/layout/nav-dropdown/${NAV_DROPDOWN_LAYOUT_WITHOUT_SUBCATEGORIES}.png`,
  },
];

// row snippet layout
export const ROW_SNIPPET_LAYOUT_BIG_IMAGE = 'big-image';
export const ROW_SNIPPET_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/row-snippet/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: ROW_SNIPPET_LAYOUT_BIG_IMAGE,
    asset: `/layout/row-snippet/${ROW_SNIPPET_LAYOUT_BIG_IMAGE}.png`,
  },
];

// grid snippet layout
export const GRID_SNIPPET_LAYOUT_BIG_IMAGE = 'big-image';
export const GRID_SNIPPET_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/grid-snippet/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: GRID_SNIPPET_LAYOUT_BIG_IMAGE,
    asset: `/layout/grid-snippet/${GRID_SNIPPET_LAYOUT_BIG_IMAGE}.png`,
  },
];

// catalogue filter layout
export const CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE = 'checkbox-tree';
export const CATALOGUE_FILTER_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/catalogue-filter/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE,
    asset: `/layout/catalogue-filter/${CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE}.png`,
  },
];

// catalogue head layout
export const CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES = 'with-categories';
export const CATALOGUE_HEAD_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/catalogue-head/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES,
    asset: `/layout/catalogue-head/${CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES}.png`,
  },
];

export function getConstantOptions(options: ConstantOptionsType, locale: string) {
  return options.map((option) => {
    return {
      ...option,
      name: getFieldStringLocale(option.nameI18n, locale),
    };
  });
}

interface GetConstantOptionNameInterface {
  options: ConstantOptionsType;
  locale: string;
  value: string;
}

export function getConstantOptionName({
  locale,
  options,
  value,
}: GetConstantOptionNameInterface): string {
  const option = options.find(({ _id }) => _id === value);
  if (!option) {
    return 'option not found';
  }
  let name = getFieldStringLocale(option.nameI18n, locale);
  if (!name) {
    name = getFieldStringLocale(option.nameI18n, DEFAULT_LOCALE);
  }
  if (!name) {
    return 'option translation not found';
  }

  return name;
}

// supplier price variant
export const SUPPLIER_PRICE_VARIANT_OPTIONS: ConstantOptionsType = [
  {
    _id: SUPPLIER_PRICE_VARIANT_DISCOUNT,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Дилерская скидка',
      [SECONDARY_LOCALE]: 'Dealer discount',
    },
  },
  {
    _id: SUPPLIER_PRICE_VARIANT_CHARGE,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Дилерская наценка',
      [SECONDARY_LOCALE]: 'Dealer charge',
    },
  },
];

// delivery variant
export const DELIVERY_VARIANT_OPTIONS: ConstantOptionsType = [
  {
    _id: ORDER_DELIVERY_VARIANT_PICKUP,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Самовывоз из магазина',
      [SECONDARY_LOCALE]: 'Pickup from the store',
    },
  },
  {
    _id: ORDER_DELIVERY_VARIANT_COURIER,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Доставка курьером',
      [SECONDARY_LOCALE]: 'By courier',
    },
  },
];

// payment variant
export const PAYMENT_VARIANT_OPTIONS: ConstantOptionsType = [
  {
    _id: ORDER_PAYMENT_VARIANT_RECEIPT,
    nameI18n: {
      [DEFAULT_LOCALE]: 'При получении',
      [SECONDARY_LOCALE]: 'Upon receipt',
    },
  },
];

// gender
export const getGenderOptions = (locale: string): ConstantOptionsType => {
  return GENDER_ENUMS.map((gender) => {
    const option: ConstantOptionInterface = {
      _id: gender,
      nameI18n: {},
      name: getConstantTranslation(`selectsOptions.gender.${gender}.${locale}`),
    };
    return option;
  });
};

// attribute variant
export const getAttributeVariantsOptions = (locale: string): ConstantOptionsType => {
  return ATTRIBUTE_VARIANTS_ENUMS.map((variant) => {
    const option: ConstantOptionInterface = {
      _id: variant,
      nameI18n: {},
      name: getConstantTranslation(`selectsOptions.attributeVariants.${variant}.${locale}`),
    };
    return option;
  });
};

// attribute view variant
export const getAttributeViewVariantsOptions = (locale: string): ConstantOptionsType => {
  return ATTRIBUTE_VIEW_VARIANTS_ENUMS.map((variant) => {
    const option: ConstantOptionInterface = {
      _id: variant,
      nameI18n: {},
      name: getConstantTranslation(`selectsOptions.attributeView.${variant}.${locale}`),
    };
    return option;
  });
};

// attribute positioning
export const getAttributePositioningOptions = (locale: string): ConstantOptionsType => {
  return ATTRIBUTE_POSITION_IN_TITLE_ENUMS.map((position) => {
    const option: ConstantOptionInterface = {
      _id: position,
      nameI18n: {},
      name: getConstantTranslation(`selectsOptions.attributePositioning.${position}.${locale}`),
    };
    return option;
  });
};

// options group variant
export const getOptionsGroupVariantsOptions = (locale: string): ConstantOptionsType => {
  return OPTIONS_GROUP_VARIANT_ENUMS.map((variant) => {
    const option: ConstantOptionInterface = {
      _id: variant,
      nameI18n: {},
      name: getConstantTranslation(`selectsOptions.optionsGroupVariant.${variant}.${locale}`),
    };
    return option;
  });
};

// icons
export const getIconOptions = (): ConstantOptionsType => {
  return iconTypesList
    .map((icon) => ({
      _id: icon,
      nameI18n: {},
      name: icon,
      icon: icon,
    }))
    .sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
};

// languages
export const ISO_LANGUAGES = [
  {
    _id: DEFAULT_LOCALE,
    name: 'Russian',
    slug: 'ru',
    nativeName: 'ru',
  },
  {
    _id: SECONDARY_LOCALE,
    name: 'English',
    slug: 'en',
    nativeName: 'en',
  },
  {
    _id: 'ua',
    name: 'Украинский',
    slug: 'ua',
    nativeName: 'ua',
  },
  {
    _id: 'pl',
    name: 'Польский',
    slug: 'pl',
    nativeName: 'pl',
  },
];

// task states
export const TASK_STATE_OPTIONS: ConstantOptionsType = [
  {
    _id: TASK_STATE_PENDING,
    nameI18n: {
      [DEFAULT_LOCALE]: 'В ожидании',
      [SECONDARY_LOCALE]: 'Pending',
    },
  },
  {
    _id: TASK_STATE_IN_PROGRESS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'В процессе',
      [SECONDARY_LOCALE]: 'In progress',
    },
  },
  {
    _id: TASK_STATE_INSPECTION,
    nameI18n: {
      [DEFAULT_LOCALE]: 'У инстпектора',
      [SECONDARY_LOCALE]: 'Inspection',
    },
  },
  {
    _id: TASK_STATE_MODERATION,
    nameI18n: {
      [DEFAULT_LOCALE]: 'На модерации',
      [SECONDARY_LOCALE]: 'Moderation',
    },
  },
  {
    _id: TASK_STATE_DONE,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Выполнена',
      [SECONDARY_LOCALE]: 'Done',
    },
  },
];

// task price targets
export const TASK_PRICE_TARGET_TASK = 'task';
export const TASK_PRICE_TARGET_FIELD = 'field';
export const TASK_PRICE_TARGET_SYMBOL = 'symbol';
export const TASK_PRICE_TARGETS: ConstantOptionsType = [
  {
    _id: TASK_PRICE_TARGET_TASK,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Задача',
    },
  },
  {
    _id: TASK_PRICE_TARGET_FIELD,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Поле',
    },
  },
  {
    _id: TASK_PRICE_TARGET_SYMBOL,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Символ',
    },
  },
];

// task price actions
export const TASK_PRICE_ACTION_ADDED = 'added';
export const TASK_PRICE_ACTION_DELETED = 'deleted';
export const TASK_PRICE_ACTION_UPDATED = 'updated';
export const TASK_PRICE_ACTIONS: ConstantOptionsType = [
  {
    _id: TASK_PRICE_ACTION_ADDED,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Добавление',
    },
  },
  {
    _id: TASK_PRICE_ACTION_DELETED,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Удаление',
    },
  },
  {
    _id: TASK_PRICE_ACTION_UPDATED,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Обновление',
    },
  },
];

// task price slugs
export const TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_SELECT = `product-attribute-${ATTRIBUTE_VARIANT_SELECT}`;
export const TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_SELECT = `product-attribute-${ATTRIBUTE_VARIANT_MULTIPLE_SELECT}`;
export const TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_NUMBER = `product-attribute-${ATTRIBUTE_VARIANT_NUMBER}`;
export const TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_STRING = `product-attribute-${ATTRIBUTE_VARIANT_STRING}`;
export const TASK_PRICE_SLUG_PRODUCT_ASSETS = `product-assets`;
export const TASK_PRICE_SLUG_PRODUCT_CATEGORIES = `product-categories`;
export const TASK_PRICE_SLUG_PRODUCT_VARIANTS = `product-variants`;
export const TASK_PRICE_SLUG_PRODUCT_BRANDS = `product-brand`;
export const TASK_PRICE_SLUG_PRODUCT_SEO_CONTENT = `product-seo-content`;
export const TASK_PRICE_SLUG_PRODUCT_DETAILS = `product-details`;
export const TASK_PRICE_SLUGS: ConstantOptionsType = [
  // product
  {
    _id: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_SELECT,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Селект атрибут товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_SELECT,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Мульти-селект атрибут товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_NUMBER,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Числовой атрибут товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_ATTRIBUTE_MULTIPLE_STRING,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Текстовый атрибут товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_ASSETS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Изображения товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_CATEGORIES,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Категории товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_VARIANTS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Связи товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_BRANDS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Бренд / Производитель товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_SEO_CONTENT,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Контент карточки товара',
    },
  },
  {
    _id: TASK_PRICE_SLUG_PRODUCT_DETAILS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Детали товара',
    },
  },
];

// task variant slugs
export const TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES = `product-attributes`;
export const TASK_VARIANT_SLUG_PRODUCT_ASSETS = `product-assets`;
export const TASK_VARIANT_SLUG_PRODUCT_CATEGORIES = `product-categories`;
export const TASK_VARIANT_SLUG_PRODUCT_VARIANTS = `product-variants`;
export const TASK_VARIANT_SLUG_PRODUCT_BRANDS = `product-brand`;
export const TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT = `product-seo-content`;
export const TASK_VARIANT_SLUG_PRODUCT_DETAILS = `product-details`;
export const TASK_VARIANT_SLUGS: ConstantOptionsType = [
  {
    _id: TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить атрибуты товара',
    },
  },
  {
    _id: TASK_VARIANT_SLUG_PRODUCT_ASSETS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить изображения товара',
    },
  },
  {
    _id: TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить категории товара',
    },
  },
  {
    _id: TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить связи товара',
    },
  },
  {
    _id: TASK_VARIANT_SLUG_PRODUCT_BRANDS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Назначить Бренд / Производителя товара',
    },
  },
  {
    _id: TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить контент карточки товара',
    },
  },
  {
    _id: TASK_VARIANT_SLUG_PRODUCT_DETAILS,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Заполнить детали товара',
    },
  },
];

export function getTaskVariantSlugByRule(ruleSlug: RoleRuleSlugType): string {
  const slugsList: Record<RoleRuleSlugType, string> = {
    addPromoProduct: '',
    cancelOrder: '',
    confirmOrder: '',
    createAttribute: '',
    createAttributesGroup: '',
    createBlogAttribute: '',
    createBlogPost: '',
    createBrand: '',
    createBrandCollection: '',
    createCategory: '',
    createCity: '',
    createCompany: '',
    createCountry: '',
    createCurrency: '',
    createEvent: '',
    createEventRubric: '',
    createGiftCertificate: '',
    createLanguage: '',
    createManufacturer: '',
    createMessage: '',
    createMessagesGroup: '',
    createMetric: '',
    createNavItem: '',
    createOption: '',
    createOptionsGroup: '',
    createOrder: '',
    createOrderStatus: '',
    createPage: '',
    createPagesGroup: '',
    createProduct: '',
    createPromo: '',
    createPromoCode: '',
    createRole: '',
    createRubric: '',
    createRubricVariant: '',
    createShop: '',
    createShopProduct: '',
    createSupplier: '',
    createTask: '',
    createTaskVariant: '',
    createUser: '',
    createUserCategory: '',
    deleteAttribute: '',
    deleteAttributesGroup: '',
    deleteBlogAttribute: '',
    deleteBlogPost: '',
    deleteBrand: '',
    deleteBrandCollection: '',
    deleteCategory: '',
    deleteCity: '',
    deleteCompany: '',
    deleteCountry: '',
    deleteCurrency: '',
    deleteEvent: '',
    deleteEventRubric: '',
    deleteGiftCertificate: '',
    deleteLanguage: '',
    deleteManufacturer: '',
    deleteMessage: '',
    deleteMessagesGroup: '',
    deleteMetric: '',
    deleteNavItem: '',
    deleteOption: '',
    deleteOptionsGroup: '',
    deleteOrder: '',
    deleteOrderStatus: '',
    deletePage: '',
    deletePagesGroup: '',
    deleteProduct: '',
    deletePromo: '',
    deletePromoCode: '',
    deletePromoProduct: '',
    deleteRole: '',
    deleteRubric: '',
    deleteRubricVariant: '',
    deleteShop: '',
    deleteShopProduct: '',
    deleteSupplier: '',
    deleteTask: '',
    deleteTaskVariant: '',
    deleteUser: '',
    deleteUserCategory: '',
    setUserCategory: '',
    updateAttribute: '',
    updateAttributesGroup: '',
    updateBlogAttribute: '',
    updateBlogPost: '',
    updateBrand: '',
    updateBrandCollection: '',
    updateCategory: '',
    updateCity: '',
    updateCompany: '',
    updateCompanyConfig: '',
    updateConfig: '',
    updateCountry: '',
    updateCurrency: '',
    updateEvent: '',
    updateEventAssets: '',
    updateEventAttributes: '',
    updateEventRubric: '',
    updateEventSeoContent: '',
    updateGiftCertificate: '',
    updateLanguage: '',
    updateManufacturer: '',
    updateMessage: '',
    updateMessagesGroup: '',
    updateMetric: '',
    updateNavItem: '',
    updateOption: '',
    updateOptionsGroup: '',
    updateOrder: '',
    updateOrderProductDiscount: '',
    updateOrderStatus: '',
    updatePage: '',
    updatePagesGroup: '',
    updateProduct: TASK_VARIANT_SLUG_PRODUCT_DETAILS,
    updateProductAssets: TASK_VARIANT_SLUG_PRODUCT_ASSETS,
    updateProductAttributes: TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
    updateProductBrand: TASK_VARIANT_SLUG_PRODUCT_BRANDS,
    updateProductCategories: TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
    updateProductSeoContent: TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
    updateProductVariants: TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
    updatePromo: '',
    updatePromoCode: '',
    updateRole: '',
    updateRubric: '',
    updateRubricVariant: '',
    updateShop: '',
    updateShopProduct: '',
    updateSupplier: '',
    updateTask: '',
    updateTaskVariant: '',
    updateUser: '',
    updateUserCategory: '',
    updateUserPassword: '',
  };
  return slugsList[ruleSlug];
}
