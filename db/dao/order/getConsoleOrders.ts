import { SORT_DESC } from 'config/common';
import { COL_ORDER_CUSTOMERS, COL_ORDER_STATUSES, COL_ORDERS, COL_SHOPS } from 'db/collectionNames';
import { OrderModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, OrderInterface } from 'db/uiInterfaces';
import { getShortName } from 'lib/nameUtils';
import { castOrderStatus } from 'lib/orderUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export type GetConsoleOrdersPayloadType = OrderInterface[];
export interface GetConsoleOrdersInputInterface {
  companyId?: string | null;
}

export async function getConsoleOrders({
  context,
  input,
}: DaoPropsInterface<GetConsoleOrdersInputInterface>): Promise<GetConsoleOrdersPayloadType> {
  try {
    const { locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
    const matchByCompany = input?.companyId
      ? [
          {
            $match: {
              companyId: new ObjectId(input.companyId),
            },
          },
        ]
      : [];

    const initialOrders = await ordersCollection
      .aggregate<OrderInterface>([
        ...matchByCompany,
        {
          $lookup: {
            from: COL_ORDER_STATUSES,
            as: 'status',
            localField: 'statusId',
            foreignField: '_id',
          },
        },
        {
          $lookup: {
            from: COL_ORDER_CUSTOMERS,
            as: 'customer',
            localField: '_id',
            foreignField: 'orderId',
          },
        },
        {
          $lookup: {
            from: COL_SHOPS,
            as: 'shop',
            let: { shopId: '$shopId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$shopId', '$_id'],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            status: {
              $arrayElemAt: ['$status', 0],
            },
            customer: {
              $arrayElemAt: ['$customer', 0],
            },
            productsCount: {
              $size: '$shopProductIds',
            },
            shop: {
              $arrayElemAt: ['$shop', 0],
            },
          },
        },
        {
          $sort: {
            createdAt: SORT_DESC,
          },
        },
      ])
      .toArray();

    const orders: OrderInterface[] = [];
    initialOrders.forEach((order) => {
      orders.push({
        ...order,
        totalPrice: order.products?.reduce((acc: number, { totalPrice, status }) => {
          const productStatus = castOrderStatus({
            initialStatus: status,
            locale: locale,
          });
          if (productStatus && productStatus.isCanceled) {
            return acc;
          }
          return acc + totalPrice;
        }, 0),
        status: castOrderStatus({
          initialStatus: order.status,
          locale: locale,
        }),
        customer: order.customer
          ? {
              ...order.customer,
              shortName: getShortName(order.customer),
              formattedPhone: {
                raw: phoneToRaw(order.customer.phone),
                readable: phoneToReadable(order.customer.phone),
              },
            }
          : null,
      });
    });

    return orders;
  } catch (e) {
    console.log(e);
    return [];
  }
}
