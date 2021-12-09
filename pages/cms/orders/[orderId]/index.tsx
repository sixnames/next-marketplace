import ConsoleOrderDetails, {
  CmsOrderDetailsBaseInterface,
} from 'components/order/ConsoleOrderDetails';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getConsoleOrder } from 'lib/orderUtils';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface OrderPageConsumerInterface extends CmsOrderDetailsBaseInterface {}

const OrderPageConsumer: React.FC<OrderPageConsumerInterface> = ({ order, orderStatuses }) => {
  const { itemId } = order;
  const title = `Заказ №${itemId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Список заказов',
        href: `${ROUTE_CMS}/orders`,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <ConsoleOrderDetails
        order={order}
        title={title}
        orderStatuses={orderStatuses}
        pageCompanySlug={DEFAULT_COMPANY_SLUG}
      />
    </AppContentWrapper>
  );
};

interface OrderPageInterface extends OrderPageConsumerInterface, GetAppInitialDataPropsInterface {}

const OrderPage: NextPage<OrderPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps} title={`Заказ №${props.order.itemId}`}>
      <OrderPageConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OrderPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
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
    },
  };
};

export default OrderPage;
