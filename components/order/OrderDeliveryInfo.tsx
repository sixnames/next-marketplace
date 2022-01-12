import * as React from 'react';
import { OrderDeliveryInfoModel } from '../../db/dbModels';
import FormattedDateTime from '../FormattedDateTime';
import WpLink from '../Link/WpLink';

interface OrderDeliveryInfoInterface {
  deliveryInfo?: OrderDeliveryInfoModel | null;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  titleClassName?: string;
  userLink?: string;
}

const OrderDeliveryInfo: React.FC<OrderDeliveryInfoInterface> = ({
  deliveryInfo,
  labelClassName,
  className,
  itemClassName,
  valueClassName,
  titleClassName,
  userLink,
}) => {
  if (!deliveryInfo || !deliveryInfo.address) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className ? className : ''}`}>
      <div className={titleClassName || 'font-medium text-lg lg:text-xl'}>Адрес доставки</div>

      <div className={itemClassName}>
        <div className={labelClassName}>Адрес:</div>
        <div className={valueClassName}>{deliveryInfo.address.readableAddress}</div>
      </div>

      {deliveryInfo.entrance ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Подъезд:</div>
          <div className={valueClassName}>{deliveryInfo.entrance}</div>
        </div>
      ) : null}

      {deliveryInfo.intercom ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Домофон:</div>
          <div className={valueClassName}>{deliveryInfo.intercom}</div>
        </div>
      ) : null}

      {deliveryInfo.floor ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Этаж:</div>
          <div className={valueClassName}>{deliveryInfo.floor}</div>
        </div>
      ) : null}

      {deliveryInfo.apartment ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Квартира / офис:</div>
          <div className={valueClassName}>{deliveryInfo.apartment}</div>
        </div>
      ) : null}

      {deliveryInfo.desiredDeliveryDate ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Желаемая дата и время доставки:</div>
          <div className={valueClassName}>
            <FormattedDateTime value={deliveryInfo.desiredDeliveryDate} />
          </div>
        </div>
      ) : null}

      {deliveryInfo.recipientName && userLink ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Имя и фамилия:</div>
          <WpLink href={userLink} className={valueClassName}>
            {deliveryInfo.recipientName}
          </WpLink>
        </div>
      ) : null}

      {deliveryInfo.recipientName && !userLink ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Имя и фамилия:</div>
          <div className={valueClassName}>{deliveryInfo.recipientName}</div>
        </div>
      ) : null}

      {deliveryInfo.recipientPhone ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Телефон:</div>
          <div className={valueClassName}>{deliveryInfo.recipientPhone}</div>
        </div>
      ) : null}

      {deliveryInfo.commentForCourier ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Комментарий курьеру:</div>
          <div className={valueClassName}>{deliveryInfo.commentForCourier}</div>
        </div>
      ) : null}
    </div>
  );
};

export default OrderDeliveryInfo;
