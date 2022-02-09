// ID Counters
import { Value } from '@react-page/editor';
import {
  AttributePositionInTitleModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
  ConfigVariantModel,
  GenderModel,
  OrderDeliveryVariantModel,
  OrderPaymentVariantModel,
  OrderRequestStateModel,
  OrderRequestVariantModel,
  PageStateModel,
  TaskStateModel,
  SessionLogEventVariantEnum,
  SortDirectionModel,
  SupplierPriceVariantModel,
} from 'db/dbModels';

export type RequestMethodType = 'GET' | 'POST' | 'DELETE' | 'PATCH';
export const REQUEST_METHOD_GET = 'GET' as RequestMethodType;
export const REQUEST_METHOD_POST = 'POST' as RequestMethodType;
export const REQUEST_METHOD_DELETE = 'DELETE' as RequestMethodType;
export const REQUEST_METHOD_PATCH = 'PATCH' as RequestMethodType;

export const ID_COUNTER_STEP = 1;
export const ID_COUNTER_DIGITS = 6;
export const ID_COUNTER_ORDER_DIGITS = 4;

// Time
export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const NOTIFICATION_TIMEOUT = ONE_SECOND * 5;
export const MAIN_BANNER_AUTOPLAY_SPEED = ONE_SECOND * 3;

export const ISR_ONE_SECOND = 1;
export const ISR_ONE_MINUTE = ISR_ONE_SECOND * 60;
export const ISR_ONE_HOUR = ISR_ONE_MINUTE * 60;
export const ISR_ONE_DAY = ISR_ONE_HOUR * 34;
export const ISR_ONE_WEEK = ISR_ONE_DAY * 7;
export const ISR_ONE_MONTH = ISR_ONE_WEEK * 4;
export const ISR_SIX_MONTHS = ISR_ONE_MONTH * 6;

//DATES
export const DATE_FORMAT_DATE = 'dd-MM-yyyy';
export const DATE_FORMAT_TIME = 'HH:mm';
export const DATE_FORMAT_FULL = `${DATE_FORMAT_DATE} ${DATE_FORMAT_TIME}`;

// Cookies / Local storage
export const CART_COOKIE_KEY = 'cart';
export const ADULT_KEY = 'adult';
export const ADULT_TRUE = 'true';
export const ADULT_FALSE = 'false';
export const COOKIE_COMPANY_SLUG = 'companySlug';
export const COOKIE_LOCALE = 'locale';
export const COOKIE_CITY = 'city';
export const COOKIE_CURRENCY = 'currency';

// THEME
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

// I18n
export const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'ru';
export const SECONDARY_LOCALE = 'en';
export const LOCALES = [DEFAULT_LOCALE, SECONDARY_LOCALE];

export const CITY_COOKIE_KEY = 'city';
export const LOCALE_COOKIE_KEY = 'locale';
export const SESSION_COOKIE_KEY = 'sessionId';
export const COMPANY_SLUG_COOKIE_KEY = 'companySlug';
export const LOCALE_HEADER = 'content-language';

// Cities and countries
export const DEFAULT_CITY = process.env.DEFAULT_CITY || 'msk';
export const DEFAULT_CURRENCY = 'р.';

// GENDER
export const GENDER_SHE = 'she' as GenderModel;
export const GENDER_HE = 'he' as GenderModel;
export const GENDER_IT = 'it' as GenderModel;
export const GENDER_PLURAL = 'plural' as GenderModel;
export const GENDER_SINGULAR = 'singular' as GenderModel;
export const GENDER_ENUMS = [GENDER_HE, GENDER_SHE, GENDER_IT, GENDER_PLURAL, GENDER_SINGULAR];

// Addresses
export const GEO_POINT_TYPE = 'Point';

// Roles
export const ROLE_SLUG_GUEST = 'guest';
export const ROLE_SLUG_ADMIN = 'admin';

