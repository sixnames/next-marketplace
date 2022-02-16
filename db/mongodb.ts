import {
  AttributeModel,
  AttributesGroupModel,
  BlackListProductModel,
  BlogAttributeModel,
  BlogLikeModel,
  BlogPostModel,
  BrandCollectionModel,
  BrandModel,
  CartModel,
  CatalogueNavModel,
  CategoryModel,
  CityModel,
  CompanyModel,
  ConfigModel,
  CountryModel,
  CurrencyModel,
  EventFacetModel,
  EventRubricModel,
  EventSummaryModel,
  GiftCertificateModel,
  IconModel,
  IdCounterModel,
  LanguageModel,
  ManufacturerModel,
  MessageModel,
  MessagesGroupModel,
  MetricModel,
  NavItemModel,
  NotSyncedProductModel,
  OptionModel,
  OptionsGroupModel,
  OrderCustomerModel,
  OrderLogModel,
  OrderModel,
  OrderProductModel,
  OrderStatusModel,
  PageModel,
  PagesGroupModel,
  PagesGroupTemplateModel,
  PagesTemplateModel,
  ProductFacetModel,
  ProductSummaryModel,
  PromoCodeModel,
  PromoModel,
  PromoProductModel,
  RoleModel,
  RoleRuleModel,
  RubricModel,
  RubricVariantModel,
  SeoContentModel,
  SessionLogModel,
  ShopModel,
  ShopProductModel,
  SupplierModel,
  SupplierProductModel,
  SyncIntersectModel,
  SyncLogModel,
  TaskModel,
  TaskVariantModel,
  UserCashbackLogModel,
  UserCategoryModel,
  UserModel,
  UserPaybackLogModel,
} from 'db/dbModels';
import { Db, MongoClient } from 'mongodb';
import path from 'path';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_BLACKLIST_PRODUCTS,
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_LIKES,
  COL_BLOG_POSTS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CARTS,
  COL_CATALOGUE_NAV,
  COL_CATEGORIES,
  COL_CITIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_COUNTRIES,
  COL_CURRENCIES,
  COL_EVENT_FACETS,
  COL_EVENT_RUBRICS,
  COL_EVENT_SUMMARIES,
  COL_GIFT_CERTIFICATES,
  COL_ICONS,
  COL_ID_COUNTERS,
  COL_LANGUAGES,
  COL_MANUFACTURERS,
  COL_MESSAGES,
  COL_MESSAGES_GROUPS,
  COL_METRICS,
  COL_NAV_ITEMS,
  COL_NOT_SYNCED_PRODUCTS,
  COL_OPTIONS,
  COL_OPTIONS_GROUPS,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_PAGE_TEMPLATES,
  COL_PAGES,
  COL_PAGES_GROUP,
  COL_PAGES_GROUP_TEMPLATES,
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_PROMO,
  COL_PROMO_CODES,
  COL_PROMO_PRODUCTS,
  COL_ROLE_RULES,
  COL_ROLES,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SEO_CONTENTS,
  COL_SESSION_LOGS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_SUPPLIER_PRODUCTS,
  COL_SUPPLIERS,
  COL_SYNC_INTERSECT,
  COL_SYNC_LOGS,
  COL_TASK_VARIANTS,
  COL_TASKS,
  COL_USER_CASHBACK_LOGS,
  COL_USER_CATEGORIES,
  COL_USER_PAYBACK_LOGS,
  COL_USERS,
} from './collectionNames';

interface GetDbPayloadInterface {
  db: Db;
  client: MongoClient;
}

// Create cached connection variable
let cachedDb: GetDbPayloadInterface | undefined;
const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

export async function getDatabase(): Promise<GetDbPayloadInterface> {
  // If the database connection is cached, use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGO_URL;
  const dbName = process.env.MONGO_DB_NAME;

  if (!uri || !dbName) {
    throw new Error('Unable to connect to database, no URI provided');
  }

  const sslOptions = process.env.DEV_ENV
    ? {}
    : {
        tls: true,
        tlsCAFile,
        replicaSet: process.env.MONGO_DB_RS,
      };

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: process.env.MONGO_DB_NAME,
    ...sslOptions,
  };

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, options);

  // Select the database through the connection
  const db = await client.db(dbName);

  const payload: GetDbPayloadInterface = {
    db,
    client,
  };

  // Cache the database connection and return the connection
  cachedDb = payload;
  return payload;
}

