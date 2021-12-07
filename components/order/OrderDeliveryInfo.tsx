import FormattedDateTime from 'components/FormattedDateTime';
import { OrderDeliveryInfoModel } from 'db/dbModels';
import * as React from 'react';

interface OrderDeliveryInfoInterface {
  deliveryInfo?: OrderDeliveryInfoModel | null;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

const OrderDeliveryInfo: React.FC<OrderDeliveryInfoInterface> = ({
  deliveryInfo,
  labelClassName,
  className,
  itemClassName,
  valueClassName,
}) => {
  if (!deliveryInfo || !deliveryInfo.address) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className ? className : ''}`}>
      <div className={itemClassName}>
        <div className={labelClassName}>Адрес:</div>
        <div className={valueClassName}>{deliveryInfo.address.readableAddress}</div>
      </div>

      <div className={itemClassName}>
        <div className={labelClassName}>Подъезд:</div>
        <div className={valueClassName}>{deliveryInfo.entrance || 'Не назначен'}</div>
      </div>

      <div className={itemClassName}>
        <div className={labelClassName}>Домофон:</div>
        <div className={valueClassName}>{deliveryInfo.intercom || 'Не назначен'}</div>
      </div>

      <div className={itemClassName}>
        <div className={labelClassName}>Этаж:</div>
        <div className={valueClassName}>{deliveryInfo.floor || 'Не назначен'}</div>
      </div>

      <div className={itemClassName}>
        <div className={labelClassName}>Квартира / офис:</div>
        <div className={valueClassName}>{deliveryInfo.apartment || 'Не назначена'}</div>
      </div>

      <div className={itemClassName}>
        <div className={labelClassName}>Желаемая дата и время доставки:</div>
        <div className={valueClassName}>
          {deliveryInfo.desiredDeliveryDate ? (
            <FormattedDateTime value={deliveryInfo.desiredDeliveryDate} />
          ) : (
            'Не назначена'
          )}
        </div>
      </div>

      <div className={itemClassName}>
        <div className={labelClassName}>Имя и фамилия:</div>
        <div className={valueClassName}>{deliveryInfo.recipientName || 'Не назначен'}</div>
      </div>

      <div className={itemClassName}>
        <div className={labelClassName}>Телефон:</div>
        <div className={valueClassName}>{deliveryInfo.recipientPhone || 'Не назначен'}</div>
      </div>

      <div className={itemClassName}>
        <div className={labelClassName}>Комментарий курьеру:</div>
        <div className={valueClassName}>{deliveryInfo.commentForCourier || 'Не назначен'}</div>
      </div>
    </div>
  );
};

export default OrderDeliveryInfo;