// Configs
export const CONFIG_VARIANT_STRING = 'string' as ConfigVariantModel;
export const CONFIG_VARIANT_NUMBER = 'number' as ConfigVariantModel;
export const CONFIG_VARIANT_PHONE = 'tel' as ConfigVariantModel;
export const CONFIG_VARIANT_EMAIL = 'email' as ConfigVariantModel;
export const CONFIG_VARIANT_ASSET = 'asset' as ConfigVariantModel;
export const CONFIG_VARIANT_BOOLEAN = 'boolean' as ConfigVariantModel;
export const CONFIG_VARIANT_CONSTRUCTOR = 'constructor' as ConfigVariantModel;
export const CONFIG_VARIANT_COLOR = 'color' as ConfigVariantModel;
export const CONFIG_VARIANT_ADDRESS = 'address' as ConfigVariantModel;
export const CONFIG_VARIANT_PASSWORD = 'password' as ConfigVariantModel;
export const CONFIG_VARIANT_CATEGORIES_TREE = 'categoriesTree' as ConfigVariantModel;
export const CONFIG_VARIANT_RUBRICS = 'rubrics' as ConfigVariantModel;

export const CONFIG_VARIANTS_ENUMS = [
  CONFIG_VARIANT_STRING,
  CONFIG_VARIANT_NUMBER,
  CONFIG_VARIANT_PHONE,
  CONFIG_VARIANT_EMAIL,
  CONFIG_VARIANT_ASSET,
  CONFIG_VARIANT_BOOLEAN,
  CONFIG_VARIANT_CONSTRUCTOR,
  CONFIG_VARIANT_COLOR,
  CONFIG_VARIANT_ADDRESS,
  CONFIG_VARIANT_PASSWORD,
  CONFIG_VARIANT_CATEGORIES_TREE,
  CONFIG_VARIANT_RUBRICS,
];

export const CONFIG_GROUP_GLOBALS = 'globals';
export const CONFIG_GROUP_ANALYTICS = 'analytics';
export const CONFIG_GROUP_UI = 'ui';
export const CONFIG_GROUP_CONTACTS = 'contacts';
export const CONFIG_GROUP_SEO = 'seo';
export const CONFIG_GROUP_CATALOGUE = 'catalogue';
export const CONFIG_GROUP_PROJECT = 'project';

// OPTIONS GROUP VARIANTS
export const OPTIONS_GROUP_VARIANT_TEXT = 'text';
export const OPTIONS_GROUP_VARIANT_ICON = 'icon';
export const OPTIONS_GROUP_VARIANT_COLOR = 'color';

export const OPTIONS_GROUP_VARIANT_ENUMS = [
  OPTIONS_GROUP_VARIANT_TEXT,
  OPTIONS_GROUP_VARIANT_ICON,
  OPTIONS_GROUP_VARIANT_COLOR,
];

// ATTRIBUTE VARIANTS
export const ATTRIBUTE_VARIANT_SELECT = 'select' as AttributeVariantModel;
export const ATTRIBUTE_VARIANT_MULTIPLE_SELECT = 'multipleSelect' as AttributeVariantModel;
export const ATTRIBUTE_VARIANT_STRING = 'string' as AttributeVariantModel;
export const ATTRIBUTE_VARIANT_NUMBER = 'number' as AttributeVariantModel;

export const ATTRIBUTE_VARIANTS_ENUMS = [
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VARIANT_NUMBER,
];

// ATTRIBUTE VIEW VARIANTS
export const ATTRIBUTE_VIEW_VARIANT_LIST = 'list' as AttributeViewVariantModel;
export const ATTRIBUTE_VIEW_VARIANT_TEXT = 'text' as AttributeViewVariantModel;
export const ATTRIBUTE_VIEW_VARIANT_TAG = 'tag' as AttributeViewVariantModel;
export const ATTRIBUTE_VIEW_VARIANT_ICON = 'icon' as AttributeViewVariantModel;
export const ATTRIBUTE_VIEW_VARIANT_OUTER_RATING = 'outerRating' as AttributeViewVariantModel;

export const ATTRIBUTE_VIEW_VARIANTS_ENUMS = [
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
];

// ATTRIBUTE POSITIONS IN TITLE
export const ATTRIBUTE_POSITION_IN_TITLE_BEGIN = 'begin' as AttributePositionInTitleModel;
export const ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD =
  'beforeKeyword' as AttributePositionInTitleModel;
export const ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD =
  'replaceKeyword' as AttributePositionInTitleModel;
