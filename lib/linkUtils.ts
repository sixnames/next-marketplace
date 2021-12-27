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

// console rubric
interface GetConsoleRubricLinkInterface {
  rubricSlug?: string;
  basePath?: string;
}
export function getConsoleRubricLinks({
  rubricSlug = '',
  basePath = ROUTE_CMS,
}: GetConsoleRubricLinkInterface) {
  const parentLink = `${basePath}/rubrics`;
  const root = `${parentLink}/${rubricSlug}`;
  return {
    parentLink,
    root,
    products: `${root}/products`,
    categories: `${root}/categories`,
    seoContent: `${root}/seo-content`,
    attributes: `${root}/attributes`,
  };
}

// console product
interface GetConsoleProductLinksInterface extends GetConsoleRubricLinkInterface {
  productId: string;
}

export function getConsoleProductLinks({
  rubricSlug,
  productId,
  basePath = ROUTE_CMS,
}: GetConsoleProductLinksInterface) {
  const rubric = getConsoleRubricLinks({ rubricSlug, basePath });
  const root = `${rubric.products}/product/${productId}`;
  return {
    root,
    rubric,
    assets: `${root}/assets`,
    attributes: `${root}/attributes`,
    brands: `${root}/brands`,
    categories: `${root}/categories`,
    constructor: `${root}/constructor`,
    variants: `${root}/variants`,
  };
}

// console rubric
interface GetConsoleCompanyLinkInterface extends GetConsoleRubricLinkInterface {
  companyId?: string | ObjectIdModel;
}
export function getConsoleCompanyLinks({
  companyId = '',
  basePath = ROUTE_CMS,
  rubricSlug,
}: GetConsoleCompanyLinkInterface) {
  const parentLink = `${basePath}/companies`;
  const root = `${parentLink}/${companyId}`;
  return {
    parentLink,
    root,
    create: `${parentLink}/create`,
    blog: `${root}/blog`,
    config: `${root}/config`,
    giftCertificates: `${root}/gift-certificates`,
    pages: `${root}/pages`,
    promo: `${root}/promo`,
    shops: `${root}/shops`,
    assets: `${root}/assets`,
    userCategories: `${root}/user-categories`,
    rubrics: getConsoleRubricLinks({
      basePath: root,
      rubricSlug,
    }),
  };
}
