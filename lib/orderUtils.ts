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
  };
}
