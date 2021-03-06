import ContentItemControls from 'components/button/ContentItemControls';
import { useAppContext } from 'components/context/appContext';
import Currency from 'components/Currency';
import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import WpLink from 'components/Link/WpLink';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { getConsoleOrders, GetConsoleOrdersPayloadType } from 'db/ssr/orders/getConsoleOrders';
import { OrderCustomerInterface, OrderInterface } from 'db/uiInterfaces';
import { useDeleteOrder } from 'hooks/mutations/useOrderMutations';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

interface OrdersRouteInterface {
  data: GetConsoleOrdersPayloadType;
}

const OrdersRoute: React.FC<OrdersRouteInterface> = ({ data }) => {
  const { showModal } = useAppContext();
  const router = useRouter();

  const [deleteOrder] = useDeleteOrder();

  const columns: WpTableColumn<OrderInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => {
        const links = getProjectLinks({
          orderId: dataItem._id,
        });
        return (
          <WpLink testId={`order-${dataItem.itemId}-link`} href={links.cms.orders.orderId.url}>
            {cellData}
          </WpLink>
        );
      },
    },
    {
      accessor: 'status',
      headTitle: '????????????',
      render: ({ cellData }) => {
        return `${cellData.name}`;
      },
    },
    {
      accessor: 'createdAt',
      headTitle: '???????? ????????????',
      render: ({ cellData }) => {
        return <FormattedDateTime value={cellData} />;
      },
    },
    {
      accessor: 'shop.name',
      headTitle: '??????????????',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'productsCount',
      headTitle: '??????????????',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'customer',
      headTitle: '????????????????',
      render: ({ cellData }) => {
        const customer = cellData as OrderCustomerInterface;
        const links = getProjectLinks({
          userId: customer.userId,
        });
        return (
          <WpLink href={links.cms.users.user.userId.url} className='text-primary-text'>
            {customer?.shortName}
          </WpLink>
        );
      },
    },
    {
      accessor: 'customer.formattedPhone',
      headTitle: '??????????????',
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
      headTitle: '??????????',
      render: ({ cellData }) => {
        return <Currency value={cellData} />;
      },
    },
    {
      accessor: 'discountedPrice',
      headTitle: '???? ??????????????',
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
              updateTitle={'???????????? ????????????'}
              updateHandler={() => {
                const links = getProjectLinks({
                  orderId: dataItem._id,
                });
                router.push(links.cms.orders.orderId.url).catch(console.log);
              }}
              deleteTitle={'?????????????? ??????????'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `???? ????????????????, ?????? ???????????? ?????????????? ?????????? ??? ${dataItem.itemId}?`,
                    confirm: () => {
                      deleteOrder({
                        orderId: `${dataItem._id}`,
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'orders-list'}>
      <Head>
        <title>{`????????????`}</title>
      </Head>
      <Inner>
        <WpTitle subtitle={<div>?????????? ?????????????? {data.totalDocs}</div>}>????????????</WpTitle>

        <div className='overflow-x-auto' data-cy={'orders-list'}>
          <WpTable<OrderInterface>
            columns={columns}
            data={data.docs}
            testIdKey={'itemId'}
            onRowDoubleClick={(dataItem) => {
              const links = getProjectLinks({
                orderId: dataItem._id,
              });
              router.push(links.cms.orders.orderId.url).catch(console.log);
            }}
          />
        </div>
        <Pager page={data.page} totalPages={data.totalPages} />
      </Inner>
    </AppContentWrapper>
  );
};

interface OrdersInterface extends GetAppInitialDataPropsInterface, OrdersRouteInterface {}

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
  const { props } = await getAppInitialData({ context });
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
