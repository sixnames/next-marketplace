import ContentItemControls from 'components/ContentItemControls';
import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Pager from 'components/Pager/Pager';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { OrderInterface } from 'db/uiInterfaces';
import { useDeleteOrder } from 'hooks/mutations/order/useOrderMutations';
import { useConsoleOrders } from 'hooks/useConsoleOrders';
import AppContentWrapper from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const OrdersRoute: React.FC = () => {
  const { showModal } = useAppContext();
  const router = useRouter();
  const [deleteOrder] = useDeleteOrder();
  const { data, error } = useConsoleOrders();

  if (error) {
    return <RequestError />;
  }

  if (!data) {
    return <Spinner isNested isTransparent />;
  }

  const columns: TableColumn<OrderInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link testId={`order-${dataItem.itemId}-link`} href={`${ROUTE_CMS}/orders/${dataItem._id}`}>
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
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={dataItem.itemId}
              updateTitle={'Детали заказа'}
              updateHandler={() => {
                router.push(`${ROUTE_CMS}/orders/${dataItem._id}`).catch((e) => {
                  console.log(e);
                });
              }}
              deleteTitle={'Удалить заказ'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `Вы уверенны, что хотите удалить заказ № ${dataItem.itemId}?`,
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
        <title>{`Заказы`}</title>
      </Head>
      <Inner>
        <Title>Заказы</Title>

        <div className='overflow-x-auto' data-cy={'orders-list'}>
          <Table<OrderInterface>
            columns={columns}
            data={data}
            testIdKey={'itemId'}
            onRowDoubleClick={(dataItem) => {
              router.push(`${ROUTE_CMS}/orders/${dataItem._id}`).catch((e) => {
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

interface OrdersInterface extends PagePropsInterface {}

const Orders: NextPage<OrdersInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <OrdersRoute />
    </CmsLayout>
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

  return {
    props: {
      ...props,
    },
  };
};

export default Orders;
