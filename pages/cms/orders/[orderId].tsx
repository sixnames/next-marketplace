import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import Inner from 'components/Inner/Inner';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import { useGetCmsOrderQuery } from 'generated/apolloComponents';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
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

const Order: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <CmsOrderRoute />
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Order;