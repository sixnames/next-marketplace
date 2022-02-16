import {
  COL_ATTRIBUTES,
  COL_BLACKLIST_PRODUCTS,
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_POSTS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CARTS,
  COL_CATALOGUE_NAV,
  COL_CATEGORIES,
  COL_CITIES,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_GIFT_CERTIFICATES,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
  COL_ORDERS,
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_PROMO,
  COL_PROMO_CODES,
  COL_PROMO_PRODUCTS,
  COL_RUBRICS,
  COL_SEO_CONTENTS,
  COL_SESSION_LOGS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_SUPPLIER_PRODUCTS,
  COL_SUPPLIERS,
  COL_TASK_VARIANTS,
  COL_TASKS,
  COL_USER_CATEGORIES,
  COL_USER_PAYBACK_LOGS,
  COL_USERS,
} from 'db/collectionNames';
import { generateDbCollections } from 'db/mongodb';
import { ISR_ONE_WEEK, ISR_SIX_MONTHS } from 'lib/config/common';
import { Db, MongoClient } from 'mongodb';
import path from 'path';

require('dotenv').config();

export interface GetProdDd {
  uri: string;
  dbName: string;
  algoliaProductsIndexName?: string;
}

export async function getProdDb({ uri, dbName }: GetProdDd) {
  const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

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
    authSource: dbName,
    ...sslOptions,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // authSource: dbName,
    // tls: true,
    // tlsCAFile,
    // replicaSet: process.env.MONGO_DB_RS,
  };

  // Create connection
  const client = await MongoClient.connect(uri, options);
  // Select the database through the connection
  return {
    db: client.db(dbName),
    client,
  };
}

export const dbsConfig: GetProdDd[] = [
  {
    uri: `${process.env.WP_DB_URI}`,
    dbName: `${process.env.WP_DB_NAME}`,
    algoliaProductsIndexName: `${process.env.WP_ALGOLIA_PRODUCTS_INDEX_NAME}`,
  },
  {
    uri: `${process.env.TFJ_DB_URI}`,
    dbName: `${process.env.TFJ_DB_NAME}`,
    algoliaProductsIndexName: `${process.env.TFJ_ALGOLIA_PRODUCTS_INDEX_NAME}`,
  },
  {
    uri: `${process.env.AG_DB_URI}`,
    dbName: `${process.env.AG_DB_NAME}`,
    algoliaProductsIndexName: `${process.env.AG_ALGOLIA_PRODUCTS_INDEX_NAME}`,
  },
  /*{
    uri: `${process.env.OLD_DB_URI}`,
    dbName: `${process.env.OLD_DB_NAME}`,
    algoliaProductsIndexName: `${process.env.OLD_ALGOLIA_PRODUCTS_INDEX_NAME}`,
  },*/
];

