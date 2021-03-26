import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import Inner from 'components/Inner/Inner';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import { useGetCmsOrderQuery } from 'generated/apolloComponents';
import AppLayout from 'layout/AppLayout/AppLayout';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import classes from 'styles/CmsOrderRoute.module.css';

const CmsOrderRoute: React.FC = () => {
  const { query } = useRouter();
  const { orderId } = query;
  const { data, loading, error } = useGetCmsOrderQuery({
    variables: {
      _id: `${orderId}`,
    },
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getOrder) {
    return <RequestError message={'Заказ не найден'} />;
  }

  const { itemId } = data.getOrder;

  return (
    <DataLayout
      title={`Заказ №${itemId}`}
      filterResult={() => (
        <DataLayoutContentFrame>
          <Inner className={classes.frame} testId={'order-details'}>
            <pre>{JSON.stringify(data?.getOrder, null, 2)}</pre>
          </Inner>
        </DataLayoutContentFrame>
      )}
    />
  );
};

const Order: NextPage = () => {
  return (
    <AppLayout>
      <CmsOrderRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Order;
