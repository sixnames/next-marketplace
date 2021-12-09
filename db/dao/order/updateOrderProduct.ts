import { DEFAULT_DIFF } from 'config/common';
import {
  COL_ORDER_LOGS,
  COL_ORDER_PRODUCTS,
  COL_ORDERS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  OrderLogModel,
  OrderModel,
  OrderProductModel,
  OrderProductPayloadModel,
  ShopProductModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { noNaN } from 'lib/numbers';
import { countDiscountedPrice } from 'lib/priceUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface UpdateOrderProductInputInterface {
  orderProductId: string;
  amount: number;
  customDiscount?: number | null;
}

export async function updateOrderProduct({
  context,
  input,
}: DaoPropsInterface<UpdateOrderProductInputInterface>): Promise<OrderProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
  const orderLogsCollection = db.collection<OrderLogModel>(COL_ORDER_LOGS);
  const orderProductsCollection = db.collection<OrderProductModel>(COL_ORDER_PRODUCTS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

  const session = client.startSession();

  let mutationPayload: OrderProductPayloadModel = {
    success: false,
    message: await getApiMessage('orders.makeAnOrder.error'),
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

      // order product
      const orderProduct = await orderProductsCollection.findOne({
        _id: new ObjectId(input.orderProductId),
      });
      if (!orderProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // order
      const order = await ordersCollection.findOne({
        _id: orderProduct.orderId,
      });
      if (!order) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // check product availability
      const shopProduct = await shopProductsCollection.findOne({
        _id: orderProduct.shopProductId,
      });
      if (!shopProduct || shopProduct.available < input.amount) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      // create order log
      const orderLog: OrderLogModel = {
        _id: new ObjectId(),
        orderId: order._id,
        userId: user._id,
        diff: DEFAULT_DIFF,
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

      // Update order products
      const customDiscount = noNaN(input.customDiscount);
      if (customDiscount !== orderProduct.customDiscount) {
        // Permission
        const { allow, message } = await getOperationPermission({
          context,
          slug: 'updateOrderProductDiscount',
        });
        if (!allow) {
          mutationPayload = {
            success: false,
            message,
          };
          await session.abortTransaction();
          return;
        }
      }

      const { discountedPrice, finalDiscount } = countDiscountedPrice({
        price: orderProduct.price,
        discount: customDiscount,
      });

      const updatedOrderProductsResult = await orderProductsCollection.findOneAndUpdate(
        {
          _id: orderProduct._id,
        },
        {
          $set: {
            amount: input.amount,
            finalPrice: discountedPrice,
            totalPrice: input.amount * discountedPrice,
            customDiscount: finalDiscount,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedOrderProducts = updatedOrderProductsResult.value;
      if (!updatedOrderProductsResult.ok || !updatedOrderProducts) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('orders.updateOrder.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('orders.updateOrder.success'),
        payload: updatedOrderProducts,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