export async function updateIndexes(db: Db, client: MongoClient) {
  const collections = generateDbCollections({ db, client });

  async function createCollectionIfNotExist(name: string) {
    const collectionsResult = await db
      .listCollections(
        {
          name,
        },
        {
          nameOnly: true,
        },
      )
      .toArray();
    const collection = collectionsResult[0];
    if (!collection) {
      await db.createCollection(name);
    }
  }

  // Options
  await createCollectionIfNotExist(COL_OPTIONS);
  const optionsCollection = collections.optionsCollection();
  await optionsCollection.createIndex({ slug: 1 }, { unique: true });
  await optionsCollection.createIndex({ parentId: 1, views: -1, _id: -1 });
  await optionsCollection.createIndex({
    optionsGroupId: 1,
    parentId: 1,
    views: -1,
    _id: -1,
  });
  await optionsCollection.createIndex({
    optionsGroupId: 1,
    slug: 1,
    parentId: 1,
    views: -1,
    _id: -1,
  });

  // Logs
  await createCollectionIfNotExist(COL_SESSION_LOGS);
  const sessionLogsCollection = collections.sessionLogsCollection();
  await sessionLogsCollection.createIndex({ companySlug: 1, citySlug: 1 });
  await sessionLogsCollection.createIndex({ userId: 1 });

  // Carts
  await createCollectionIfNotExist(COL_CARTS);
  const cartsCollection = collections.cartsCollection();
  await cartsCollection.createIndex({ updatedAt: 1 }, { expireAfterSeconds: ISR_ONE_WEEK });

  // Tasks
  await createCollectionIfNotExist(COL_TASKS);
  const tasksCollection = collections.tasksCollection();
  await tasksCollection.createIndex({
    companySlug: 1,
    variantId: 1,
    stateEnum: 1,
    createdAt: 1,
    _id: 1,
  });
  await tasksCollection.createIndex({ companySlug: 1, stateEnum: 1, createdAt: 1, _id: 1 });
  await tasksCollection.createIndex({ companySlug: 1, createdAt: 1, _id: 1 });

  // Task variants
  await createCollectionIfNotExist(COL_TASK_VARIANTS);
  const taskVariantsCollection = collections.taskVariantsCollection();
  await taskVariantsCollection.createIndex({ companySlug: 1, _id: 1 });

  // Seo contents
  await createCollectionIfNotExist(COL_SEO_CONTENTS);
  const seoContentsCollection = collections.seoContentsCollection();
  await seoContentsCollection.createIndex({ slug: 1 }, { unique: true });
  await seoContentsCollection.createIndex({ companySlug: 1, rubricSlug: 1, content: 1 });

  // Blacklist
  await createCollectionIfNotExist(COL_BLACKLIST_PRODUCTS);
  const blacklistProductsCollection = collections.blackListProductsCollection();
  await blacklistProductsCollection.createIndex({ shopId: 1 });
  await blacklistProductsCollection.createIndex({ shopProductId: 1 });

  // Users
  await createCollectionIfNotExist(COL_USERS);
  const usersCollection = collections.usersCollection();
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ roleId: 1 });

  // User categories
  await createCollectionIfNotExist(COL_USER_CATEGORIES);
  const userCategoriesCollection = collections.userCategoriesCollection();
  await userCategoriesCollection.createIndex({ companyId: 1 });

  // Brands
  await createCollectionIfNotExist(COL_BRANDS);
  const brandsCollection = collections.brandsCollection();
  await brandsCollection.createIndex({ itemId: 1 }, { unique: true });
  await brandsCollection.createIndex({
    itemId: -1,
    views: -1,
    _id: -1,
  });

  // Brand collections
  await createCollectionIfNotExist(COL_BRAND_COLLECTIONS);
  const brandCollectionsCollection = collections.brandCollectionsCollection();
  await brandCollectionsCollection.createIndex({ itemId: 1 }, { unique: true });
  await brandCollectionsCollection.createIndex({ brandId: 1 });
  await brandCollectionsCollection.createIndex({
    itemId: -1,
    views: -1,
    _id: -1,
  });

  // Manufacturers
  await createCollectionIfNotExist(COL_MANUFACTURERS);
  const manufacturersCollection = collections.manufacturersCollection();
  await manufacturersCollection.createIndex({ itemId: 1 }, { unique: true });
  await manufacturersCollection.createIndex({
    itemId: -1,
    views: -1,
    _id: -1,
  });

  // Suppliers
  await createCollectionIfNotExist(COL_SUPPLIERS);
  const suppliersCollection = collections.suppliersCollection();
  await suppliersCollection.createIndex({ itemId: 1 }, { unique: true });
  await suppliersCollection.createIndex({
    itemId: -1,
    views: -1,
    _id: -1,
  });

  // Supplier products
  await createCollectionIfNotExist(COL_SUPPLIER_PRODUCTS);
  const supplierProductsCollection = collections.supplierProductsCollection();
  await supplierProductsCollection.createIndex({ supplierId: 1, shopProductId: 1, price: -1 });
  await supplierProductsCollection.createIndex({ shopProductId: 1, price: -1 });
  await supplierProductsCollection.createIndex({ companySlug: 1, shopId: 1, price: -1 });
  await supplierProductsCollection.createIndex({ companyId: 1, shopId: 1, price: -1 });
  await supplierProductsCollection.createIndex({ shopId: 1, price: -1 });

  // Blog posts
  await createCollectionIfNotExist(COL_BLOG_POSTS);
  const blogPostsCollection = collections.blogPostsCollection();
  await blogPostsCollection.createIndex({ companySlug: 1, slug: 1 }, { unique: true });
  await blogPostsCollection.createIndex({
    companySlug: 1,
    state: 1,
    filterSlugs: 1,
    views: -1,
    createdAt: -1,
  });
  await blogPostsCollection.createIndex({
    companySlug: 1,
    state: 1,
    views: -1,
    createdAt: -1,
  });

  // Blog attributes
  await createCollectionIfNotExist(COL_BLOG_ATTRIBUTES);
  const blogAttributesCollection = collections.blogAttributesCollection();
  await blogAttributesCollection.createIndex({ slug: 1 }, { unique: true });

  // User Cashback Log
  await createCollectionIfNotExist(COL_USER_PAYBACK_LOGS);
  const userCashbackLogsCollection = collections.userCashbackLogsCollection();
  await userCashbackLogsCollection.createIndex({ userId: 1, createdAt: 1 });
  await userCashbackLogsCollection.createIndex({ companyId: 1, userId: 1, createdAt: 1 });
  await userCashbackLogsCollection.createIndex({ companyId: 1, createdAt: 1 });
  await userCashbackLogsCollection.createIndex({ orderId: 1, createdAt: 1 });
  await userCashbackLogsCollection.createIndex({ creatorId: 1, createdAt: 1 });

  // User Payback Log
  await createCollectionIfNotExist(COL_USER_PAYBACK_LOGS);
  const userPaybackLogsCollection = collections.userPaybackLogsCollection();
  await userPaybackLogsCollection.createIndex({ userId: 1, createdAt: 1 });
  await userPaybackLogsCollection.createIndex({ companyId: 1, userId: 1, createdAt: 1 });
  await userPaybackLogsCollection.createIndex({ companyId: 1, createdAt: 1 });
  await userPaybackLogsCollection.createIndex({ orderId: 1, createdAt: 1 });
  await userPaybackLogsCollection.createIndex({ creatorId: 1, createdAt: 1 });

  // Gift Certificate
  await createCollectionIfNotExist(COL_GIFT_CERTIFICATES);
  const giftCertificatesCollection = collections.giftCertificatesCollection();
  await giftCertificatesCollection.createIndex({ userId: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ companyId: 1, userId: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ companyId: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ companySlug: 1, userId: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ companySlug: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ code: 1, companyId: 1 }, { unique: true });

  // Promo
  await createCollectionIfNotExist(COL_PROMO);
  const promoCollection = collections.promoCollection();
  await promoCollection.createIndex({ slug: 1 }, { unique: true });
  await promoCollection.createIndex({ shopId: 1 });
  await promoCollection.createIndex({ companyId: 1, shopId: 1 });

  // Promo codes
  await createCollectionIfNotExist(COL_PROMO_CODES);
  const promoCodesCollection = collections.promoCodesCollection();
  await promoCodesCollection.createIndex({ companyId: 1 });
  await promoCodesCollection.createIndex({ companySlug: 1 });
  await promoCodesCollection.createIndex({ promoId: 1 });
  await promoCodesCollection.createIndex({ promoterId: 1 });
  await promoCodesCollection.createIndex({ code: 1, companyId: 1 }, { unique: true });

  // Promo products
  await createCollectionIfNotExist(COL_PROMO_PRODUCTS);
  const promoProductsCollection = collections.promoProductsCollection();
  await promoProductsCollection.createIndex({ promoId: 1 });
  await promoProductsCollection.createIndex({ shopId: 1 });
  await promoProductsCollection.createIndex({ companyId: 1 });
  await promoProductsCollection.createIndex({ shopProductId: 1 });
  await promoProductsCollection.createIndex({ productId: 1 });
  await promoProductsCollection.createIndex({ endAt: 1 }, { expireAfterSeconds: ISR_SIX_MONTHS });

  // Rubrics
  await createCollectionIfNotExist(COL_RUBRICS);
  const rubricsCollection = collections.rubricsCollection();
  await rubricsCollection.createIndex({ slug: 1 }, { unique: true });

  // Categories
  await createCollectionIfNotExist(COL_CATEGORIES);
  const categoriesCollection = collections.categoriesCollection();
  await categoriesCollection.createIndex({ slug: 1 }, { unique: true });
  await categoriesCollection.createIndex({ rubricId: 1 });
  await categoriesCollection.createIndex({ rubricId: 1, parentId: 1 });

  // Attributes
  await createCollectionIfNotExist(COL_ATTRIBUTES);
  const rubricAttributesCollection = collections.attributesCollection();
  await rubricAttributesCollection.createIndex({ attributesGroupId: 1, slug: 1 });
  await rubricAttributesCollection.createIndex({ attributesGroupId: 1 });

  // Configs
  await createCollectionIfNotExist(COL_CONFIGS);
  const configsCollection = collections.configsCollection();
  await configsCollection.createIndex({ slug: 1 });
  await configsCollection.createIndex({ companySlug: 1 });
  await configsCollection.createIndex({ companySlug: 1, group: 1 });

  // Cities
  await createCollectionIfNotExist(COL_CITIES);
  const citiesCollection = collections.citiesCollection();
  await citiesCollection.createIndex({ slug: 1 });
  await citiesCollection.createIndex({ countryId: 1 });

  // Companies
  await createCollectionIfNotExist(COL_COMPANIES);
  const companiesCollection = collections.companiesCollection();
  await companiesCollection.createIndex({ domain: 1 });

  // Shops
  await createCollectionIfNotExist(COL_SHOPS);
  const shopsCollection = collections.shopsCollection();
  await shopsCollection.createIndex({ companyId: 1 });
  await shopsCollection.createIndex({ slug: 1 });
  await shopsCollection.createIndex({ name: 1 });
  await shopsCollection.createIndex({ citySlug: 1 });
  await shopsCollection.createIndex({ address: 1 });

  // Orders
  await createCollectionIfNotExist(COL_ORDERS);
  const ordersCollection = collections.ordersCollection();
  await ordersCollection.createIndex({ userId: 1, _id: -1 });
  await ordersCollection.createIndex({ customerId: 1, _id: -1 });
  await ordersCollection.createIndex({ productIds: 1, _id: -1 });
  await ordersCollection.createIndex({ shopProductIds: 1, _id: -1 });
  await ordersCollection.createIndex({ shopIds: 1, _id: -1 });
  await ordersCollection.createIndex({ companyIds: 1, _id: -1 });
  await ordersCollection.createIndex({ companySlug: 1, userId: 1, _id: -1 });
  await ordersCollection.createIndex({ companySlug: 1, customerId: 1, _id: -1 });
  await ordersCollection.createIndex({ companySlug: 1, productIds: 1, _id: -1 });
  await ordersCollection.createIndex({ companySlug: 1, shopProductIds: 1, _id: -1 });
  await ordersCollection.createIndex({ companySlug: 1, shopIds: 1, _id: -1 });
  await ordersCollection.createIndex({ companySlug: 1, companyIds: 1, _id: -1 });

  // Orders customer
  await createCollectionIfNotExist(COL_ORDER_CUSTOMERS);
  const ordersCustomersCollection = collections.ordersCustomersCollection();
  await ordersCustomersCollection.createIndex({ userId: 1, _id: -1 });
  await ordersCustomersCollection.createIndex({ orderId: 1, _id: -1 });

  // Orders products
  await createCollectionIfNotExist(COL_ORDER_PRODUCTS);
  const orderProductsCollection = collections.ordersProductsCollection();
  await orderProductsCollection.createIndex({ productId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ shopProductId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ shopId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ companyId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ orderId: 1, _id: -1 });

  // Orders logs
  await createCollectionIfNotExist(COL_ORDER_LOGS);
  const orderLogsCollection = collections.ordersLogsCollection();
  await orderLogsCollection.createIndex({ orderId: 1, _id: -1 });
  await orderLogsCollection.createIndex({ userId: 1, _id: -1 });
  await orderLogsCollection.createIndex({ variant: 1, _id: -1 });

  // product filters
  const productsFilterFull = {
    rubricSlug: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    filterSlugs: 1,
    mainImage: 1,
  };
  const productsFilterNoBrandCollection = {
    rubricSlug: 1,
    brandSlug: 1,
    filterSlugs: 1,
    mainImage: 1,
  };
  const productsFilterWithBrandNoFilters = {
    rubricSlug: 1,
    brandSlug: 1,
    mainImage: 1,
  };
  const productsFilterNoBrand = {
    rubricSlug: 1,
    filterSlugs: 1,
    mainImage: 1,
  };
  const productsFilterNoFilters = {
    rubricSlug: 1,
    mainImage: 1,
  };

  // Catalogue nav
  await createCollectionIfNotExist(COL_CATALOGUE_NAV);
  const catalogueNavCollection = collections.catalogueNavCollection();
  await catalogueNavCollection.createIndex(
    {
      companySlug: 1,
      citySlug: 1,
    },
    {
      unique: true,
    },
  );

  // Shop products
  await createCollectionIfNotExist(COL_SHOP_PRODUCTS);
  const shopProductsCollection = collections.shopProductsCollection();

  // card for company domain
  await shopProductsCollection.createIndex({
    companyId: 1,
    citySlug: 1,
    productId: 1,
    mainImage: 1,
  });

  // card for main domain
  await shopProductsCollection.createIndex({
    citySlug: 1,
    productId: 1,
    mainImage: 1,
  });

  // catalogue for company domain
  await shopProductsCollection.createIndex({
    companyId: 1,
    citySlug: 1,
    ...productsFilterFull,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    companyId: 1,
    citySlug: 1,
    ...productsFilterNoBrandCollection,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    companyId: 1,
    citySlug: 1,
    ...productsFilterWithBrandNoFilters,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    companyId: 1,
    citySlug: 1,
    ...productsFilterNoBrand,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    companyId: 1,
    citySlug: 1,
    ...productsFilterNoFilters,
    price: 1,
  });

  // catalogue for main domain
  await shopProductsCollection.createIndex({
    citySlug: 1,
    ...productsFilterFull,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    citySlug: 1,
    ...productsFilterNoBrandCollection,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    citySlug: 1,
    ...productsFilterWithBrandNoFilters,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    citySlug: 1,
    ...productsFilterNoBrand,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    citySlug: 1,
    ...productsFilterNoFilters,
    price: 1,
  });

  // cms for shop
  await shopProductsCollection.createIndex({
    shopId: 1,
    ...productsFilterFull,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    shopId: 1,
    ...productsFilterNoBrandCollection,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    shopId: 1,
    ...productsFilterWithBrandNoFilters,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    shopId: 1,
    ...productsFilterNoBrand,
    price: 1,
  });
  await shopProductsCollection.createIndex({
    shopId: 1,
    ...productsFilterNoFilters,
    price: 1,
  });

  // Facets
  await createCollectionIfNotExist(COL_PRODUCT_FACETS);
  const productFacetsCollection = collections.productFacetsCollection();
  await productFacetsCollection.createIndex(productsFilterFull);
  await productFacetsCollection.createIndex(productsFilterNoBrandCollection);
  await productFacetsCollection.createIndex(productsFilterWithBrandNoFilters);
  await productFacetsCollection.createIndex(productsFilterNoBrand);
  await productFacetsCollection.createIndex(productsFilterNoFilters);

  // Summaries
  await createCollectionIfNotExist(COL_PRODUCT_SUMMARIES);
  const productSummariesCollection = collections.productSummariesCollection();
  await productSummariesCollection.createIndex(
    {
      slug: 1,
    },
    {
      unique: true,
    },
  );
}
