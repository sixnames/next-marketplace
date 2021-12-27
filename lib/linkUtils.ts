import { ROUTE_CMS, ROUTE_CONSOLE, ROUTE_PROFILE } from '../config/common';
import { ObjectIdModel } from '../db/dbModels';

// order
interface GetOrderLinkInterface {
  variant?: 'companyManager' | 'siteAdmin';
  companyId?: ObjectIdModel;
  orderObjectId?: ObjectIdModel;
  domain?: string | null;
}

export function getOrderLink(props?: GetOrderLinkInterface) {
  const { variant, companyId, orderObjectId } = props || {};
  const protocol = 'https://';
  let path = ROUTE_PROFILE;
  const domain = props?.domain || `${process.env.DEFAULT_DOMAIN}`;

  if (variant === 'companyManager' && companyId && orderObjectId) {
    path = `${ROUTE_CONSOLE}/orders/order/${orderObjectId.toHexString()}`;
  }

  if (variant === 'siteAdmin' && orderObjectId) {
    path = `${ROUTE_CMS}/orders/${orderObjectId.toHexString()}`;
  }

  return `${protocol}${domain}${path}`;
}

// rubric
interface GetCmsRubricLinkInterface {
  rubricSlug: string;
  basePath: string;
}
export function getConsoleRubricLinks({ rubricSlug, basePath }: GetCmsRubricLinkInterface) {
  return {
    root: `${basePath}/rubrics/${rubricSlug}`,
    products: `${basePath}/rubrics/${rubricSlug}/products`,
    categories: `${basePath}/rubrics/${rubricSlug}/categories`,
    seoContent: `${basePath}/rubrics/${rubricSlug}/seo-content`,
    attributes: `${basePath}/rubrics/${rubricSlug}/attributes`,
  };
}

// product
interface GetConsoleProductLinksInterface extends GetCmsRubricLinkInterface {
  productId: string;
}

export function getConsoleProductLinks({
  rubricSlug,
  productId,
  basePath,
}: GetConsoleProductLinksInterface) {
  const { products } = getConsoleRubricLinks({ rubricSlug, basePath });
  return {
    assets: `${products}/product/${productId}/assets`,
    attributes: `${products}/product/${productId}/attributes`,
    brands: `${products}/product/${productId}/brands`,
    categories: `${products}/product/${productId}/categories`,
    constructor: `${products}/product/${productId}/constructor`,
    root: `${products}/product/${productId}`,
    variants: `${products}/product/${productId}/variants`,
  };
}
