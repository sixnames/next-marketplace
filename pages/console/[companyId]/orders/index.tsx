import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { getConsoleOrders, GetConsoleOrdersPayloadType } from 'db/dao/order/getConsoleOrders';
import { OrderInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface OrdersRouteInterface {
  data: GetConsoleOrdersPayloadType;
}

const OrdersRoute: React.FC<OrdersRouteInterface> = ({ data }) => {
  const setPageHandler = useNavigateToPageHandler();
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
        <Title subtitle={<div>Всего заказов {data.totalDocs}</div>}>Заказы</Title>

        <div className='overflow-x-auto' data-cy={'orders-list'}>
          <Table<OrderInterface>
            columns={columns}
            data={data.docs}
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
        <Pager page={data.page} setPage={setPageHandler} totalPages={data.totalPages} />
      </Inner>
    </AppContentWrapper>
  );
};

interface OrdersInterface extends PagePropsInterface, OrdersRouteInterface {}

const Orders: NextPage<OrdersInterface> = ({ pageUrls, currentCompany, data }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={currentCompany}>
      <OrdersRoute data={data} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrdersInterface>> => {
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

  const data = await getConsoleOrders({ context });
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      currentCompany: props.currentCompany,
      data: castDbData(data),
    },
  };
};

export default Orders;
