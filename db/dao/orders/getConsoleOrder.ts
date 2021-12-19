import { ObjectId } from 'mongodb';
import { SORT_ASC } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getFullName } from '../../../lib/nameUtils';
import { phoneToRaw, phoneToReadable } from '../../../lib/phoneUtils';
import { castSupplierProductsList } from '../../../lib/productUtils';
import { generateCardTitle } from '../../../lib/titleUtils';
import {
  COL_GIFT_CERTIFICATES,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from '../../collectionNames';
import { ObjectIdModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { OrderInterface, OrderStatusInterface } from '../../uiInterfaces';
import {
  shopProductFieldsPipeline,
  shopProductSupplierProductsPipeline,
} from '../constantPipelines';

interface CastOrderStatusInterface {
  locale?: string;
  initialStatus?: OrderStatusInterface | null;
}

export function castOrderStatus({
  locale,
  initialStatus,
}: CastOrderStatusInterface): OrderStatusInterface | null {
  if (!initialStatus) {
    return null;
  }

  return {
    ...initialStatus,
    name: getFieldStringLocale(initialStatus.nameI18n, locale),
  };
}

interface GetConsoleOrderInterface {
  orderId: string | ObjectIdModel | null | undefined;
  locale: string;
}

interface GetConsoleOrderPayloadInterface {
  order: OrderInterface;
  orderStatuses: OrderStatusInterface[];
}

export async function getConsoleOrder({
  orderId,
  locale,
}: GetConsoleOrderInterface): Promise<GetConsoleOrderPayloadInterface | null> {
  const { db } = await getDatabase();
  const ordersCollection = db.collection<OrderInterface>(COL_ORDERS);
  const orderStatusesCollection = db.collection<OrderStatusInterface>(COL_ORDER_STATUSES);
  if (!orderId) {
    return null;
  }

  // get order statuses
  const orderStatusesAggregation = await orderStatusesCollection
    .aggregate<OrderStatusInterface>([
      {
        $sort: {
          index: SORT_ASC,
        },
      },
    ])
    .toArray();
  const orderStatuses = orderStatusesAggregation.map((status) => {
    return {
      ...status,
      name: getFieldStringLocale(status.nameI18n, locale),
    };
  });

  const orderAggregationResult = await ordersCollection
    .aggregate<OrderInterface>([
      {
        $match: {
          _id: new ObjectId(orderId),
        },
      },
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
          from: COL_GIFT_CERTIFICATES,
          as: 'giftCertificate',
          localField: 'giftCertificateId',
          foreignField: '_id',
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
          shop: {
            $arrayElemAt: ['$shop', 0],
          },
          giftCertificate: {
            $arrayElemAt: ['$giftCertificate', 0],
          },
        },
      },
      {
        $lookup: {
          from: COL_ORDER_PRODUCTS,
          as: 'products',
          let: { orderId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$orderId', '$orderId'],
                },
              },
            },

            // shop product
            {
              $lookup: {
                from: COL_SHOP_PRODUCTS,
                as: 'shopProduct',
                let: { shopProductId: '$shopProductId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$shopProductId', '$_id'],
                      },
                    },
                  },
                  // get supplier products
                  ...shopProductSupplierProductsPipeline,
                ],
              },
            },

            // product
            ...shopProductFieldsPipeline('$productId'),

            // order product status
            {
              $lookup: {
                from: COL_ORDER_STATUSES,
                as: 'status',
                localField: 'statusId',
                foreignField: '_id',
              },
            },
            {
              $addFields: {
                status: {
                  $arrayElemAt: ['$status', 0],
                },
                shopProduct: {
                  $arrayElemAt: ['$shopProduct', 0],
                },
              },
            },
            {
              $sort: {
                _id: SORT_ASC,
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const initialOrder = orderAggregationResult[0];
  if (!initialOrder) {
    return null;
  }

  const order: OrderInterface = {
    ...initialOrder,
    status: initialOrder.status
      ? {
          ...initialOrder.status,
          name: getFieldStringLocale(initialOrder.status.nameI18n, locale),
        }
      : null,
    products: initialOrder.products?.map((orderProduct) => {
      // title
      const cardTitle = generateCardTitle({
        locale,
        brand: orderProduct.product?.brand,
        rubricName: getFieldStringLocale(orderProduct.product?.rubric?.nameI18n, locale),
        showRubricNameInProductTitle: orderProduct.product?.rubric?.showRubricNameInProductTitle,
        showCategoryInProductTitle: orderProduct.product?.rubric?.showCategoryInProductTitle,
        attributes: orderProduct.product?.attributes || [],
        categories: orderProduct.product?.categories,
        titleCategoriesSlugs: orderProduct.product?.titleCategoriesSlugs,
        originalName: `${orderProduct.product?.originalName}`,
        defaultGender: `${orderProduct.product?.gender}`,
      });

      return {
        ...orderProduct,
        status: castOrderStatus({
          initialStatus: orderProduct.status,
          locale,
        }),
        product: orderProduct.product
          ? {
              ...orderProduct.product,
              cardTitle,
            }
          : null,
        shopProduct: orderProduct.shopProduct
          ? {
              ...orderProduct.shopProduct,
              supplierProducts: castSupplierProductsList({
                supplierProducts: orderProduct.shopProduct.supplierProducts,
                locale,
              }),
            }
          : null,
      };
    }),
    customer: initialOrder.customer
      ? {
          ...initialOrder.customer,
          fullName: getFullName(initialOrder.customer),
          formattedPhone: {
            raw: phoneToRaw(initialOrder.customer.phone),
            readable: phoneToReadable(initialOrder.customer.phone),
          },
        }
      : null,
    giftCertificate: initialOrder.giftCertificate
      ? {
          ...initialOrder.giftCertificate,
          name: getFieldStringLocale(initialOrder.giftCertificate.nameI18n, locale),
          description: getFieldStringLocale(initialOrder.giftCertificate.descriptionI18n, locale),
        }
      : null,
  };

  return {
    order,
    orderStatuses,
  };
}
