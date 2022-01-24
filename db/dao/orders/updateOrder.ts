import { detailedDiff } from 'deep-object-diff';
import { ObjectId } from 'mongodb';
import { get } from 'lodash';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { noNaN } from '../../../lib/numbers';
import { countDiscountedPrice, getOrderDiscountedPrice } from '../../../lib/priceUtils';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { castDbData } from '../../../lib/ssrUtils';
import { COL_ORDER_LOGS, COL_ORDER_PRODUCTS, COL_ORDERS } from '../../collectionNames';
import {
  ObjectIdModel,
  DiffModel,
  OrderLogModel,
  OrderModel,
  OrderProductModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface, OrderInterface, OrderInterfacePayloadModel } from '../../uiInterfaces';
import { getConsoleOrder } from './getConsoleOrder';

export interface UpdateOrderInterface {
  order: OrderInterface;
}

export async function updateOrder({
  context,
  input,
}: DaoPropsInterface<UpdateOrderInterface>): Promise<OrderInterfacePayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);

  const session = client.startSession();

  let mutationPayload: OrderInterfacePayloadModel = {
    success: false,
    message: await getApiMessage('orders.updateOrder.error'),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // permission
      const { allow, message, user } = await getOperationPermission({
        context,
        slug: 'updateOrder',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }
      if (!user) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      const { order } = input;
      const orderId = new ObjectId(order._id);

      // get prev order state
      const prevOrder = await getConsoleOrder({
        locale,
        orderId: order._id,
      });
      if (!prevOrder) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // get diff
      const prevOrderState = castDbData(prevOrder.order);
      const diff = detailedDiff(prevOrderState, order) as DiffModel;
      // console.log(JSON.stringify(diff, null, 2));

      // create order log
      const orderLog: OrderLogModel = {
        _id: new ObjectId(),
        orderId: order._id,
        userId: user._id,
        diff,
        logUser: {
          name: user.name,
          lastName: user.lastName,
          secondName: user.secondName,
          email: user.email,
          phone: user.phone,
        },
        createdAt: new Date(),
      };
      await orderLogsCollection.insertOne(orderLog);

      // update order products
      let updatedProducts = get(diff, 'updated.products') || {};
      const addedProducts = get(diff, 'added.products') || {};
      for (const index in addedProducts) {
        const prevUpdatedProductState = updatedProducts[index] || {};
        const prevAddedProductState = addedProducts[index] || {};
        updatedProducts[index] = {
          ...prevUpdatedProductState,
          ...prevAddedProductState,
        };
      }

      const updatedOrderProductIds: ObjectIdModel[] = [];
      for await (const index of Object.keys(updatedProducts)) {
        const orderProduct = (order.products || [])[noNaN(index)];
        if (orderProduct) {
          const { price, customDiscount, amount, orderPromo } = orderProduct;
          const promoDiscounts = (orderPromo || []).reduce((acc: number, promo) => {
            return acc + noNaN(promo.discountPercent);
          }, 0);
          const { discountedPrice } = countDiscountedPrice({
            price,
            discount: noNaN(customDiscount) + promoDiscounts,
          });
          const updatedShopProductResult = await orderProductsCollection.findOneAndUpdate(
            {
              _id: new ObjectId(orderProduct._id),
            },
            {
              $set: {
                amount: amount,
                finalPrice: discountedPrice,
                totalPrice: amount * discountedPrice,
              },
            },
          );
          if (updatedShopProductResult.value) {
            updatedOrderProductIds.push(updatedShopProductResult.value._id);
          }
        }
      }

      // update order total price
      if (updatedOrderProductIds.length > 0) {
        const updatedOrderProducts = await orderProductsCollection
          .find({
            orderId: prevOrder.order._id,
          })
          .toArray();
        const { discountedPrice, totalPrice } = getOrderDiscountedPrice({
          orderProducts: updatedOrderProducts,
          giftCertificateDiscount: noNaN(prevOrder.order.giftCertificateChargedValue),
        });

        await ordersCollection.findOneAndUpdate(
          {
            _id: orderId,
          },
          {
            $set: {
              totalPrice,
              discountedPrice,
            },
          },
        );
      }

      // update order status
      const updatedOrderStatusId = get(diff, 'updated.statusId');
      if (updatedOrderStatusId) {
        await ordersCollection.findOneAndUpdate(
          {
            _id: orderId,
          },
          {
            $set: {
              statusId: new ObjectId(updatedOrderStatusId),
            },
          },
        );
      }

      // success
      const nextOrderState = await getConsoleOrder({
        locale,
        orderId: order._id,
      });
      mutationPayload = {
        success: true,
        message: await getApiMessage('orders.updateOrder.success'),
        payload: nextOrderState?.order,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateOrder error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
