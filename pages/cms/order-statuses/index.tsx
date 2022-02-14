import Head from 'next/head';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import ColorPreview from 'components/ColorPreview';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { OrderStatusModalInterface } from 'components/Modal/OrderStatusModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { SORT_ASC } from 'config/common';
import { CONFIRM_MODAL, ORDER_STATUS_MODAL } from 'config/modalVariants';
import { COL_ORDER_STATUSES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OrderStatusInterface } from 'db/uiInterfaces';
import { useDeleteOrderStatusMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
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

  const columns: WpTableColumn<OrderStatusInterface>[] = [
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
        <WpTitle>{pageTitle}</WpTitle>
        <div className='overflow-x-auto overflow-y-hidden'>
          <WpTable<OrderStatusInterface>
            columns={columns}
            data={orderStatuses}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
          />
        </div>
        <FixedButtons>
          <WpButton
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
          </WpButton>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface OrderStatusesPageInterface
  extends GetAppInitialDataPropsInterface,
    OrderStatusesConsumerInterface {}

const OrderStatusesPage: NextPage<OrderStatusesPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <OrderStatusesConsumer {...props} />
    </ConsoleLayout>
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
