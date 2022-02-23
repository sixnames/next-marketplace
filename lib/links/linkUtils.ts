import { ObjectIdModel } from 'db/dbModels';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { ParsedUrlQuery } from 'querystring';

export interface GetBasePathInterface {
  query: ParsedUrlQuery;
  asPath: string;
  breakpoint: string;
}
export function getBasePath({ query, asPath, breakpoint }: GetBasePathInterface): string {
  let breakpointArg = query[breakpoint];
  if (!breakpointArg) {
    breakpointArg = breakpoint;
  }
  const urlParts = asPath.split(`${breakpointArg}`);
  return `${urlParts[0]}${breakpointArg}`;
}

// order
interface GetOrderLinkInterface {
  variant?: 'companyManager' | 'siteAdmin';
  companyId?: ObjectIdModel | string;
  orderObjectId?: ObjectIdModel | string;
  domain?: string | null;
}

export function getOrderLink(props?: GetOrderLinkInterface) {
  const { variant, companyId, orderObjectId } = props || {};
  const protocol = 'https://';
  const links = getProjectLinks({
    orderId: orderObjectId,
  });
  let path = links.profile.url;
  const domain = props?.domain || `${process.env.DEFAULT_DOMAIN}`;

  if (variant === 'companyManager' && companyId && orderObjectId) {
    path = links.console.companyId.orders.order.orderId.url;
  }

  if (variant === 'siteAdmin' && orderObjectId) {
    path = links.cms.orders.orderId.url;
  }

  return `${protocol}${domain}${path}`;
}
