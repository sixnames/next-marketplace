import React from 'react';
import classes from './CmsOrderRoute.module.css';
import Inner from '../../components/Inner/Inner';
import DataLayout from '../../components/DataLayout/DataLayout';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { useRouter } from 'next/router';
import RequestError from '../../components/RequestError/RequestError';
import { useGetCmsOrderQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';

const CmsOrderRoute: React.FC = () => {
  const { query } = useRouter();
  const { orderId } = query;
  const { data, loading, error } = useGetCmsOrderQuery({
    variables: {
      id: `${orderId}`,
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

export default CmsOrderRoute;
