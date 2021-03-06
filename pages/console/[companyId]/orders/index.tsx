import ContentItemControls from 'components/button/ContentItemControls';
import Currency from 'components/Currency';
import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import WpLink from 'components/Link/WpLink';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { getConsoleOrders, GetConsoleOrdersPayloadType } from 'db/ssr/orders/getConsoleOrders';
import { OrderInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

interface OrdersRouteInterface {
  data: GetConsoleOrdersPayloadType;
}

const OrdersRoute: React.FC<OrdersRouteInterface> = ({ data }) => {
  const router = useRouter();

  const columns: WpTableColumn<OrderInterface>[] = [
    {
      accessor: 'orderId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => {
        const links = getProjectLinks({
          companyId: `${router.query.companyId}`,
          orderId: dataItem._id,
        });
        return (
          <WpLink
            testId={`order-${dataItem.itemId}-link`}
            href={links.console.companyId.orders.order.orderId.url}
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
    {
      accessor: 'totalPrice',
      headTitle: 'Сумма',
      render: ({ cellData }) => {
        return <Currency value={cellData} />;
      },
    },
    {
      accessor: 'discountedPrice',
      headTitle: 'Со скидкой',
      render: ({ cellData }) => {
        return <Currency value={cellData} />;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={dataItem.itemId}
              updateTitle={'Детали заказа'}
              updateHandler={() => {
                const links = getProjectLinks({
                  companyId: `${router.query.companyId}`,
                  orderId: dataItem._id,
                });
                router.push(links.console.companyId.orders.order.orderId.url).catch(console.log);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{`Заказы`}</title>
      </Head>
      <Inner>
        <WpTitle subtitle={<div>Всего заказов {data.totalDocs}</div>}>Заказы</WpTitle>

        <div className='overflow-x-auto' data-cy={'orders-list'}>
          <WpTable<OrderInterface>
            columns={columns}
            data={data.docs}
            testIdKey={'itemId'}
            onRowDoubleClick={(dataItem) => {
              const links = getProjectLinks({
                companyId: `${router.query.companyId}`,
                orderId: dataItem._id,
              });
              router.push(links.console.companyId.orders.order.orderId.url).catch(console.log);
            }}
          />
        </div>
        <Pager page={data.page} totalPages={data.totalPages} />
      </Inner>
    </AppContentWrapper>
  );
};

interface OrdersInterface extends GetConsoleInitialDataPropsInterface, OrdersRouteInterface {}

const Orders: NextPage<OrdersInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <OrdersRoute {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrdersInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
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
      data: castDbData(data),
    },
  };
};

export default Orders;
