import { ONE_WEEK } from '../../../config/common';
import {
  BrandCollectionModel,
  BrandModel,
  CartModel,
  CompanyModel,
  ConfigModel,
  CountryModel,
  ManufacturerModel,
  OptionModel,
  OrderCustomerModel,
  OrderLogModel,
  OrderModel,
  OrderProductModel,
  ProductAssetsModel,
  ProductAttributeModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductModel,
  RubricAttributeModel,
  RubricModel,
  ShopModel,
  ShopProductModel,
  UserModel,
} from '../../../db/dbModels';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CARTS,
  COL_COMPANIES,
  COL_CONFIGS,
  COL_COUNTRIES,
  COL_MANUFACTURERS,
  COL_OPTIONS,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
  COL_ORDERS,
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
} from '../../../db/collectionNames';
import { Db, MongoClient } from 'mongodb';
import path from 'path';
require('dotenv').config();

export interface GetProdDd {
  uri: string;
  dbName: string;
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
  },
  {
    uri: `${process.env.SC_DB_URI}`,
    dbName: `${process.env.SC_DB_NAME}`,
  },
];

export async function updateIndexes(db: Db) {
  // Options
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
  const cartsCollection = db.collection<CartModel>(COL_CARTS);
  const cartIndexExist = await cartsCollection.indexExists('updatedAt_1');
  if (!cartIndexExist) {
    await cartsCollection.createIndex({ updatedAt: 1 }, { expireAfterSeconds: ONE_WEEK });
  }

  // Users
  const usersCollection = db.collection<UserModel>(COL_USERS);
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ roleId: 1 });

  // Brands
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  await brandsCollection.createIndex({ slug: 1 }, { unique: true });
  await brandsCollection.createIndex({
    slug: -1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Brand collections
  const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
  await brandCollectionsCollection.createIndex({ slug: 1 });
  await brandCollectionsCollection.createIndex({ brandId: 1 });
  await brandCollectionsCollection.createIndex({
    slug: -1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Manufacturers
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  await manufacturersCollection.createIndex({ slug: 1 }, { unique: true });
  await manufacturersCollection.createIndex({
    slug: -1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Rubrics
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  await rubricsCollection.createIndex({ slug: 1 }, { unique: true });

  // Rubric attributes
  const rubricAttributesCollection = db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
  await rubricAttributesCollection.createIndex({ rubricId: 1, showInCatalogueFilter: 1 });
  await rubricAttributesCollection.createIndex({ attributeId: 1 });
  await rubricAttributesCollection.createIndex({
    rubricId: 1,
    showInCatalogueNav: 1,
    showInCatalogueFilter: 1,
  });

  // Configs
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  await configsCollection.createIndex({ slug: 1 });
  await configsCollection.createIndex({ companySlug: 1 });
  await configsCollection.createIndex({ companySlug: 1, group: 1 });

  // Countries
  const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
  await countriesCollection.createIndex({ citiesIds: 1 });

  // Companies
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  await companiesCollection.createIndex({ domain: 1 });

  // Shops
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  await shopsCollection.createIndex({ companyId: 1 });
  await shopsCollection.createIndex({ slug: 1 });
  await shopsCollection.createIndex({ name: 1 });
  await shopsCollection.createIndex({ citySlug: 1 });
  await shopsCollection.createIndex({ address: 1 });

  // Shop products
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  await shopProductsCollection.createIndex({
    productId: 1,
    citySlug: 1,
  });

  // catalogue nav
  await shopProductsCollection.createIndex({
    citySlug: 1,
  });
  await shopProductsCollection.createIndex({
    companyId: 1,
    citySlug: 1,
  });

  // catalogue
  // views / priorities sort in main catalogue
  await shopProductsCollection.createIndex({
    rubricId: 1,
    citySlug: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    rubricId: 1,
    citySlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    rubricId: 1,
    citySlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    rubricId: 1,
    citySlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    rubricId: 1,
    citySlug: 1,
    price: 1,
  });

  // views / priorities sort in company catalogue
  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricId: 1,
    citySlug: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricId: 1,
    citySlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricId: 1,
    citySlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricId: 1,
    citySlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricId: 1,
    citySlug: 1,
    price: 1,
  });

  // views / priorities sort in shop catalogue
  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricId: 1,
    citySlug: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricId: 1,
    citySlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricId: 1,
    citySlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricId: 1,
    citySlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricId: 1,
    citySlug: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricId: 1,
    citySlug: 1,
  });

  // catalogue by slug
  // views / priorities sort in main catalogue
  await shopProductsCollection.createIndex({
    rubricSlug: 1,
    citySlug: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    rubricSlug: 1,
    citySlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    rubricSlug: 1,
    citySlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    rubricSlug: 1,
    citySlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    rubricSlug: 1,
    citySlug: 1,
    price: 1,
  });

  // views / priorities sort in company catalogue
  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricSlug: 1,
    citySlug: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricSlug: 1,
    citySlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricSlug: 1,
    citySlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricSlug: 1,
    citySlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    companyId: 1,
    rubricSlug: 1,
    citySlug: 1,
    price: 1,
  });

  // views / priorities sort in shop catalogue
  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricSlug: 1,
    citySlug: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricSlug: 1,
    citySlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricSlug: 1,
    citySlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricSlug: 1,
    citySlug: 1,
    selectedOptionsSlugs: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricSlug: 1,
    citySlug: 1,
    price: 1,
  });

  await shopProductsCollection.createIndex({
    shopId: 1,
    rubricSlug: 1,
    citySlug: 1,
  });

  // product card
  await shopProductsCollection.createIndex({
    slug: 1,
    citySlug: 1,
    companyId: 1,
  });

  // Product connections
  const productConnectionsCollection =
    db.collection<ProductConnectionModel>(COL_PRODUCT_CONNECTIONS);
  await productConnectionsCollection.createIndex({ productsIds: 1 });
  await productConnectionsCollection.createIndex({ attributeId: 1 });
  await productConnectionsCollection.createIndex({ attributeSlug: 1 });

  const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
    COL_PRODUCT_CONNECTION_ITEMS,
  );
  await productConnectionItemsCollection.createIndex({ connectionId: 1, productsId: 1 });
  await productConnectionItemsCollection.createIndex({ productsId: 1 });
  await productConnectionItemsCollection.createIndex({ connectionId: 1, productSlug: 1 });
  await productConnectionItemsCollection.createIndex({ productSlug: 1 });
  await productConnectionItemsCollection.createIndex({ optionId: 1 });

  // Product assets
  const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
  await productAssetsCollection.createIndex({ productId: 1 });
  await productAssetsCollection.createIndex({ productSlug: 1 });

  // Product attributes
  const productAttributesCollection = db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
  await productAttributesCollection.createIndex({ attributeId: 1 });
  await productAttributesCollection.createIndex({ productId: 1 });
  await productAttributesCollection.createIndex({
    productSlug: 1,
    showInCard: 1,
    attributeVariant: 1,
  });
  await productAttributesCollection.createIndex({ productSlug: 1, attributeVariant: 1 });
  await productAttributesCollection.createIndex({ productSlug: 1, showAsBreadcrumb: 1 });
  await productAttributesCollection.createIndex({
    productId: 1,
    showInCard: 1,
    attributeVariant: 1,
  });
  await productAttributesCollection.createIndex({ productId: 1, attributeVariant: 1 });
  await productAttributesCollection.createIndex({ productId: 1, showAsBreadcrumb: 1 });

  // Products
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  await productsCollection.createIndex({ itemId: 1 }, { unique: true });
  await productsCollection.createIndex({ slug: 1 }, { unique: true });
  await productsCollection.createIndex({
    rubricId: 1,
  });

  // >>>>>>>>>>>>>>>>>> Products catalogue
  // views / priorities sort
  await productsCollection.createIndex({
    rubricId: 1,
    active: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    active: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    active: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    active: 1,
    selectedOptionsSlugs: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    active: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // >>>>>>>>>>>>>>>>>> Products without activity
  // views / priorities sort
  await productsCollection.createIndex({
    rubricId: 1,
    brandSlug: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    brandCollectionSlug: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    manufacturerSlug: 1,
    selectedOptionsSlugs: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    selectedOptionsSlugs: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  await productsCollection.createIndex({
    rubricId: 1,
    priorities: -1,
    views: -1,
    _id: -1,
  });

  // Orders
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
  const orderCustomersCollection = db.collection<OrderCustomerModel>(COL_ORDER_CUSTOMERS);
  await orderCustomersCollection.createIndex({ userId: 1, _id: -1 });
  await orderCustomersCollection.createIndex({ orderId: 1, _id: -1 });

  // Orders products
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
  await orderProductsCollection.createIndex({ productId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ shopProductId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ shopId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ companyId: 1, _id: -1 });
  await orderProductsCollection.createIndex({ orderId: 1, _id: -1 });

  // Orders logs
  const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
  await orderLogsCollection.createIndex({ orderId: 1, _id: -1 });
  await orderLogsCollection.createIndex({ userId: 1, _id: -1 });
  await orderLogsCollection.createIndex({ variant: 1, _id: -1 });
}
