// ID Counters
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

// Cookies
export const CART_COOKIE_KEY = 'cart';
export const THEME_COOKIE_KEY = 'theme';

// THEME
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
export const THEME_NOT_ALL = 'not all';

// I18n
export const DEFAULT_LOCALE = 'ru';
export const SECONDARY_LOCALE = 'en';
export const LOCALES = [DEFAULT_LOCALE, SECONDARY_LOCALE];

export const CITY_COOKIE_KEY = 'city';
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
export const GENDER_ENUMS = [GENDER_HE, GENDER_SHE, GENDER_IT];

// Addresses
export const GEO_POINT_TYPE = 'Point';

// Roles
export const ROLE_SLUG_GUEST = 'guest';
export const ROLE_SLUG_ADMIN = 'admin';
export const ROLE_SLUG_COMPANY_OWNER = 'companyOwner';
export const ROLE_SLUG_COMPANY_MANAGER = 'companyManager';
export const ROLE_EMPTY_CUSTOM_FILTER = '{}';

// Routes
export const ROUTE_APP = '/app';
export const ROUTE_CMS = `/cms`;
export const ROUTE_APP_NAV_GROUP = 'app';
export const ROUTE_CMS_NAV_GROUP = 'cms';
export const ROUTE_SIGN_IN = '/sign-in';

// Query params
export const QUERY_DATA_LAYOUT_NO_RUBRIC = 'no-rubric';
export const QUERY_DATA_LAYOUT_PAGE = 'page';

// links
export const PRODUCT_CARD_RUBRIC_SLUG_PREFIX = 'rubric-';

//profile
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

// Codes
export const ROUTE_TEMPORARY_REDIRECT_CODE = 302;

// CONFIG VARIANTS
export const CONFIG_VARIANT_STRING = 'string';
export const CONFIG_VARIANT_NUMBER = 'number';
export const CONFIG_VARIANT_PHONE = 'tel';
export const CONFIG_VARIANT_EMAIL = 'email';
export const CONFIG_VARIANT_ASSET = 'asset';

export const CONFIG_VARIANTS_ENUMS = [
  CONFIG_VARIANT_STRING,
  CONFIG_VARIANT_NUMBER,
  CONFIG_VARIANT_PHONE,
  CONFIG_VARIANT_EMAIL,
  CONFIG_VARIANT_ASSET,
];

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
export const DEFAULT_COUNTERS_OBJECT = {
  priorities: {
    [DEFAULT_CITY]: DEFAULT_PRIORITY,
  },
  views: {
    [DEFAULT_CITY]: DEFAULT_PRIORITY,
  },
};
export const RUBRIC_DEFAULT_COUNTERS = {
  productsCount: 0,
};

// SORT
export const SORT_ASC = 1;
export const SORT_ASC_STR = 'ASC';
export const SORT_DESC = -1;
export const SORT_DESC_STR = 'DESC';

// CATALOGUE
export const CATALOGUE_NAV_VISIBLE_ATTRIBUTES = '3';
export const CATALOGUE_NAV_VISIBLE_OPTIONS = '3';
export const CATALOGUE_FILTER_VISIBLE_OPTIONS = '3';
export const CATALOGUE_FILTER_VISIBLE_ATTRIBUTES = '5';
export const CATALOGUE_PRODUCTS_LIMIT = 20;
export const CATALOGUE_OPTION_SEPARATOR = '-';
export const SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY = 'price';
export const SORT_BY_KEY = 'sortBy';
export const SORT_DIR_KEY = 'sortDir';
export const CATALOGUE_FILTER_SORT_KEYS = [SORT_BY_KEY, SORT_DIR_KEY];
export const CATALOGUE_BRAND_KEY = 'brand';
export const CATALOGUE_BRAND_COLLECTION_KEY = 'brandCollection';
export const CATALOGUE_MANUFACTURER_KEY = 'manufacturer';
export const PRICE_ATTRIBUTE_SLUG = 'price';

export const NEGATIVE_INDEX = -1;
export const TABLE_IMAGE_WIDTH = 40;

// PAGINATION
export const PAGINATION_DEFAULT_LIMIT = 20;
export const SORT_BY_ID_DIRECTION = SORT_DESC;
export const SORT_BY_CREATED_AT = 'createdAt';
export const PAGE_DEFAULT = 1;

// ORDER LOG VARIANTS
export const ORDER_LOG_VARIANT_STATUS = 'status';

export const ORDER_LOG_VARIANTS_ENUMS = [ORDER_LOG_VARIANT_STATUS];

// ORDER STATUSES SLUGS
export const ORDER_STATUS_NEW = 'new';
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

// ASSETS
export const ASSETS_DIST_PRODUCTS = 'products';
export const ASSETS_DIST_COMPANIES = 'companies';
export const ASSETS_DIST_SHOPS_LOGOS = 'shops-logos';
export const ASSETS_DIST_SHOPS = 'shops';
export const ASSETS_DIST_CONFIGS = 'configs';