export const ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD =
  'afterKeyword' as AttributePositionInTitleModel;
export const ATTRIBUTE_POSITION_IN_TITLE_END = 'end' as AttributePositionInTitleModel;

export const ATTRIBUTE_POSITION_IN_TITLE_ENUMS = [
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
];

// COUNTERS
export const DEFAULT_PRIORITY = 1;
export const VIEWS_COUNTER_STEP = 1;
export const DEFAULT_COMPANY_SLUG = '0';
export const DEFAULT_COUNTERS_OBJECT = {
  views: {
    [DEFAULT_COMPANY_SLUG]: {
      [DEFAULT_CITY]: DEFAULT_PRIORITY,
    },
  },
};

// SORT
export const SORT_ASC = 1 as SortDirectionModel;
export const SORT_ASC_STR = 'ASC';
export const SORT_DESC = -1 as SortDirectionModel;
export const SORT_DESC_STR = 'DESC';
export const DEFAULT_SORT_STAGE = {
  views: SORT_DESC,
  _id: SORT_DESC,
};

// NOTIFICATIONS
export const NOTIFICATIONS_GROUP_CUSTOMER = 'customer';
export const NOTIFICATIONS_GROUP_ADMIN = 'admin';
export const NOTIFICATIONS_GROUP_COMPANY = 'company';

// CATALOGUE
export const CATALOGUE_FILTER_VISIBLE_OPTIONS = 5;
export const CATALOGUE_FILTER_LIMIT = 'limit';
export const CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES = '5';
export const CATALOGUE_PRODUCTS_LIMIT = 36;
export const FILTER_SEPARATOR = '-';
export const SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY = 'price';
export const SORT_BY_KEY = 'sortBy';
export const SORT_DIR_KEY = 'sortDir';
export const FILTER_SORT_KEYS = [SORT_BY_KEY, SORT_DIR_KEY];
export const CATEGORY_SLUG_PREFIX_WORD = 'cat';
export const CATEGORY_SLUG_PREFIX_SEPARATOR = '_';
export const CATEGORY_SLUG_PREFIX = `${CATEGORY_SLUG_PREFIX_WORD}${CATEGORY_SLUG_PREFIX_SEPARATOR}`;
export const FILTER_RUBRIC_KEY = 'rubric';
export const FILTER_CATEGORY_KEY = 'category';
export const FILTER_BRAND_KEY = 'brand';
export const FILTER_BRAND_COLLECTION_KEY = 'brandCollection';
export const FILTER_MANUFACTURER_KEY = 'manufacturer';
export const FILTER_PRICE_KEY = 'price';
export const FILTER_COMMON_KEY = 'common';
export const FILTER_NO_PHOTO_KEY = 'noPhoto';
export const CATALOGUE_VIEW_STORAGE_KEY = 'catalogueView';
export const CATALOGUE_VIEW_ROW = 'row';
export const CATALOGUE_VIEW_GRID = 'grid';
export const CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT = 3;
export const CATALOGUE_TOP_PRODUCTS_LIMIT = 20;
export const CATALOGUE_TOP_FILTERS_LIMIT = 10;
export const CMS_BRANDS_LIMIT = 100;
export const CATALOGUE_SEO_TEXT_POSITION_TOP = 'top';
export const CATALOGUE_SEO_TEXT_POSITION_BOTTOM = 'bottom';

export const NEGATIVE_INDEX = -1;
export const TABLE_IMAGE_WIDTH = 40;

// PAGINATION
export const FILTER_PAGE_KEY = 'page';
export const PAGINATION_DEFAULT_LIMIT = 50;
export const SORT_BY_ID_DIRECTION = SORT_DESC;
export const SORT_BY_CREATED_AT = 'createdAt';
export const DEFAULT_PAGE = 1;
export const ZERO_PAGE = 0;
export const ZERO_PAGE_FILTER = `${FILTER_PAGE_KEY}${FILTER_SEPARATOR}${ZERO_PAGE}`;
export const DEFAULT_PAGE_FILTER = `${FILTER_PAGE_KEY}${FILTER_SEPARATOR}${DEFAULT_PAGE}`;

// ORDER REQUEST VARIANTS
export const ORDER_REQUEST_VARIANT_CANCELATION = 'cancelation' as OrderRequestVariantModel;

