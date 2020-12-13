import React, { useState } from 'react';
import classes from './ProfileOrdersRoute.module.css';
import {
  MyOrderFragment,
  MyOrderProductFragment,
  useGetAllMyOrdersQuery,
} from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import Currency from '../../components/Currency/Currency';
import ControlButtonChevron from '../../components/Buttons/ControlButtonChevron';
import FormattedDate from '../../components/FormattedDateTime/FormattedDate';
import ControlButton from '../../components/Buttons/ControlButton';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import Tooltip from '../../components/TTip/Tooltip';
import Image from '../../components/Image/Image';
import ProductShopPrices from '../../components/Product/ProductShopPrices/ProductShopPrices';
import Icon from '../../components/Icon/Icon';

interface ProfileOrderProductInterface {
  orderProduct: MyOrderProductFragment;
}

const ProfileOrderProduct: React.FC<ProfileOrderProductInterface> = ({ orderProduct }) => {
  const {
    nameString,
    shopProduct,
    itemId,
    shop,
    formattedPrice,
    formattedOldPrice,
    discountedPercent,
    amount,
  } = orderProduct;
  const imageWidth = 35;

  return (
    <div className={`${classes.orderProduct} ${classes.orderMainGrid}`}>
      <div className={classes.productImage}>
        <Image
          url={shopProduct?.product?.mainImage}
          alt={nameString}
          title={nameString}
          width={imageWidth}
        />
      </div>
      <div>
        <div className={classes.productArt}>{`Артикул: ${itemId}`}</div>

        <div className={classes.orderProductGrid}>
          <div className={classes.productName}>{nameString}</div>

          <div className={classes.productTotals}>
            <ProductShopPrices
              className={classes.productTotalsPrice}
              formattedPrice={formattedPrice}
              formattedOldPrice={formattedOldPrice}
              discountedPercent={discountedPercent}
              size={'small'}
            />
            <Icon name={'cross'} className={classes.productTotalsIcon} />
            <div className={classes.productTotalsAmount}>{amount}</div>
          </div>

          {shop ? (
            <div className={classes.shop}>
              <div>
                <span>винотека: </span>
                {shop.nameString}
              </div>
              <div>{shop.address.formattedAddress}</div>
            </div>
          ) : (
            <div className={classes.shop}>Магазин не найден</div>
          )}
        </div>
      </div>
      <div className={classes.orderProductBtn}>
        <Tooltip title={'Добавить в корзину'}>
          <div>
            <ControlButton icon={'cart'} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

interface ProfileOrderInterface {
  order: MyOrderFragment;
}

const ProfileOrder: React.FC<ProfileOrderInterface> = ({ order }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { itemId, createdAt, formattedTotalPrice, status, products } = order;
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
          {products.map((orderProduct) => {
            return <ProfileOrderProduct orderProduct={orderProduct} key={orderProduct.id} />;
          })}
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
