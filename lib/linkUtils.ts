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
  basePath: string;
  rubricSlug?: string;
  productId?: string | ObjectIdModel;
}
export function getShopCompanyLinks({
  shopId = '',
  basePath,
  rubricSlug,
  productId,
}: GetConsoleShopLinkInterface) {
  const root = `${basePath}/${shopId}`;
  const productsRoot = `${root}/products`;
  const rubricRoot = `${productsRoot}/${rubricSlug}`;
  const productRoot = `${rubricRoot}/product/${productId}`;

  return {
    root,
    shopBasePath: basePath,
    assets: `${root}/assets`,
    orders: `${root}/shop-orders`,
    syncErrors: `${root}/sync-errors`,
    products: {
      root: productsRoot,
      rubric: {
        root: rubricRoot,
        add: `${rubricRoot}/add`,
        product: {
          root: productRoot,
          suppliers: `${productRoot}/suppliers`,
        },
      },
    },
  };
}

// console company
interface GetConsoleCompanyLinkInterface extends GetConsoleRubricLinkInterface {
  companyId?: string | ObjectIdModel;
  shopId?: string | ObjectIdModel;
}
export function getConsoleCompanyLinks({
  companyId = '',
  basePath = ROUTE_CMS,
  rubricSlug,
  shopId,
}: GetConsoleCompanyLinkInterface) {
  const parentLink = `${basePath}/companies`;
  const root = `${parentLink}/${companyId}`;
  return {
    parentLink,
    root,
    create: `${parentLink}/create`,
    blog: `${root}/blog`,
    giftCertificates: `${root}/gift-certificates`,
    pages: `${root}/pages`,
    promo: `${root}/promo`,
    shops: `${root}/shops`,
    shop: getShopCompanyLinks({
      basePath: `${root}/shops/shop`,
      rubricSlug,
      shopId,
    }),
    assets: `${root}/assets`,
    config: getConsoleConfigsLinks({
      basePath: root,
    }),
    userCategories: `${root}/user-categories`,
    rubrics: getConsoleRubricLinks({
      basePath: root,
      rubricSlug,
    }),
  };
}