// ORDER REQUEST STATE
export const ORDER_REQUEST_STATE_NEW = 'new' as OrderRequestStateModel;
export const ORDER_REQUEST_STATE_CONFIRMED = 'confirmed' as OrderRequestStateModel;
export const ORDER_REQUEST_STATE_CANCELED = 'canceled' as OrderRequestStateModel;

// ORDER DELIVERY VARIANTS
export const ORDER_DELIVERY_VARIANT_PICKUP = 'pickup' as OrderDeliveryVariantModel;
export const ORDER_DELIVERY_VARIANT_COURIER = 'courier' as OrderDeliveryVariantModel;

// ORDER PAYMENT VARIANTS
export const ORDER_PAYMENT_VARIANT_RECEIPT = 'receipt' as OrderPaymentVariantModel;

// MAP
// Moscow
export const MAP_DEFAULT_CENTER = {
  lat: 55.751957,
  lng: 37.617575,
};

// ALGOLIA
export const HITS_PER_PAGE = 150;

// ASSETS
export const ASSETS_DIST = `/assets`;
export const ASSETS_DIST_BLOG = 'blog';
export const ASSETS_DIST_BLOG_CONTENT = 'blog-content';
export const ASSETS_DIST_BRANDS = 'brands';
export const ASSETS_DIST_CATEGORIES = 'categories';
export const ASSETS_DIST_COMPANIES = 'companies';
export const ASSETS_DIST_CONFIGS = 'configs';
export const ASSETS_DIST_CONFIGS_WATERMARK = 'watermark';
export const ASSETS_DIST_OPTIONS = 'options';
export const ASSETS_DIST_PAGES = 'pages';
export const ASSETS_DIST_PRODUCTS = 'products';
export const ASSETS_DIST_PROMO = 'promo';
export const ASSETS_DIST_SEO = 'seo';
export const ASSETS_DIST_SEO_TEXTS = 'seo-content';
export const ASSETS_DIST_SHOPS = 'shops';
export const ASSETS_DIST_SHOPS_LOGOS = 'shop-logos';
export const ASSETS_DIST_TEMPLATES = 'templates';
export const ASSETS_DIST_USERS = 'users';
export const ASSETS_LOGO_WIDTH = 150;
export const ASSETS_PRODUCT_IMAGE_WIDTH = 800;
export const ASSETS_SHOP_IMAGE_WIDTH = 1080;
export const IMAGE_FALLBACK = `${ASSETS_DIST}/image-fallback.png`;
export const IMAGE_FALLBACK_BOTTLE = `${ASSETS_DIST}/fallback-bottle.png`;

// TEXT HORIZONTAL ALIGNMENT
export const TEXT_HORIZONTAL_LEFT = 'left';
export const TEXT_HORIZONTAL_CENTER = 'center';
export const TEXT_HORIZONTAL_RIGHT = 'right';

// FLEX ALIGNMENT
export const FLEX_START = 'flex-start';
export const FLEX_CENTER = 'center';
export const FLEX_END = 'flex-end';

// FLEX ALIGNMENT options
export const TEXT_HORIZONTAL_ALIGN_OPTIONS = [
  {
    _id: TEXT_HORIZONTAL_LEFT,
    slug: TEXT_HORIZONTAL_LEFT,
    name: 'Слева',
  },
  {
    _id: TEXT_HORIZONTAL_CENTER,
    slug: TEXT_HORIZONTAL_CENTER,
    name: 'Центр',
  },
  {
    _id: TEXT_HORIZONTAL_RIGHT,
    slug: TEXT_HORIZONTAL_RIGHT,
    name: 'Справа',
  },
];

export const TEXT_HORIZONTAL_FLEX_OPTIONS = [
  {
    _id: FLEX_START,
    slug: FLEX_START,
    name: 'Слева',
  },
  {
    _id: FLEX_CENTER,
    slug: FLEX_CENTER,
    name: 'Центр',
  },
  {
    _id: FLEX_END,
    slug: FLEX_END,
    name: 'Справа',
  },
];

