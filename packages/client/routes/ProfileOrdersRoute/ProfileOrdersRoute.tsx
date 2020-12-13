import React, { useState } from 'react';
import classes from './ProfileOrdersRoute.module.css';
import { MyOrderFragment, useGetAllMyOrdersQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Currency from '../../components/Currency/Currency';
import ControlButtonChevron from '../../components/Buttons/ControlButtonChevron';
import FormattedDate from '../../components/FormattedDateTime/FormattedDate';
import ControlButton from '../../components/Buttons/ControlButton';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import Tooltip from '../../components/TTip/Tooltip';

interface ProfileOrderInterface {
  order: MyOrderFragment;
}

const ProfileOrder: React.FC<ProfileOrderInterface> = ({ order }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { itemId, createdAt, formattedTotalPrice, status } = order;
  return (
    <Disclosure defaultOpen={true} onChange={() => setIsOpen((prevState) => !prevState)}>
      <div className={classes.order}>
        <div className={`${classes.orderMainGrid} ${classes.orderHead}`}>
          <DisclosureButton as={'div'} className={`${classes.orderTrigger}`}>
            <ControlButtonChevron isActive={isOpen} />
          </DisclosureButton>
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
            <Tooltip title={'Повторить заказ'}>
              <div>
                <ControlButton
                  roundedTopRight
                  className={classes.orderCartBtn}
                  iconSize={'big'}
                  icon={'cart'}
                />
              </div>
            </Tooltip>
          </div>
        </div>

        <DisclosurePanel>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis dolorum ducimus illum
            in iste. Asperiores consequuntur dicta, dolorum ea eaque et, fuga iure labore laboriosam
            laborum natus odit quisquam. Culpa. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Debitis dolorum ducimus illum in iste. Asperiores consequuntur dicta, dolorum ea
            eaque et, fuga iure labore laboriosam laborum natus odit quisquam. Culpa. Lorem ipsum
            dolor sit amet, consectetur adipisicing elit. Debitis dolorum ducimus illum in iste.
            Asperiores consequuntur dicta, dolorum ea eaque et, fuga iure labore laboriosam laborum
            natus odit quisquam. Culpa. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Debitis dolorum ducimus illum in iste. Asperiores consequuntur dicta, dolorum ea eaque
            et, fuga iure labore laboriosam laborum natus odit quisquam. Culpa. Lorem ipsum dolor
            sit amet, consectetur adipisicing elit. Debitis dolorum ducimus illum in iste.
            Asperiores consequuntur dicta, dolorum ea eaque et, fuga iure labore laboriosam laborum
            natus odit quisquam. Culpa.
          </div>
        </DisclosurePanel>
      </div>
    </Disclosure>
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
