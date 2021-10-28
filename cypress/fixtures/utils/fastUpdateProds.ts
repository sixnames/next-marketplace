import { OrderProductModel, ShopProductModel } from '../../../db/dbModels';
import { COL_ORDER_PRODUCTS, COL_SHOP_PRODUCTS } from '../../../db/collectionNames';
import { dbsConfig, getProdDb } from './getProdDb';
require('dotenv').config();

/*export async function getNextItemId(collectionName: string, db: Db): Promise<string> {
  const idCountersCollection = db.collection<IdCounterModel>(COL_ID_COUNTERS);

  const updatedCounter = await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $inc: {
        counter: ID_COUNTER_STEP,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  );

  if (!updatedCounter.ok || !updatedCounter.value) {
    throw Error(`${collectionName} id counter update error`);
  }

  return `${updatedCounter.value.counter}`;
}*/

type ShopProductBaseInterface = Omit<ShopProductModel, '_id'>;
type OrderProductBaseInterface = Omit<OrderProductModel, '_id'>;

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    const { db, client } = await getProdDb(dbConfig);

    const shopProductsCollection = await db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const orderProductsCollection = await db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
    /*
    const notSyncedProductsCollection = await db.collection<NotSyncedProductModel>(
      COL_NOT_SYNCED_PRODUCTS,
    );*/

    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);

    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ShopProductModel>([
        {
          $group: {
            _id: {
              productId: '$productId',
              shopId: '$shopId',
            },
            available: { $first: '$available' },
            citySlug: { $first: '$citySlug' },
            price: { $first: '$price' },
            oldPrice: { $first: '$oldPrice' },
            oldPrices: { $first: '$oldPrices' },
            discountedPercent: { $first: '$discountedPercent' },
            itemId: { $first: '$itemId' },
            productId: { $first: '$productId' },
            shopId: { $first: '$shopId' },
            companyId: { $first: '$companyId' },
            mainImage: { $first: '$mainImage' },
            useCategoryDiscount: { $first: '$useCategoryDiscount' },
            useCategoryCashback: { $first: '$useCategoryCashback' },
            useCategoryPayFromCashback: { $first: '$useCategoryPayFromCashback' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            priorities: { $first: '$priorities' },
            views: { $first: '$views' },
            supplierSlugs: { $first: '$supplierSlugs' },
            brandSlug: { $first: '$brandSlug' },
            brandCollectionSlug: { $first: '$brandCollectionSlug' },
            rubricId: { $first: '$rubricId' },
            rubricSlug: { $first: '$rubricSlug' },
            manufacturerSlug: { $first: '$manufacturerSlug' },
            selectedOptionsSlugs: { $first: '$selectedOptionsSlugs' },
            barcode: {
              $addToSet: '$barcode',
            },
          },
        },
      ])
      .toArray();
    const shopProducts: ShopProductBaseInterface[] = shopProductsAggregation.map(
      ({ _id, ...shopProduct }) => {
        return {
          ...shopProduct,
          barcode: (shopProduct.barcode || []).filter((code) => code),
        };
      },
    );
    console.log(shopProducts.length);
    console.log('shop products done');

    const orderProductsAggregation = await orderProductsCollection
      .aggregate<OrderProductModel>([
        {
          $group: {
            _id: '$shopProductId',
            itemId: { $first: '$itemId' },
            price: { $first: '$price' },
            amount: { $first: '$amount' },
            totalPrice: { $first: '$totalPrice' },
            slug: { $first: '$slug' },
            originalName: { $first: '$originalName' },
            nameI18n: { $first: '$nameI18n' },
            productId: { $first: '$productId' },
            customerId: { $first: '$customerId' },
            shopProductId: { $first: '$shopProductId' },
            shopId: { $first: '$shopId' },
            companyId: { $first: '$companyId' },
            orderId: { $first: '$orderId' },
            statusId: { $first: '$statusId' },
            isCanceled: { $first: '$isCanceled' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            barcode: {
              $addToSet: '$barcode',
            },
          },
        },
      ])
      .toArray();
    const orderProducts: OrderProductBaseInterface[] = orderProductsAggregation.map(
      ({ _id, ...orderProduct }) => {
        return {
          ...orderProduct,
          barcode: (orderProduct.barcode || []).filter((code) => code),
        };
      },
    );
    console.log(orderProducts.length);
    console.log('order products done');

    console.log(`Done ${dbConfig.dbName} db`);
    console.log(' ');

    // disconnect form db
    await client.close();
  }
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
