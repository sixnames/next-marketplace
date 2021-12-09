import Button from 'components/button/Button';
import ConsoleOrderDetails, {
  CmsOrderDetailsBaseInterface,
} from 'components/order/ConsoleOrderDetails';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { DEFAULT_COMPANY_SLUG, ROUTE_CONSOLE } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { CompanyInterface } from 'db/uiInterfaces';
import { useCancelOrder, useConfirmOrder } from 'hooks/mutations/useOrderMutations';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getConsoleOrder } from 'lib/orderUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';

interface OrderPageConsumerInterface extends CmsOrderDetailsBaseInterface {
  pageCompany: CompanyInterface;
}

const OrderPageConsumer: React.FC<OrderPageConsumerInterface> = ({
  order,
  orderStatuses,
  pageCompany,
}) => {
  const { query } = useRouter();
  const title = `Заказ № ${order.orderId}`;
  const { showModal } = useAppContext();

  const [confirmOrderMutation] = useConfirmOrder();
  const [cancelOrderMutation] = useCancelOrder();

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Список заказов',
        href: `${ROUTE_CONSOLE}/${query.companyId}/orders`,
      },
    ],
  };

  const pageCompanySlug =
    pageCompany && pageCompany.domain ? pageCompany.slug : DEFAULT_COMPANY_SLUG;

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <div className='relative'>
        <ConsoleOrderDetails
          orderStatuses={orderStatuses}
          order={order}
          title={title}
          pageCompanySlug={pageCompanySlug}
        />
        <Inner>
          <FixedButtons>
            {order.status?.isNew ? (
              <Button
                onClick={() => {
                  confirmOrderMutation({
                    orderId: `${order._id}`,
                  }).catch(console.log);
                }}
              >
                Подтвердить заказ
              </Button>
            ) : null}

            {!order.status?.isCanceled && !order.status?.isDone ? (
              <Button
                theme={'secondary'}
                onClick={() => {
                  showModal<ConfirmModalInterface>({
                    variant: CONFIRM_MODAL,
                    props: {
                      testId: 'cancel-order-modal',
                      message: `Вы уверены, что хотите отменить заказ № ${order.orderId} ?`,
                      confirm: () => {
                        cancelOrderMutation({
                          orderId: `${order._id}`,
                        }).catch(console.log);
                      },
                    },
                  });
                }}
              >
                Отменить заказ
              </Button>
            ) : null}
          </FixedButtons>
        </Inner>
      </div>
    </AppContentWrapper>
  );
};

interface OrderPageInterface
  extends GetConsoleInitialDataPropsInterface,
    OrderPageConsumerInterface {}

const OrderPage: NextPage<OrderPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <OrderPageConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrderPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.orderId) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const payload = await getConsoleOrder({
    locale,
    orderId: `${query.orderId}`,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      order: castDbData(payload.order),
      orderStatuses: castDbData(payload.orderStatuses),
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default OrderPage;
