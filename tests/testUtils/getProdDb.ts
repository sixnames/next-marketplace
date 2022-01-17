import { ONE_WEEK } from '../../config/common';
import {
  AttributeModel,
  BlogAttributeModel,
  BrandCollectionModel,
  BrandModel,
  CartModel,
  CategoryModel,
  CityModel,
  CompanyModel,
  ConfigModel,
  ManufacturerModel,
  OptionModel,
  OrderCustomerModel,
  OrderLogModel,
  OrderModel,
  OrderProductModel,
  RubricModel,
  ShopModel,
  SupplierModel,
  UserModel,
  UserCategoryModel,
  PromoModel,
  PromoProductModel,
  SupplierProductModel,
  SeoContentModel,
  BlackListProductModel,
  PromoCodeModel,
  GiftCertificateModel,
  UserPaybackLogModel,
  UserCashbackLogModel,
  ShopProductModel,
  ProductFacetModel,
  ProductSummaryModel,
  CatalogueNavModel,
} from '../../db/dbModels';
import {
  COL_ATTRIBUTES,
  COL_BLACKLIST_PRODUCTS,
  COL_BLOG_ATTRIBUTES,
  COL_BLOG_POSTS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CARTS,
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
  COL_PROMO,
  COL_PROMO_CODES,
  COL_PROMO_PRODUCTS,
  COL_RUBRICS,
  COL_SEO_CONTENTS,
  COL_SHOPS,
  COL_SUPPLIER_PRODUCTS,
  COL_SUPPLIERS,
  COL_USER_CASHBACK_LOGS,
  COL_USER_CATEGORIES,
  COL_USER_PAYBACK_LOGS,
  COL_USERS,
  COL_SHOP_PRODUCTS,
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_CATALOGUE_NAV,
} from '../../db/collectionNames';
import { Db, MongoClient } from 'mongodb';
import path from 'path';
require('dotenv').config();

export interface GetProdDd {
  uri: string;
  dbName: string;
  algoliaProductsIndexName: string;
}

export async function getProdDb({ uri, dbName }: GetProdDd) {
  const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: dbName,
    tls: true,
    tlsCAFile,
    replicaSet: process.env.MONGO_DB_RS,
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
];

