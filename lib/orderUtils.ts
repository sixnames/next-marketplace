import {
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DONE,
  ORDER_STATUS_PENDING,
} from 'config/common';
import { OrderStatusInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';

interface CastOrderStatusInterface {
  locale?: string;
  initialStatus?: OrderStatusInterface | null;
}
export function castOrderStatus({
  locale,
  initialStatus,
}: CastOrderStatusInterface): OrderStatusInterface | null {
  if (!initialStatus) {
    return null;
  }

  return {
    ...initialStatus,
    name: getFieldStringLocale(initialStatus.nameI18n, locale),
    isPending: initialStatus.slug === ORDER_STATUS_PENDING,
    isConfirmed: initialStatus.slug === ORDER_STATUS_CONFIRMED,
    isDone: initialStatus.slug === ORDER_STATUS_DONE,
    isCanceled: initialStatus.slug === ORDER_STATUS_CANCELED,
  };
}
