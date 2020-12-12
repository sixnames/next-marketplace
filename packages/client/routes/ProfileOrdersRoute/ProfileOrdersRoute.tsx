import React from 'react';
import classes from './ProfileOrdersRoute.module.css';
import { MyOrderFragment, useGetAllMyOrdersQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import FormattedDateTime from '../../components/FormattedDateTime/FormattedDateTime';
import Currency from '../../components/Currency/Currency';
import ControlButtonChevron from '../../components/Buttons/ControlButtonChevron';

interface ProfileOrderInterface {
  order: MyOrderFragment;
}

const ProfileOrder: React.FC<ProfileOrderInterface> = ({ order }) => {
  const { itemId, createdAt, formattedTotalPrice, status } = order;
  return (
    <div className={classes.order}>
      <div className={`${classes.orderMainGrid} ${classes.orderHead}`}>
        <div className={`${classes.orderTrigger}`}>
          <ControlButtonChevron />
        </div>
        <div className={classes.orderHeadGrid}>
          <div>
            <div className={classes.orderHeadGrid}>
              <div className={classes.orderNumber}>{`№ ${itemId}`}</div>
              <div className={classes.orderCreatedAt}>
                <FormattedDateTime value={createdAt} />
              </div>
            </div>
          </div>
          <div>
            <div className={classes.orderHeadGrid}>
              <div>
                <Currency value={formattedTotalPrice} />
              </div>
              <div>{status.nameString}</div>
            </div>
          </div>
        </div>
        <div>3</div>
      </div>
    </div>
  );
};

const ProfileOrdersRoute: React.FC = () => {
  const { data, loading, error } = useGetAllMyOrdersQuery({
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllMyOrders) {
    return <RequestError />;
  }

  const { docs } = data.getAllMyOrders;

  return (
    <div className={classes.frame} data-cy={'profile-orders'}>
      {docs.map((order) => {
        return <ProfileOrder key={order.id} order={order} />;
      })}
    </div>
  );
};

export default ProfileOrdersRoute;
