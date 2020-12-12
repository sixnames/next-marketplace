import React from 'react';
import classes from './ProfileOrdersRoute.module.css';
import { useGetAllMyOrdersQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';

const ProfileOrdersRoute: React.FC = () => {
  const { data, loading, error } = useGetAllMyOrdersQuery();

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllMyOrders) {
    return <RequestError />;
  }

  const { docs } = data.getAllMyOrders;

  return (
    <div className={classes.frame} data-cy={'profile-orders'}>
      <pre>{JSON.stringify(docs, null, 2)}</pre>
    </div>
  );
};

export default ProfileOrdersRoute;
