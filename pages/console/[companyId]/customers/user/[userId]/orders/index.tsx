import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import Table, { TableColumn } from 'components/Table';
import { ROUTE_CONSOLE, SORT_DESC } from 'config/common';
import {
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_ROLES,
  COL_SHOPS,
  COL_USER_CATEGORIES,
  COL_USERS,
} from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, OrderInterface, UserInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import ConsoleUserLayout from 'layout/console/ConsoleUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';

interface UserOrdersConsumerInterface {
  user: UserInterface;
  pageCompany: CompanyInterface;
}

const UserOrdersConsumer: React.FC<UserOrdersConsumerInterface> = ({ user, pageCompany }) => {
  const basePath = `${ROUTE_CONSOLE}/${pageCompany?._id}/customers`;

  const columns: TableColumn<OrderInterface>[] = [
    {
      accessor: 'orderId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link
          testId={`order-${dataItem.itemId}-link`}
          href={`${basePath}/user/${user._id}/orders/${dataItem._id}`}
        >
          {cellData}
        </Link>
      ),
    },
    {
      accessor: 'status',
      headTitle: 'Статус',
      render: ({ cellData }) => {
        return `${cellData.name}`;
      },
    },
    {
      accessor: 'createdAt',
      headTitle: 'Дата заказа',
      render: ({ cellData }) => {
        return <FormattedDateTime value={cellData} />;
      },
    },
    {
      accessor: 'shop.name',
      headTitle: 'Магазин',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'productsCount',
      headTitle: 'Товаров',
      render: ({ cellData }) => {
        return cellData;
      },
    },
  ];

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Заказы`,
    config: [
      {
        name: 'Клиенты',
        href: basePath,
      },
      {
        name: `${user.fullName}`,
        href: `${basePath}/user/${user._id}`,
      },
    ],
  };

  return (
    <ConsoleUserLayout companyId={`${pageCompany?._id}`} user={user} breadcrumbs={breadcrumbs}>
      <Inner>
        <div className='mb-4 text-secondary-text'>Всего заказов {user.orders?.length}</div>
        <div className='overflow-x-auto'>
          <Table<OrderInterface> columns={columns} data={user.orders} testIdKey={'itemId'} />
        </div>
      </Inner>
    </ConsoleUserLayout>
  );
};

interface UserOrdersPageInterface
  extends GetConsoleInitialDataPropsInterface,
    UserOrdersConsumerInterface {}

const UserOrdersPage: NextPage<UserOrdersPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserOrdersConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserOrdersPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);
  const { props } = await getConsoleInitialData({ context });

  const companyId = new ObjectId(`${query.companyId}`);
  const userId = new ObjectId(`${query.userId}`);
  if (!props) {
    return {
      notFound: true,
    };
  }

  const userAggregationResult = await usersCollection
    .aggregate<UserInterface>([
      {
        $match: {
          _id: userId,
        },
      },

      // get role
      {
        $lookup: {
          from: COL_ROLES,
          as: 'role',
          let: { roleId: '$roleId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$roleId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          role: { $arrayElemAt: ['$role', 0] },
        },
      },

      // get category
      {
        $lookup: {
          from: COL_USER_CATEGORIES,
          as: 'category',
          let: {
            categoryIds: '$categoryIds',
          },
          pipeline: [
            {
              $match: {
                companyId,
                $expr: {
                  $in: ['$_id', '$$categoryIds'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          category: {
            $arrayElemAt: ['$category', 0],
          },
        },
      },

      // get orders
      {
        $lookup: {
          from: COL_ORDERS,
          as: 'orders',
          let: { customerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$customerId', '$$customerId'],
                },
              },
            },
            {
              $sort: {
                createdAt: SORT_DESC,
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
                shop: {
                  $arrayElemAt: ['$shop', 0],
                },
                status: {
                  $arrayElemAt: ['$status', 0],
                },
                productsCount: {
                  $size: '$shopProductIds',
                },
              },
            },
          ],
        },
      },

      {
        $project: {
          password: false,
        },
      },
    ])
    .toArray();
  const userResult = userAggregationResult[0];
  if (!userResult) {
    return {
      notFound: true,
    };
  }

  const user: UserInterface = {
    ...userResult,
    fullName: getFullName(userResult),
    role: userResult.role
      ? {
          ...userResult.role,
          name: getFieldStringLocale(userResult.role.nameI18n, props.sessionLocale),
        }
      : null,
    formattedPhone: {
      raw: phoneToRaw(userResult.phone),
      readable: phoneToReadable(userResult.phone),
    },
    category: userResult.category
      ? {
          ...userResult.category,
          name: getFieldStringLocale(userResult.category.nameI18n, props.sessionLocale),
        }
      : null,
    orders: (userResult.orders || []).map((order) => {
      return {
        ...order,
        totalPrice: order.products?.reduce((acc: number, { totalPrice }) => {
          return acc + totalPrice;
        }, 0),
        status: order.status
          ? {
              ...order.status,
              name: getFieldStringLocale(order.status.nameI18n, props.sessionLocale),
            }
          : null,
      };
    }),
  };

  return {
    props: {
      ...props,
      user: castDbData(user),
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default UserOrdersPage;
