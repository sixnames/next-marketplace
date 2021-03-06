import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import CmsUserLayout from 'components/layout/cms/CmsUserLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpLink from 'components/Link/WpLink';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { COL_ORDER_STATUSES, COL_ORDERS, COL_ROLES, COL_SHOPS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, OrderInterface, UserInterface } from 'db/uiInterfaces';
import { SORT_DESC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface UserOrdersInterface {
  user: UserInterface;
}

const UserOrdersConsumer: React.FC<UserOrdersInterface> = ({ user }) => {
  const columns: WpTableColumn<OrderInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => {
        const links = getProjectLinks({
          userId: user._id,
          orderId: dataItem._id,
        });
        return (
          <WpLink
            testId={`order-${dataItem.itemId}-link`}
            href={links.cms.users.user.userId.orders.orderId.url}
          >
            {cellData}
          </WpLink>
        );
      },
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

  const links = getProjectLinks({
    userId: user._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Заказы`,
    config: [
      {
        name: 'Пользователи',
        href: links.cms.users.url,
      },
      {
        name: `${user.fullName}`,
        href: links.cms.users.user.userId.url,
      },
    ],
  };

  return (
    <CmsUserLayout user={user} breadcrumbs={breadcrumbs}>
      <Inner testId={'user-orders-page'}>
        <div className='mb-4 text-secondary-text'>Всего заказов {user.orders?.length}</div>
        <div className='overflow-x-auto'>
          <WpTable<OrderInterface> columns={columns} data={user.orders} testIdKey={'itemId'} />
        </div>
      </Inner>
    </CmsUserLayout>
  );
};

interface ProductPageInterface extends GetAppInitialDataPropsInterface, UserOrdersInterface {}

const UserOrdersPage: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserOrdersConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { userId } = query;
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();

  const { props } = await getAppInitialData({ context });
  if (!props || !userId) {
    return {
      notFound: true,
    };
  }
  const userAggregationResult = await usersCollection
    .aggregate<UserInterface>([
      {
        $match: {
          _id: new ObjectId(`${userId}`),
        },
      },
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
    orders: (userResult.orders || []).map((order) => {
      return {
        ...order,
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
    },
  };
};

export default UserOrdersPage;