export const TEXT_VERTICAL_FLEX_OPTIONS = [
  {
    _id: FLEX_START,
    slug: FLEX_START,
    name: 'Сверху',
  },
  {
    _id: FLEX_CENTER,
    slug: FLEX_CENTER,
    name: 'Центр',
  },
  {
    _id: FLEX_END,
    slug: FLEX_END,
    name: 'Снизу',
  },
];

// SEARCH
export const HEADER_SEARCH_PRODUCTS_LIMIT = 5;

// PAGES
export const PAGE_STATE_DRAFT = 'draft' as PageStateModel;
export const PAGE_STATE_PUBLISHED = 'published' as PageStateModel;
export const PAGE_STATE_OPTIONS = [
  {
    _id: PAGE_STATE_DRAFT,
    slug: PAGE_STATE_DRAFT,
    name: 'Не опубликована',
  },
  {
    _id: PAGE_STATE_PUBLISHED,
    slug: PAGE_STATE_PUBLISHED,
    name: 'Опубликована',
  },
];

export const PAGE_EDITOR_DEFAULT_VALUE_STRING = '{"id":"1","version":1,"rows":[]}';
export const PAGE_EDITOR_DEFAULT_VALUE: Value = {
  id: '1',
  version: 1,
  rows: [],
};

export const NAV_GROUP_CONSOLE = 'console';
export const NAV_GROUP_CMS = 'cms';
export const CMS_ORDERS_NAV_ITEM_SLUG = `${NAV_GROUP_CMS}-orders`;
export const CONSOLE_ORDERS_NAV_ITEM_SLUG = `${NAV_GROUP_CONSOLE}-orders`;

// query params
export const QUERY_DATA_LAYOUT_PAGE = 'page';

// suppliers
export const SUPPLIER_PRICE_VARIANT_DISCOUNT = 'discount' as SupplierPriceVariantModel;
export const SUPPLIER_PRICE_VARIANT_CHARGE = 'charge' as SupplierPriceVariantModel;
export const SUPPLIER_PRICE_VARIANT_ENUMS = [
  SUPPLIER_PRICE_VARIANT_DISCOUNT,
  SUPPLIER_PRICE_VARIANT_CHARGE,
];

// draft
export const TASK_STATE_PENDING = 'pending' as TaskStateModel;
export const TASK_STATE_IN_PROGRESS = 'inProgress' as TaskStateModel;
export const TASK_STATE_INSPECTION = 'inspection' as TaskStateModel;
export const TASK_STATE_MODERATION = 'moderation' as TaskStateModel;
export const TASK_STATE_DONE = 'done' as TaskStateModel;

// session log event variants
export const SESSION_LOG_EVENT_VISIT = 'visit' as SessionLogEventVariantEnum;
export const SESSION_LOG_EVENT_LEAVE = 'leave' as SessionLogEventVariantEnum;
export const SESSION_LOG_EVENT_ADD_TO_CART = 'addToCartClick' as SessionLogEventVariantEnum;
export const SESSION_LOG_EVENT_MAKE_AN_ORDER = 'makeAnOrderClick' as SessionLogEventVariantEnum;

// Alphabets
export const ALPHABET_EN = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export const ALPHABET_RU = [
  'а',
  'б',
  'в',
  'г',
  'д',
  'е',
  'ё',
  'ж',
  'з',
  'и',
  'й',
  'к',
  'л',
  'м',
  'н',
  'о',
  'п',
  'р',
  'с',
  'т',
  'у',
  'ф',
  'х',
  'ц',
  'ч',
  'ш',
  'щ',
  'ъ',
  'ы',
  'ь',
  'э',
  'ю',
  'я',
];

export const NUMBERS_LIST = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export const ALL_ALPHABETS = [...ALPHABET_RU, ...ALPHABET_EN, ...NUMBERS_LIST];

export const EMPTY_OBJECT_AS_STRING = '{}';

export const DEFAULT_DIFF = {
  added: {},
  deleted: {},
  updated: {},
};

export const KEY_CODES = {
  tab: 9,
  enter: 13,
  escape: 27,
  space: 32,
  pageUp: 33,
  pageDown: 34,
  end: 35,
  home: 36,
  arrowLeft: 37,
  arrowUp: 38,
  arrowRight: 39,
  arrowDown: 40,
};