export async function updateIndexes(db: Db) {
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
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  await optionsCollection.createIndex({ slug: 1 }, { unique: true });
  await optionsCollection.createIndex({ parentId: 1, priorities: -1, views: -1, _id: -1 });
  await optionsCollection.createIndex({
    optionsGroupId: 1,
    parentId: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });
  await optionsCollection.createIndex({
    optionsGroupId: 1,
    slug: 1,
    parentId: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Carts
  await createCollectionIfNotExist(COL_CARTS);
  const cartsCollection = db.collection<CartModel>(COL_CARTS);
  const cartIndexExist = await cartsCollection.indexExists('updatedAt_1');
  if (!cartIndexExist) {
    await cartsCollection.createIndex({ updatedAt: 1 }, { expireAfterSeconds: ONE_WEEK });
  }

  // Seo contents
  await createCollectionIfNotExist(COL_SEO_CONTENTS);
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);
  await seoContentsCollection.createIndex({ slug: 1 }, { unique: true });
  await seoContentsCollection.createIndex({ companySlug: 1, rubricSlug: 1, content: 1 });

  // Blacklist
  await createCollectionIfNotExist(COL_BLACKLIST_PRODUCTS);
  const blacklistProductsCollection = db.collection<BlackListProductModel>(COL_BLACKLIST_PRODUCTS);
  await blacklistProductsCollection.createIndex({ shopId: 1 });
  await blacklistProductsCollection.createIndex({ shopProductId: 1 });

  // Users
  await createCollectionIfNotExist(COL_USERS);
  const usersCollection = db.collection<UserModel>(COL_USERS);
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ roleId: 1 });

  // User categories
  await createCollectionIfNotExist(COL_USER_CATEGORIES);
  const userCategoriesCollection = db.collection<UserCategoryModel>(COL_USER_CATEGORIES);
  await userCategoriesCollection.createIndex({ companyId: 1 });

  // Brands
  await createCollectionIfNotExist(COL_BRANDS);
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  await brandsCollection.createIndex({ itemId: 1 }, { unique: true });
  await brandsCollection.createIndex({
    itemId: -1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Brand collections
  await createCollectionIfNotExist(COL_BRAND_COLLECTIONS);
  const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
  await brandCollectionsCollection.createIndex({ itemId: 1 }, { unique: true });
  await brandCollectionsCollection.createIndex({ brandId: 1 });
  await brandCollectionsCollection.createIndex({
    itemId: -1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Manufacturers
  await createCollectionIfNotExist(COL_MANUFACTURERS);
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  await manufacturersCollection.createIndex({ itemId: 1 }, { unique: true });
  await manufacturersCollection.createIndex({
    itemId: -1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Suppliers
  await createCollectionIfNotExist(COL_SUPPLIERS);
  const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
  await suppliersCollection.createIndex({ itemId: 1 }, { unique: true });
  await suppliersCollection.createIndex({
    itemId: -1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Supplier products
  await createCollectionIfNotExist(COL_SUPPLIER_PRODUCTS);
  const supplierProductsCollection = db.collection<SupplierProductModel>(COL_SUPPLIER_PRODUCTS);
  await supplierProductsCollection.createIndex({ supplierId: 1, shopProductId: 1, price: -1 });
  await supplierProductsCollection.createIndex({ shopProductId: 1, price: -1 });
  await supplierProductsCollection.createIndex({ companySlug: 1, shopId: 1, price: -1 });
  await supplierProductsCollection.createIndex({ companyId: 1, shopId: 1, price: -1 });
  await supplierProductsCollection.createIndex({ shopId: 1, price: -1 });

  // Blog posts
  await createCollectionIfNotExist(COL_BLOG_POSTS);
  const blogPostsCollection = db.collection<BlogAttributeModel>(COL_BLOG_POSTS);
  await blogPostsCollection.createIndex({ companySlug: 1, slug: 1 }, { unique: true });
  await blogPostsCollection.createIndex({
    companySlug: 1,
    state: 1,
    filterSlugs: 1,
    priorities: -1,
    views: -1,
    createdAt: -1,
  });
  await blogPostsCollection.createIndex({
    companySlug: 1,
    state: 1,
    priorities: -1,
    views: -1,
    createdAt: -1,
  });

  // Blog attributes
  await createCollectionIfNotExist(COL_BLOG_ATTRIBUTES);
  const blogAttributesCollection = db.collection<BlogAttributeModel>(COL_BLOG_ATTRIBUTES);
  await blogAttributesCollection.createIndex({ slug: 1 }, { unique: true });

  // User Cashback Log
  await createCollectionIfNotExist(COL_USER_PAYBACK_LOGS);
  const userCashbackLogsCollection = db.collection<UserCashbackLogModel>(COL_USER_CASHBACK_LOGS);
  await userCashbackLogsCollection.createIndex({ userId: 1, createdAt: 1 });
  await userCashbackLogsCollection.createIndex({ companyId: 1, userId: 1, createdAt: 1 });
  await userCashbackLogsCollection.createIndex({ companyId: 1, createdAt: 1 });
  await userCashbackLogsCollection.createIndex({ orderId: 1, createdAt: 1 });
  await userCashbackLogsCollection.createIndex({ creatorId: 1, createdAt: 1 });

  // User Payback Log
  await createCollectionIfNotExist(COL_USER_PAYBACK_LOGS);
  const userPaybackLogsCollection = db.collection<UserPaybackLogModel>(COL_USER_PAYBACK_LOGS);
  await userPaybackLogsCollection.createIndex({ userId: 1, createdAt: 1 });
  await userPaybackLogsCollection.createIndex({ companyId: 1, userId: 1, createdAt: 1 });
  await userPaybackLogsCollection.createIndex({ companyId: 1, createdAt: 1 });
  await userPaybackLogsCollection.createIndex({ orderId: 1, createdAt: 1 });
  await userPaybackLogsCollection.createIndex({ creatorId: 1, createdAt: 1 });

  // Gift Certificate
  await createCollectionIfNotExist(COL_GIFT_CERTIFICATES);
  const giftCertificatesCollection = db.collection<GiftCertificateModel>(COL_GIFT_CERTIFICATES);
  await giftCertificatesCollection.createIndex({ userId: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ companyId: 1, userId: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ companyId: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ companySlug: 1, userId: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ companySlug: 1, createdAt: 1 });
  await giftCertificatesCollection.createIndex({ code: 1, companyId: 1 }, { unique: true });

  // Promo
  await createCollectionIfNotExist(COL_PROMO);
  const promoCollection = db.collection<PromoModel>(COL_PROMO);
  await promoCollection.createIndex({ slug: 1 }, { unique: true });
  await promoCollection.createIndex({ shopId: 1 });
  await promoCollection.createIndex({ companyId: 1, shopId: 1 });

  // Promo codes
  await createCollectionIfNotExist(COL_PROMO_CODES);
  const promoCodesCollection = db.collection<PromoCodeModel>(COL_PROMO_CODES);
  await promoCodesCollection.createIndex({ companyId: 1 });
  await promoCodesCollection.createIndex({ companySlug: 1 });
  await promoCodesCollection.createIndex({ promoId: 1 });
  await promoCodesCollection.createIndex({ promoterId: 1 });
  await promoCodesCollection.createIndex({ code: 1, companyId: 1 }, { unique: true });

  // Promo products
  await createCollectionIfNotExist(COL_PROMO_PRODUCTS);
  const promoProductsCollection = db.collection<PromoProductModel>(COL_PROMO_PRODUCTS);
  await promoProductsCollection.createIndex({ promoId: 1 });
  await promoProductsCollection.createIndex({ shopId: 1 });
  await promoProductsCollection.createIndex({ companyId: 1 });
  await promoProductsCollection.createIndex({ shopProductId: 1 });
  await promoProductsCollection.createIndex({ productId: 1 });

  // Rubrics
  await createCollectionIfNotExist(COL_RUBRICS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  await rubricsCollection.createIndex({ slug: 1 }, { unique: true });

  // Categories
  await createCollectionIfNotExist(COL_CATEGORIES);
  const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
  await categoriesCollection.createIndex({ slug: 1 }, { unique: true });
  await categoriesCollection.createIndex({ rubricId: 1 });
  await categoriesCollection.createIndex({ rubricId: 1, parentId: 1 });

  // Attributes
  await createCollectionIfNotExist(COL_ATTRIBUTES);
  const rubricAttributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  await rubricAttributesCollection.createIndex({ attributesGroupId: 1, slug: 1 });
  await rubricAttributesCollection.createIndex({ attributesGroupId: 1 });

  // Configs
  await createCollectionIfNotExist(COL_CONFIGS);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  await configsCollection.createIndex({ slug: 1 });
  await configsCollection.createIndex({ companySlug: 1 });
  await configsCollection.createIndex({ companySlug: 1, group: 1 });

  // Cities
  await createCollectionIfNotExist(COL_CITIES);
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  await citiesCollection.createIndex({ slug: 1 });
  await citiesCollection.createIndex({ countryId: 1 });

  // Companies
  await createCollectionIfNotExist(COL_COMPANIES);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  await companiesCollection.createIndex({ domain: 1 });

  // Shops
  await createCollectionIfNotExist(COL_SHOPS);
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  await shopsCollection.createIndex({ companyId: 1 });
  await shopsCollection.createIndex({ slug: 1 });
  await shopsCollection.createIndex({ name: 1 });
  await shopsCollection.createIndex({ citySlug: 1 });
  await shopsCollection.createIndex({ address: 1 });

  // Orders
  await createCollectionIfNotExist(COL_ORDERS);
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
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
  const orderCustomersCollection = db.collection<OrderCustomerModel>(COL_ORDER_CUSTOMERS);
  await orderCustomersCollection.createIndex({ userId: 1, _id: -1 });
  await orderCustomersCollection.createIndex({ orderId: 1, _id: -1 });

  // Orders products
  await createCollectionIfNotExist(COL_ORDER_PRODUCTS);
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
  await orderProductsCollection.createIndex({ productId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ shopProductId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ shopId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ companyId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ orderId: 1, _id: -1 });

  // Orders logs
  await createCollectionIfNotExist(COL_ORDER_LOGS);
  const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
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
  const catalogueNavCollection = db.collection<CatalogueNavModel>(COL_CATALOGUE_NAV);
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
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

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
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  await productFacetsCollection.createIndex(productsFilterFull);
  await productFacetsCollection.createIndex(productsFilterNoBrandCollection);
  await productFacetsCollection.createIndex(productsFilterWithBrandNoFilters);
  await productFacetsCollection.createIndex(productsFilterNoBrand);
  await productFacetsCollection.createIndex(productsFilterNoFilters);

  // Summaries
  await createCollectionIfNotExist(COL_PRODUCT_SUMMARIES);
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  await productSummariesCollection.createIndex(
    {
      slug: 1,
    },
    {
      unique: true,
    },
  );
}