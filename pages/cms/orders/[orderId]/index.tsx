import Inner from 'components/Inner';
import Title from 'components/Title';
import { COL_ORDERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OrderInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface OrderPageConsumerInterface {
  order: OrderInterface;
}

const OrderPageConsumer: React.FC<OrderPageConsumerInterface> = ({ order }) => {
  return (
    <AppContentWrapper>
      <Inner testId={`order-details`}>
        <Title>Заказ №{order.itemId}</Title>
      </Inner>
    </AppContentWrapper>
  );
};

interface OrderPageInterface extends OrderPageConsumerInterface, PagePropsInterface {}

const OrderPage: NextPage<OrderPageInterface> = ({ pageUrls, order }) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={`Заказ №${order.itemId}`}>
      <OrderPageConsumer order={order} />
    </CmsLayout>
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

  const { db } = await getDatabase();
  const ordersCollection = db.collection<OrderInterface>(COL_ORDERS);
  const orderAggregationResult = await ordersCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.orderId}`),
        },
      },
    ])
    .toArray();
  const initialOrder = orderAggregationResult[0];

  if (!initialOrder) {
    return {
      notFound: true,
    };
  }

  const order: OrderInterface = {
    ...initialOrder,
  };

  return {
    props: {
      ...props,
      order: castDbData(order),
    },
  };
};

export default OrderPage;
