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

// console product
interface GetConsoleProductLinksInterface {
  productId?: string | ObjectIdModel;
  basePath?: string;
}

export function getConsoleProductLinks({
  productId,
  basePath = ROUTE_CMS,
}: GetConsoleProductLinksInterface) {
  const parentLink = `${basePath}/products`;
  const itemPath = `${parentLink}/product`;
  const root = `${itemPath}/${productId}`;

  return {
    root,
    itemPath,
    parentLink,
    assets: `${root}/assets`,
    attributes: `${root}/attributes`,
    brands: `${root}/brands`,
    categories: `${root}/categories`,
    constructor: `${root}/constructor`,
    variants: `${root}/variants`,
    suppliers: `${root}/suppliers`,
  };
}

// console rubric
interface GetConsoleRubricLinkInterface extends GetConsoleProductLinksInterface {
  rubricSlug?: string;
  basePath?: string;
}
export function getConsoleRubricLinks({
  rubricSlug = '',
  basePath = ROUTE_CMS,
  productId,
}: GetConsoleRubricLinkInterface) {
  const parentLink = `${basePath}/rubrics`;
  const root = `${parentLink}/${rubricSlug}`;

  return {
    parentLink,
    root,
    categories: `${root}/categories`,
    seoContent: `${root}/seo-content`,
    attributes: `${root}/attributes`,
    add: `${root}/add`,
    product: getConsoleProductLinks({
      productId,
      basePath: root,
    }),
  };
}

// console configs
interface GetConsoleConfigsLinkInterface {
  basePath?: string;
}
export function getConsoleConfigsLinks({ basePath = ROUTE_CMS }: GetConsoleConfigsLinkInterface) {
  const parentLink = `${basePath}`;
  const root = `${parentLink}/config`;
  return {
    parentLink,
    root,
    analytics: `${root}/analytics`,
    catalogue: `${root}/catalogue`,
    contacts: `${root}/contacts`,
    seo: `${root}/seo`,
    ui: `${root}/ui`,
  };
}

// console shop
interface GetConsoleShopLinkInterface {
  shopId?: string | ObjectIdModel;
  basePath?: string;
  rubricSlug?: string;
  productId?: string | ObjectIdModel;
  orderId?: string | ObjectIdModel;
}
export function getConsoleShopLinks({
  shopId = '',
  basePath,
  rubricSlug,
  productId,
  orderId,
}: GetConsoleShopLinkInterface) {
  const parentLink = `${basePath}/shops`;
  const itemPath = `${parentLink}/shop`;
  const root = `${itemPath}/${shopId}`;
  const productsRoot = `${root}/products`;
  const rubricRoot = `${productsRoot}/${rubricSlug}`;
  const productBasePath = `${rubricRoot}/product`;
  const orderParentLink = `${root}/shop-orders`;

  return {
    root,
    parentLink,
    itemPath,
    productBasePath,
    assets: `${root}/assets`,
    order: {
      parentLink: orderParentLink,
      root: `${orderParentLink}/${orderId}`,
    },
    syncErrors: `${root}/sync-errors`,
    rubrics: getConsoleRubricLinks({
      basePath: root,
      rubricSlug,
      productId,
    }),
  };
}

// console company
interface GetConsoleCompanyPromoLinkInterface {
  basePath: string;
  promoId?: string | ObjectIdModel;
  rubricSlug?: string;
}
export function getConsoleCompanyPromoLinks({
  basePath,
  promoId,
  rubricSlug,
}: GetConsoleCompanyPromoLinkInterface) {
  const parentLink = `${basePath}/promo`;
  const root = `${parentLink}/details/${promoId}`;
  return {
    parentLink,
    root,
    rubrics: getConsoleRubricLinks({
      basePath: root,
      rubricSlug,
    }),
  };
}

// console company
interface GetCmsCompanyLinkInterface
  extends GetConsoleRubricLinkInterface,
    GetConsoleShopLinkInterface {
  companyId?: string | ObjectIdModel;
  shopId?: string | ObjectIdModel;
  promoId?: string | ObjectIdModel;
}
export function getCmsCompanyLinks({
  companyId = '',
  basePath = ROUTE_CMS,
  rubricSlug,
  shopId,
  productId,
  promoId,
  orderId,
}: GetCmsCompanyLinkInterface) {
  const parentLink = basePath?.includes(ROUTE_CMS) ? `${basePath}/companies` : basePath;
  const root = `${parentLink}/${companyId}`;

  return {
    parentLink,
    root,
    create: `${parentLink}/create`,
    blog: `${root}/blog`,
    giftCertificates: `${root}/gift-certificates`,
    pages: `${root}/pages`,
    assets: `${root}/assets`,
    userCategories: `${root}/user-categories`,
    promo: getConsoleCompanyPromoLinks({
      basePath: root,
      rubricSlug,
      promoId,
    }),
    shop: getConsoleShopLinks({
      basePath: root,
      rubricSlug,
      shopId,
      productId,
      orderId,
    }),
    config: getConsoleConfigsLinks({
      basePath: root,
    }),
    rubrics: getConsoleRubricLinks({
      basePath: root,
      rubricSlug,
      productId,
    }),
  };
}

interface getConsoleUserLinksInterface {
  userId?: string | ObjectIdModel;
  basePath?: string;
  orderId?: string | ObjectIdModel;
}

export function getConsoleUserLinks({ basePath, orderId, userId }: getConsoleUserLinksInterface) {
  const parentLink = `${basePath}/users`;
  const itemPath = `${parentLink}/user`;
  const root = `${itemPath}/${userId}`;
  const ordersParentLink = `${root}/orders`;

  return {
    parentLink,
    itemPath,
    root,
    order: {
      parentLink: ordersParentLink,
      root: `${ordersParentLink}/${orderId}`,
    },
  };
}

interface GetConsoleCompanyLinkInterface
  extends GetCmsCompanyLinkInterface,
    getConsoleUserLinksInterface {
  companyId: string | ObjectIdModel;
}

export function getConsoleCompanyLinks(props: GetConsoleCompanyLinkInterface) {
  const links = getCmsCompanyLinks({
    ...props,
    basePath: ROUTE_CONSOLE,
  });
  const configRoot = `${links.root}/config`;
  const orderParentLink = `${links.root}/orders`;

  return {
    ...links,
    config: {
      root: configRoot,
      assets: `${configRoot}/assets`,
      config: getConsoleConfigsLinks({
        basePath: configRoot,
      }),
    },
    order: {
      parentLink: orderParentLink,
      root: `${orderParentLink}/order/${props.orderId}`,
    },
    user: getConsoleUserLinks({
      basePath: links.root,
      userId: props.userId,
      orderId: props.orderId,
    }),
  };
}
