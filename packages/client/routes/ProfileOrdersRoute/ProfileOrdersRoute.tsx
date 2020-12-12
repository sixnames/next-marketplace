import React from 'react';
import classes from './ProfileOrdersRoute.module.css';
import { MyOrderFragment, useGetAllMyOrdersQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Currency from '../../components/Currency/Currency';
import ControlButtonChevron from '../../components/Buttons/ControlButtonChevron';
import FormattedDate from '../../components/FormattedDateTime/FormattedDate';
import ControlButton from '../../components/Buttons/ControlButton';

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
                от <FormattedDate value={createdAt} />
              </div>
            </div>
          </div>
          <div>
            <div className={classes.orderHeadGrid}>
              <div>
                <Currency className={classes.orderTotalPrice} value={formattedTotalPrice} />
              </div>
              <div className={classes.orderStatus} style={{ color: status.color }}>
                {status.nameString}
              </div>
            </div>
          </div>
        </div>
        <div>
          <ControlButton
            roundedTopRight
            className={classes.orderCartBtn}
            iconSize={'big'}
            icon={'cart'}
          />
        </div>
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
