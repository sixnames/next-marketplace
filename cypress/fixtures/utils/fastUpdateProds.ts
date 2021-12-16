import { noNaN } from '../../../lib/numbers';
import { Db } from 'mongodb';
import { ID_COUNTER_STEP } from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_ID_COUNTERS, COL_ORDER_PRODUCTS, COL_ORDERS } from '../../../db/collectionNames';
import { IdCounterModel, OrderModel, OrderProductModel } from '../../../db/dbModels';
require('dotenv').config();

interface GetOrderDiscountedPriceInterface {
  giftCertificateDiscount?: number | null;
  promoCodeDiscount?: number | null;
  totalPrice: number;
}

interface GetOrderDiscountedPricePayloadInterface {
  giftCertificateNewValue: number;
  giftCertificateChargedValue: number;
  discountedPrice: number;
  isDiscounted: boolean;
  discount: number;
}

function getOrderDiscountedPrice({
  totalPrice,
  ...props
}: GetOrderDiscountedPriceInterface): GetOrderDiscountedPricePayloadInterface {
  const giftCertificateDiscount = noNaN(props.giftCertificateDiscount);
  const promoCodeDiscount = noNaN(props.promoCodeDiscount);

  const discount = giftCertificateDiscount + promoCodeDiscount;
  const isDiscounted = discount > 0;

  const rawDiscountedPrice = noNaN(totalPrice) - discount;
  const discountedPrice = rawDiscountedPrice < 0 ? 0 : rawDiscountedPrice;

  const giftCertificateRawNewValue = giftCertificateDiscount - totalPrice;
  const giftCertificateNewValue = giftCertificateRawNewValue < 0 ? 0 : giftCertificateRawNewValue;
  const giftCertificateChargedValue =
    giftCertificateNewValue === 0
      ? giftCertificateDiscount
      : giftCertificateDiscount - giftCertificateNewValue;

  return {
    giftCertificateNewValue,
    giftCertificateChargedValue,
    discountedPrice,
    isDiscounted,
    discount,
  };
}

export async function getFastNextNumberItemId(collectionName: string, db: Db): Promise<string> {
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
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
    const ordersCollection = db.collection<OrderModel>(COL_ORDERS);

    const orders = await ordersCollection.find({}).toArray();
    for await (const order of orders) {
      const updatedOrderProducts = await orderProductsCollection
        .find({
          orderId: order._id,
        })
        .toArray();

      const totalPrice = updatedOrderProducts.reduce((acc: number, { isCanceled, totalPrice }) => {
        if (isCanceled) {
          return acc;
        }
        return acc + totalPrice;
      }, 0);
      const { discountedPrice } = getOrderDiscountedPrice({
        totalPrice,
        giftCertificateDiscount: noNaN(order.giftCertificateChargedValue),
      });

      console.log({
        discountedPrice,
        totalPrice,
      });
    }

    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
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
