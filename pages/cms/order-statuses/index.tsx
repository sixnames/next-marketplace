import Button from 'components/button/Button';
import ColorPreview from 'components/ColorPreview';
import FixedButtons from 'components/button/FixedButtons';
import ContentItemControls from 'components/button/ContentItemControls';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { OrderStatusModalInterface } from 'components/Modal/OrderStatusModal';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { SORT_ASC } from 'config/common';
import { CONFIRM_MODAL, ORDER_STATUS_MODAL } from 'config/modalVariants';
import { COL_ORDER_STATUSES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OrderStatusInterface } from 'db/uiInterfaces';
import { useDeleteOrderStatusMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { createOrderStatusSchema, updateOrderStatusSchema } from 'validation/orderStatusSchema';

const pageTitle = 'Статусы заказа';

interface OrderStatusesConsumerInterface {
  orderStatuses: OrderStatusInterface[];
}

const OrderStatusesConsumer: React.FC<OrderStatusesConsumerInterface> = ({ orderStatuses }) => {
  const { showModal, showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteOrderStatusMutation] = useDeleteOrderStatusMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteOrderStatus),
    onError: onErrorCallback,
  });

  const createValidationSchema = useValidationSchema({
    schema: createOrderStatusSchema,
  });

  const updateValidationSchema = useValidationSchema({
    schema: updateOrderStatusSchema,
  });

  const columns: TableColumn<OrderStatusInterface>[] = [
    {
      accessor: 'color',
      headTitle: 'Цвет',
      render: ({ cellData }) => <ColorPreview color={cellData} />,
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'index',
      headTitle: 'Порядковый номер',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Обновить статус заказа'}
            updateHandler={() => {
              showModal<OrderStatusModalInterface>({
                variant: ORDER_STATUS_MODAL,
                props: {
                  orderStatus: dataItem,
                  validationSchema: updateValidationSchema,
                },
              });
            }}
            deleteTitle={'Удалить статус заказа'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-order-status-modal',
                  message: `Вы уверены, что хотите удалить статус заказа ${dataItem.name}`,
                  confirm: () => {
                    showLoading();
                    return deleteOrderStatusMutation({
                      variables: {
                        _id: dataItem._id,
                      },
                    });
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Inner testId={'order-statuses-list'}>
        <Title>{pageTitle}</Title>
        <div className='overflow-x-auto overflow-y-hidden'>
          <Table<OrderStatusInterface>
            columns={columns}
            data={orderStatuses}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
          />
        </div>
        <FixedButtons>
          <Button
            size={'small'}
            testId={`create-order-status`}
            onClick={() => {
              showModal<OrderStatusModalInterface>({
                variant: ORDER_STATUS_MODAL,
                props: {
                  validationSchema: createValidationSchema,
                },
              });
            }}
          >
            Создать статус заказа
          </Button>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface OrderStatusesPageInterface extends PagePropsInterface, OrderStatusesConsumerInterface {}

const OrderStatusesPage: NextPage<OrderStatusesPageInterface> = ({ pageUrls, orderStatuses }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <OrderStatusesConsumer orderStatuses={orderStatuses} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrderStatusesPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const orderStatusesCollection = db.collection<OrderStatusInterface>(COL_ORDER_STATUSES);
  const initialOrderStatuses = await orderStatusesCollection
    .aggregate([
      {
        $sort: {
          index: SORT_ASC,
        },
      },
    ])
    .toArray();

  const orderStatuses = initialOrderStatuses.map((orderStatus) => {
    return {
      ...orderStatus,
      name: getFieldStringLocale(orderStatus.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      orderStatuses: castDbData(orderStatuses),
    },
  };
};

export default OrderStatusesPage;
