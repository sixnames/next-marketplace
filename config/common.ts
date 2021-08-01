// ID Counters
import { Value } from '@react-page/editor';
import { PageStateModel } from '../db/dbModels';

export const DEFAULT_ID_COUNTER = 1;
export const ID_COUNTER_STEP = 1;
export const ID_COUNTER_DIGITS = 6;

// Time
export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const NOTIFICATION_TIMEOUT = ONE_SECOND * 5;
export const MAIN_BANNER_AUTOPLAY_SPEED = ONE_SECOND * 3;

//DATES
export const DATE_FORMAT_DATE = 'dd-MM-yyyy';
export const DATE_FORMAT_TIME = 'HH:mm';
export const DATE_FORMAT_FULL = `${DATE_FORMAT_DATE} ${DATE_FORMAT_TIME}`;

// Cookies / Local storage
export const CART_COOKIE_KEY = 'cart';
export const THEME_COOKIE_KEY = 'theme';
export const ADULT_KEY = 'adult';
export const ADULT_TRUE = 'true';
export const ADULT_FALSE = 'false';
export const COOKIE_COMPANY_SLUG = 'companySlug';
export const COOKIE_LOCALE = 'locale';
export const COOKIE_CITY = 'city';

// THEME
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
export const THEME_NOT_ALL = 'not all';

// I18n
export const DEFAULT_LOCALE = 'ru';
export const SECONDARY_LOCALE = 'en';
export const LOCALES = [DEFAULT_LOCALE, SECONDARY_LOCALE];

export const CITY_COOKIE_KEY = 'city';
export const LOCALE_COOKIE_KEY = 'locale';
export const COMPANY_SLUG_COOKIE_KEY = 'companySlug';
export const LOCALE_HEADER = 'content-language';
export const LOCALE_NOT_FOUND_FIELD_MESSAGE = 'Field translation not found';

// Cities and countries
export const DEFAULT_COUNTRY = 'Россия';
export const SECONDARY_COUNTRY = 'USA';
export const DEFAULT_CITY = 'msk';
export const SECONDARY_CITY = 'ny';
export const DEFAULT_CURRENCY = 'р.';
export const SECONDARY_CURRENCY = '$';

// GENDER
export const GENDER_SHE = 'she';
export const GENDER_HE = 'he';
export const GENDER_IT = 'it';
export const GENDER_PLURAL = 'plural';
export const GENDER_ENUMS = [GENDER_HE, GENDER_SHE, GENDER_IT, GENDER_PLURAL];

// Addresses
export const GEO_POINT_TYPE = 'Point';

// Roles
export const ROLE_SLUG_GUEST = 'guest';
export const ROLE_SLUG_ADMIN = 'admin';
export const ROLE_SLUG_COMPANY_OWNER = 'companyOwner';
export const ROLE_SLUG_COMPANY_MANAGER = 'companyManager';
export const ROLE_EMPTY_CUSTOM_FILTER = '{}';

// Routes
export const ROUTE_DOCS_PAGES = '/docs';
export const ROUTE_CONSOLE = '/console';
export const ROUTE_CMS = `/cms`;
export const ROUTE_CONSOLE_NAV_GROUP = 'console';
export const ROUTE_CMS_NAV_GROUP = 'cms';
export const ROUTE_SIGN_IN = '/sign-in';
export const ROUTE_CONTACTS = `/contacts`;
export const CATALOGUE_DEFAULT_RUBRIC_SLUG = 'vino';
export const ROUTE_CATALOGUE = `/catalogue`;
export const ROUTE_THANK_YOU = `/thank-you`;
export const ROUTE_CATALOGUE_DEFAULT_RUBRIC = `${ROUTE_CATALOGUE}/${CATALOGUE_DEFAULT_RUBRIC_SLUG}`;
export const CMS_ORDERS_NAV_ITEM_SLUG = `${ROUTE_CMS_NAV_GROUP}-orders`;
export const CONSOLE_ORDERS_NAV_ITEM_SLUG = `${ROUTE_CONSOLE_NAV_GROUP}-orders`;

// query params
export const QUERY_DATA_LAYOUT_PAGE = 'page';

