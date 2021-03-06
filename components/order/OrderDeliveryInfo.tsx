import { OrderDeliveryInfoModel } from 'db/dbModels';
import * as React from 'react';
import FormattedDateTime from '../FormattedDateTime';

interface OrderDeliveryInfoInterface {
  deliveryInfo?: OrderDeliveryInfoModel | null;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  titleClassName?: string;
}

const OrderDeliveryInfo: React.FC<OrderDeliveryInfoInterface> = ({
  deliveryInfo,
  labelClassName,
  className,
  itemClassName,
  valueClassName,
  titleClassName,
}) => {
  if (!deliveryInfo || !deliveryInfo.address) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className ? className : ''}`}>
      <div className={titleClassName || 'text-lg font-medium lg:text-xl'}>Адрес доставки</div>

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

      {deliveryInfo.recipientName ? (
        <div className={itemClassName}>
          <div className={labelClassName}>Имя и фамилия:</div>
          <div className={valueClassName}>{deliveryInfo.recipientName}</div>
        </div>
      ) : null}

      {deliveryInfo.recipientName ? (
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