export function generateDbCollections({ db, client }: GetDbPayloadInterface) {
  return {
    db,
    client,
    attributesCollection: () => db.collection<AttributeModel>(COL_ATTRIBUTES),
    attributesGroupsCollection: () => db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS),
    blackListProductsCollection: () => db.collection<BlackListProductModel>(COL_BLACKLIST_PRODUCTS),
    blogAttributesCollection: () => db.collection<BlogAttributeModel>(COL_BLOG_ATTRIBUTES),
    blogLikesCollection: () => db.collection<BlogLikeModel>(COL_BLOG_LIKES),
    blogPostsCollection: () => db.collection<BlogPostModel>(COL_BLOG_POSTS),
    brandsCollection: () => db.collection<BrandModel>(COL_BRANDS),
    brandCollectionsCollection: () => db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS),
    cartsCollection: () => db.collection<CartModel>(COL_CARTS),
    catalogueNavCollection: () => db.collection<CatalogueNavModel>(COL_CATALOGUE_NAV),
    categoriesCollection: () => db.collection<CategoryModel>(COL_CATEGORIES),
    citiesCollection: () => db.collection<CityModel>(COL_CITIES),
    companiesCollection: () => db.collection<CompanyModel>(COL_COMPANIES),
    configsCollection: () => db.collection<ConfigModel>(COL_CONFIGS),
    countriesCollection: () => db.collection<CountryModel>(COL_COUNTRIES),
    currenciesCollection: () => db.collection<CurrencyModel>(COL_CURRENCIES),
    eventFacetsCollection: () => db.collection<EventFacetModel>(COL_EVENT_FACETS),
    eventRubricsCollection: () => db.collection<EventRubricModel>(COL_EVENT_RUBRICS),
    eventSummariesCollection: () => db.collection<EventSummaryModel>(COL_EVENT_SUMMARIES),
    giftCertificatesCollection: () => db.collection<GiftCertificateModel>(COL_GIFT_CERTIFICATES),
    iconsCollection: () => db.collection<IconModel>(COL_ICONS),
    idCountersCollection: () => db.collection<IdCounterModel>(COL_ID_COUNTERS),
    languagesCollection: () => db.collection<LanguageModel>(COL_LANGUAGES),
    manufacturersCollection: () => db.collection<ManufacturerModel>(COL_MANUFACTURERS),
    messagesCollection: () => db.collection<MessageModel>(COL_MESSAGES),
    messagesGroupsCollection: () => db.collection<MessagesGroupModel>(COL_MESSAGES_GROUPS),
    metricsCollection: () => db.collection<MetricModel>(COL_METRICS),
    navItemsCollection: () => db.collection<NavItemModel>(COL_NAV_ITEMS),
    notSyncedProductsCollection: () =>
      db.collection<NotSyncedProductModel>(COL_NOT_SYNCED_PRODUCTS),
    optionsCollection: () => db.collection<OptionModel>(COL_OPTIONS),
    optionsGroupsCollection: () => db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS),
    ordersCollection: () => db.collection<OrderModel>(COL_ORDERS),
    ordersCustomersCollection: () => db.collection<OrderCustomerModel>(COL_ORDER_CUSTOMERS),
    ordersLogsCollection: () => db.collection<OrderLogModel>(COL_ORDER_LOGS),
    ordersProductsCollection: () => db.collection<OrderProductModel>(COL_ORDER_PRODUCTS),
    orderStatusesCollection: () => db.collection<OrderStatusModel>(COL_ORDER_STATUSES),
    pagesCollection: () => db.collection<PageModel>(COL_PAGES),
    pagesGroupsCollection: () => db.collection<PagesGroupModel>(COL_PAGES_GROUP),
    pagesGroupTemplatesCollection: () =>
      db.collection<PagesGroupTemplateModel>(COL_PAGES_GROUP_TEMPLATES),
    pageTemplatesCollection: () => db.collection<PagesTemplateModel>(COL_PAGE_TEMPLATES),
    productFacetsCollection: () => db.collection<ProductFacetModel>(COL_PRODUCT_FACETS),
    productSummariesCollection: () => db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES),
    promoCollection: () => db.collection<PromoModel>(COL_PROMO),
    promoCodesCollection: () => db.collection<PromoCodeModel>(COL_PROMO_CODES),
    promoProductsCollection: () => db.collection<PromoProductModel>(COL_PROMO_PRODUCTS),
    rolesCollection: () => db.collection<RoleModel>(COL_ROLES),
    roleRulesCollection: () => db.collection<RoleRuleModel>(COL_ROLE_RULES),
    rubricsCollection: () => db.collection<RubricModel>(COL_RUBRICS),
    rubricVariantsCollection: () => db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS),
    seoContentsCollection: () => db.collection<SeoContentModel>(COL_SEO_CONTENTS),
    sessionLogsCollection: () => db.collection<SessionLogModel>(COL_SESSION_LOGS),
    shopsCollection: () => db.collection<ShopModel>(COL_SHOPS),
    shopProductsCollection: () => db.collection<ShopProductModel>(COL_SHOP_PRODUCTS),
    suppliersCollection: () => db.collection<SupplierModel>(COL_SUPPLIERS),
    supplierProductsCollection: () => db.collection<SupplierProductModel>(COL_SUPPLIER_PRODUCTS),
    syncIntersectCollection: () => db.collection<SyncIntersectModel>(COL_SYNC_INTERSECT),
    syncLogsCollection: () => db.collection<SyncLogModel>(COL_SYNC_LOGS),
    tasksCollection: () => db.collection<TaskModel>(COL_TASKS),
    taskVariantsCollection: () => db.collection<TaskVariantModel>(COL_TASK_VARIANTS),
    usersCollection: () => db.collection<UserModel>(COL_USERS),
    userCashbackLogsCollection: () => db.collection<UserCashbackLogModel>(COL_USER_CASHBACK_LOGS),
    userCategoriesCollection: () => db.collection<UserCategoryModel>(COL_USER_CATEGORIES),
    userPaybackLogsCollection: () => db.collection<UserPaybackLogModel>(COL_USER_PAYBACK_LOGS),
  };
}

export async function getDbCollections() {
  const { db, client } = await getDatabase();
  return generateDbCollections({ db, client });
}
