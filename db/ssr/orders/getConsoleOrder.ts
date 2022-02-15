import { SORT_ASC } from 'config/common';
import { castOrderStatus } from 'db/cast/castOrderStatus';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { castSupplierProductsList } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import {
  COL_GIFT_CERTIFICATES,
  COL_ORDER_CUSTOMERS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_PROMO,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { ObjectIdModel, PromoModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  OrderInterface,
  OrderPromoInterface,
  OrderStatusInterface,
  PromoInterface,
} from 'db/uiInterfaces';
import { shopProductSupplierProductsPipeline, summaryPipeline } from 'db/utils/constantPipelines';

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
  const promoCollection = db.collection<PromoModel>(COL_PROMO);
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
            ...summaryPipeline('$productId'),

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

  // get order promos
  let promoList: PromoInterface[] = [];
  const promoIds = (initialOrder.orderPromo || []).map(({ _id }) => _id);
  if (promoIds.length > 0) {
    promoList = await promoCollection
      .find({
        _id: {
          $in: promoIds,
        },
      })
      .toArray();
  }

  const orderPromo = (initialOrder.orderPromo || []).reduce(
    (acc: OrderPromoInterface[], orderPromoItem) => {
      const promo = promoList.find(({ _id }) => {
        return _id.equals(orderPromoItem._id);
      });
      if (!promo) {
        return [...acc, orderPromoItem];
      }
      return [
        ...acc,
        {
          ...orderPromoItem,
          promo: {
            ...promo,
            name: getFieldStringLocale(promo.nameI18n, locale),
          },
        },
      ];
    },
    [],
  );

  const order: OrderInterface = {
    ...initialOrder,
    orderPromo,
    status: initialOrder.status
      ? {
          ...initialOrder.status,
          name: getFieldStringLocale(initialOrder.status.nameI18n, locale),
        }
      : null,
    products: initialOrder.products?.map((orderProduct) => {
      const productOrderPromoIds = (orderProduct.orderPromo || []).map(({ _id }) => _id);
      const productOrderPromo = orderPromo.filter(({ _id }) => {
        return productOrderPromoIds.some((promoId) => promoId.equals(_id));
      });
      return {
        ...orderProduct,
        orderPromo: productOrderPromo,
        status: castOrderStatus({
          initialStatus: orderProduct.status,
          locale,
        }),
        summary: orderProduct.summary
          ? {
              ...orderProduct.summary,
              cardTitle: getFieldStringLocale(orderProduct.summary.cardTitleI18n, locale),
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
