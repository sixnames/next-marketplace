import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import Pager from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { ROUTE_CONSOLE, SORT_DESC } from 'config/common';
import { COL_ORDER_CUSTOMERS, COL_ORDER_STATUSES, COL_ORDERS } from 'db/collectionNames';
import { OrderModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { OrderInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getShortName } from 'lib/nameUtils';
import { castOrderStatus } from 'lib/orderUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface OrdersRouteInterface {
  orders: OrderInterface[];
}

const OrdersRoute: React.FC<OrdersRouteInterface> = ({ orders }) => {
  const router = useRouter();

  const columns: TableColumn<OrderInterface>[] = [
    {
      accessor: 'orderId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link
          testId={`order-${dataItem.itemId}-link`}
          href={`${ROUTE_CONSOLE}/${router.query.companyId}/orders/order/${dataItem._id}`}
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
      accessor: 'productsCount',
      headTitle: 'Товаров',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'customer.shortName',
      headTitle: 'Заказчик',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'customer.formattedPhone',
      headTitle: 'Телефон',
      render: ({ cellData }) => {
        return <LinkPhone value={cellData} />;
      },
    },
    {
      accessor: 'customer.email',
      headTitle: 'Email',
      render: ({ cellData }) => {
        return <LinkEmail value={cellData} />;
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{`Заказы`}</title>
      </Head>
      <Inner>
        <Title>Заказы</Title>

        <div className='overflow-x-auto' data-cy={'orders-list'}>
          <Table<OrderInterface>
            columns={columns}
            data={orders}
            testIdKey={'itemId'}
            onRowDoubleClick={(dataItem) => {
              router
                .push(`${ROUTE_CONSOLE}/${router.query.companyId}/orders/order/${dataItem._id}`)
                .catch((e) => {
                  console.log(e);
                });
            }}
          />
        </div>
        <Pager page={1} setPage={() => undefined} totalPages={0} />
      </Inner>
    </AppContentWrapper>
  );
};

interface OrdersInterface extends PagePropsInterface, OrdersRouteInterface {}

const Orders: NextPage<OrdersInterface> = ({ pageUrls, orders, currentCompany }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={currentCompany}>
      <OrdersRoute orders={orders} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrdersInterface>> => {
  const { db } = await getDatabase();
  const ordersCollection = db.collection<OrderModel>(COL_ORDERS);
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.sessionUser) {
    return {
      notFound: true,
    };
  }

  if (!props.currentCompany) {
    return {
      notFound: true,
    };
  }

  const initialOrders = await ordersCollection
    .aggregate<OrderInterface>([
      {
        $match: {
          companyId: new ObjectId(props.currentCompany._id),
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
      totalPrice: order.products?.reduce((acc: number, { amount, price }) => {
        return acc + amount * price;
      }, 0),
      status: castOrderStatus({
        initialStatus: order.status,
        locale: props.sessionLocale,
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
    props: {
      ...props,
      currentCompany: props.currentCompany,
      orders: castDbData(orders),
    },
  };
};

export default Orders;
