import { castOrderStatus } from 'db/cast/castOrderStatus';
import { COL_ORDER_CUSTOMERS, COL_ORDER_STATUSES, COL_SHOPS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import {
  AppPaginationAggregationInterface,
  AppPaginationInterface,
  OrderInterface,
} from 'db/uiInterfaces';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { PAGINATION_DEFAULT_LIMIT, SORT_DESC } from 'lib/config/common';
import { getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext } from 'next';

export interface OrderPaginationAggregationInterface
  extends AppPaginationAggregationInterface<OrderInterface> {}

export type GetConsoleOrdersPayloadType = AppPaginationInterface<OrderInterface>;

export interface GetConsoleOrdersInputInterface {
  context: GetServerSidePropsContext;
}

export async function getConsoleOrders({
  context,
}: GetConsoleOrdersInputInterface): Promise<GetConsoleOrdersPayloadType | null> {
  try {
    const { locale } = await getRequestParams(context);
    const collections = await getDbCollections();
    const ordersCollection = collections.ordersCollection();
    const { query } = context;
    const { companyId } = query;

    const { page, skip, limit, clearSlug } = await castUrlFilters({
      filters: alwaysArray(query.filters),
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      searchFieldName: '_id',
    });

    const matchByCompany = companyId
      ? [
          {
            $match: {
              companyId: new ObjectId(alwaysString(companyId)),
            },
          },
        ]
      : [];

    const ordersAggregationResult = await ordersCollection
      .aggregate<OrderPaginationAggregationInterface>([
        ...matchByCompany,

        // facets
        {
          $facet: {
            // docs facet
            docs: [
              {
                $sort: {
                  createdAt: SORT_DESC,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
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
            ],

            // countAllDocs facet
            countAllDocs: [
              {
                $count: 'totalDocs',
              },
            ],
          },
        },

        // cast facets
        {
          $addFields: {
            totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
          },
        },
        {
          $addFields: {
            totalPagesFloat: {
              $divide: ['$totalDocs', limit],
            },
          },
        },
        {
          $addFields: {
            totalPages: {
              $ceil: '$totalPagesFloat',
            },
          },
        },
        {
          $addFields: {
            countAllDocs: null,
            totalDocsObject: null,
            totalDocs: '$totalDocsObject.totalDocs',
          },
        },
      ])
      .toArray();
    const ordersAggregation = ordersAggregationResult[0];
    if (!ordersAggregation) {
      return null;
    }

    const { totalDocs, totalPages } = ordersAggregation;

    const docs: OrderInterface[] = [];
    ordersAggregation.docs.forEach((order) => {
      docs.push({
        ...order,
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

    return {
      docs,
      totalDocs,
      totalPages,
      page,
      clearSlug,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