// profile
export const ROUTE_SEARCH_RESULT = `/search-result`;
export const ROUTE_PROFILE = `/profile`;
export const ROUTE_PROFILE_FAVORITE = `${ROUTE_PROFILE}/favorite`;
export const ROUTE_PROFILE_COMPARE = `${ROUTE_PROFILE}/compare`;
export const ROUTE_PROFILE_VIEWED = `${ROUTE_PROFILE}/viewed`;
export const ROUTE_PROFILE_PROPOSALS = `${ROUTE_PROFILE}/proposals`;
export const ROUTE_PROFILE_BONUS = `${ROUTE_PROFILE}/bonus`;
export const ROUTE_PROFILE_PREFERENCES = `${ROUTE_PROFILE}/preferences`;
export const ROUTE_PROFILE_CHATS = `${ROUTE_PROFILE}/chats`;
export const ROUTE_PROFILE_FEEDBACK = `${ROUTE_PROFILE}/feedback`;
export const ROUTE_PROFILE_DETAILS = `${ROUTE_PROFILE}/details`;

// Configs
export const CONFIG_VARIANT_STRING = 'string';
export const CONFIG_VARIANT_NUMBER = 'number';
export const CONFIG_VARIANT_PHONE = 'tel';
export const CONFIG_VARIANT_EMAIL = 'email';
export const CONFIG_VARIANT_ASSET = 'asset';
export const CONFIG_VARIANT_BOOLEAN = 'boolean';
export const CONFIG_VARIANT_CONSTRUCTOR = 'constructor';
export const CONFIG_VARIANT_COLOR = 'color';

export const CONFIG_VARIANTS_ENUMS = [
  CONFIG_VARIANT_STRING,
  CONFIG_VARIANT_NUMBER,
  CONFIG_VARIANT_PHONE,
  CONFIG_VARIANT_EMAIL,
  CONFIG_VARIANT_ASSET,
  CONFIG_VARIANT_BOOLEAN,
  CONFIG_VARIANT_CONSTRUCTOR,
  CONFIG_VARIANT_COLOR,
];

export const CONFIG_GROUP_GLOBALS = 'globals';
export const CONFIG_GROUP_ANALYTICS = 'analytics';
export const CONFIG_GROUP_UI = 'ui';
export const CONFIG_GROUP_CONTACTS = 'contacts';
export const CONFIG_GROUP_SEO = 'seo';
export const CONFIG_GROUP_CATALOGUE = 'catalogue';

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
export const ATTRIBUTE_VARIANT_SELECT = 'select';
export const ATTRIBUTE_VARIANT_MULTIPLE_SELECT = 'multipleSelect';
export const ATTRIBUTE_VARIANT_STRING = 'string';
export const ATTRIBUTE_VARIANT_NUMBER = 'number';

export const ATTRIBUTE_VARIANTS_ENUMS = [
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VARIANT_NUMBER,
];

// ATTRIBUTE VIEW VARIANTS
export const ATTRIBUTE_VIEW_VARIANT_LIST = 'list';
export const ATTRIBUTE_VIEW_VARIANT_TEXT = 'text';
export const ATTRIBUTE_VIEW_VARIANT_TAG = 'tag';
export const ATTRIBUTE_VIEW_VARIANT_ICON = 'icon';
export const ATTRIBUTE_VIEW_VARIANT_OUTER_RATING = 'outerRating';

export const ATTRIBUTE_VIEW_VARIANTS_ENUMS = [
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
];

// ATTRIBUTE POSITIONS IN TITLE
export const ATTRIBUTE_POSITION_IN_TITLE_BEGIN = 'begin';
export const ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD = 'beforeKeyword';
export const ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD = 'replaceKeyword';
export const ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD = 'afterKeyword';
export const ATTRIBUTE_POSITION_IN_TITLE_END = 'end';

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
export const DEFAULT_COMPANY_SLUG = 'default';
export const DEFAULT_COUNTERS_OBJECT = {
  priorities: {
    [DEFAULT_COMPANY_SLUG]: {
      [DEFAULT_CITY]: DEFAULT_PRIORITY,
    },
  },
  views: {
    [DEFAULT_COMPANY_SLUG]: {
      [DEFAULT_CITY]: DEFAULT_PRIORITY,
    },
  },
};

// SORT
export const SORT_ASC = 1;
export const SORT_ASC_STR = 'ASC';
export const SORT_DESC = -1;
export const SORT_DESC_STR = 'DESC';

