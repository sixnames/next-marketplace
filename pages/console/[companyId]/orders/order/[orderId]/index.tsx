import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import ConsoleOrderDetails, {
  CmsOrderDetailsBaseInterface,
} from 'components/order/ConsoleOrderDetails';
import { getConsoleOrder } from 'db/ssr/orders/getConsoleOrder';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { useCancelOrder, useConfirmOrder } from 'hooks/mutations/useOrderMutations';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';

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

  const links = getProjectLinks({
    companyId: `${query.companyId}`,
    orderId: order._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Список заказов',
        href: links.console.companyId.orders.url,
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
              <WpButton
                frameClassName={'w-auto'}
                onClick={() => {
                  confirmOrderMutation({
                    orderId: `${order._id}`,
                  }).catch(console.log);
                }}
              >
                Подтвердить заказ
              </WpButton>
            ) : null}

            {!order.status?.isCanceled && !order.status?.isDone ? (
              <WpButton
                frameClassName={'w-auto'}
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
              </WpButton>
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
