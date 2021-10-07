import { ROUTE_CMS, ROUTE_CONSOLE, ROUTE_PROFILE } from 'config/common';
import { ObjectIdModel } from 'db/dbModels';

interface GetOrderLinkInterface {
  variant?: 'companyManager' | 'siteAdmin';
  companyId?: ObjectIdModel;
  orderObjectId?: ObjectIdModel;
}

export function getOrderLink(props?: GetOrderLinkInterface) {
  const { variant, companyId, orderObjectId } = props || {};
  const protocol = 'https://';
  const domain = process.env.DEFAULT_DOMAIN;
  let path = ROUTE_PROFILE;

  if (variant === 'companyManager' && companyId && orderObjectId) {
    path = `${ROUTE_CONSOLE}/orders/order/${orderObjectId.toHexString()}`;
  }

  if (variant === 'siteAdmin' && orderObjectId) {
    path = `${ROUTE_CMS}/orders/${orderObjectId.toHexString()}`;
  }

  return `${protocol}${domain}${path}`;
}