// CATALOGUE
export const CATALOGUE_NAV_VISIBLE_ATTRIBUTES = '3';
export const CATALOGUE_NAV_VISIBLE_OPTIONS = '5';
export const CATALOGUE_FILTER_VISIBLE_OPTIONS = '5';
export const CATALOGUE_FILTER_LIMIT = 'limit';
export const CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES = '5';
export const CATALOGUE_PRODUCTS_LIMIT = 30;
export const CATALOGUE_OPTION_SEPARATOR = '-';
export const SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY = 'price';
export const RUBRIC_KEY = 'rubric';
export const SORT_BY_KEY = 'sortBy';
export const SORT_DIR_KEY = 'sortDir';
export const CATALOGUE_FILTER_SORT_KEYS = [SORT_BY_KEY, SORT_DIR_KEY];
export const CATALOGUE_BRAND_KEY = 'brand';
export const CATALOGUE_BRAND_COLLECTION_KEY = 'brandCollection';
export const CATALOGUE_MANUFACTURER_KEY = 'manufacturer';
export const PRICE_ATTRIBUTE_SLUG = 'price';
export const CATALOGUE_VIEW_STORAGE_KEY = 'catalogueView';
export const CATALOGUE_VIEW_ROW = 'row';
export const CATALOGUE_VIEW_GRID = 'grid';
export const CATALOGUE_TOP_PRODUCTS_LIMIT = 20;
export const CATALOGUE_TOP_SHOPS_LIMIT = 10;
export const CATALOGUE_TOP_FILTERS_LIMIT = 10;

export const NEGATIVE_INDEX = -1;
export const TABLE_IMAGE_WIDTH = 40;

// PAGINATION
export const QUERY_FILTER_PAGE = 'page';
export const PAGINATION_DEFAULT_LIMIT = 30;
export const SORT_BY_ID_DIRECTION = SORT_DESC;
export const SORT_BY_CREATED_AT = 'createdAt';
export const SORT_BY_ID = '_id';
export const PAGE_DEFAULT = 1;

// ORDER LOG VARIANTS
export const ORDER_LOG_VARIANT_STATUS = 'status';
export const ORDER_LOG_VARIANT_CONFIRM = 'confirm';

export const ORDER_LOG_VARIANTS_ENUMS = [ORDER_LOG_VARIANT_STATUS, ORDER_LOG_VARIANT_CONFIRM];

// ORDER STATUSES SLUGS
export const ORDER_STATUS_PENDING = 'pending';
export const ORDER_STATUS_CONFIRMED = 'confirmed';
export const ORDER_STATUS_DONE = 'done';
export const ORDER_STATUS_CANCELED = 'canceled';

// LANGUAGES
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

// ALGOLIA
export const HITS_PER_PAGE = 150;

// ASSETS
export const ASSETS_DIST_USERS = 'users';
export const ASSETS_DIST_PRODUCTS = 'products';
export const ASSETS_DIST_PRODUCT_CARD_CONTENT = 'card-content';
export const ASSETS_DIST_COMPANIES = 'companies';
export const ASSETS_DIST_SHOPS_LOGOS = 'shop-logos';
export const ASSETS_DIST_SHOPS = 'shops';
export const ASSETS_DIST_CONFIGS = 'configs';
export const ASSETS_DIST_PAGES = 'pages';
export const ASSETS_DIST_SEO = 'seo';
export const ASSETS_DIST_TEMPLATES = 'templates';
export const ASSETS_DIST_OPTIONS = 'option';
export const ASSETS_LOGO_WIDTH = 150;
export const ASSETS_SHOP_IMAGE_WIDTH = 1080;
export const ASSETS_PRODUCT_IMAGE_WIDTH = 300;

// TEXT HORIZONTAL ALIGNMENT
export const TEXT_HORIZONTAL_LEFT = 'left';
export const TEXT_HORIZONTAL_CENTER = 'center';
export const TEXT_HORIZONTAL_RIGHT = 'right';

// FLEX ALIGNMENT
export const FLEX_START = 'flex-start';
export const FLEX_CENTER = 'center';
export const FLEX_END = 'flex-end';

// SEARCH
export const HEADER_SEARCH_RUBRICS_LIMIT = 4;
export const HEADER_SEARCH_PRODUCTS_LIMIT = 4;

// PAGES
export const PAGE_STATE_DRAFT = 'draft' as PageStateModel;
export const PAGE_STATE_PUBLISHED = 'published' as PageStateModel;
export const PAGE_STATE_ENUMS = [PAGE_STATE_DRAFT, PAGE_STATE_PUBLISHED];
export const PAGE_EDITOR_DEFAULT_VALUE_STRING = '{"id":"1","version":1,"rows":[]}';
export const PAGE_EDITOR_DEFAULT_VALUE: Value = {
  id: '1',
  version: 1,
  rows: [],
};

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
