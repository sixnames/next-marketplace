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

// console category
interface GetConsoleCategoryLinkInterface extends GetConsoleProductLinksInterface {
  categoryId?: string | ObjectIdModel;
  basePath?: string;
}
export function getConsoleCategoryLinks({ categoryId, basePath }: GetConsoleCategoryLinkInterface) {
  const parentLink = `${basePath}/categories`;
  const root = `${parentLink}/${categoryId}`;

  return {
    parentLink,
    root,
    attributes: `${root}/attributes`,
  };
}

// console rubric
interface GetConsoleRubricLinkInterface
  extends GetConsoleProductLinksInterface,
    GetConsoleCategoryLinkInterface {
  rubricSlug?: string;
  basePath?: string;
}
export function getConsoleRubricLinks({
  rubricSlug = '',
  basePath = ROUTE_CMS,
  productId,
  categoryId,
}: GetConsoleRubricLinkInterface) {
  const parentLink = `${basePath}/rubrics`;
  const root = `${parentLink}/${rubricSlug}`;

  return {
    parentLink,
    root,
    seoContent: `${root}/seo-content`,
    attributes: `${root}/attributes`,
    category: getConsoleCategoryLinks({
      basePath: root,
      categoryId,
    }),
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
    project: `${root}/project`,
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
interface GetConsoleCompanyPromoCodeLinkInterface {
  basePath?: string;
  promoCodeId?: string | ObjectIdModel;
}
export function getConsoleCompanyPromoCodeLinks({
  basePath,
  promoCodeId,
}: GetConsoleCompanyPromoCodeLinkInterface) {
  const parentLink = `${basePath}/code`;
  const root = `${parentLink}/${promoCodeId}`;
  return {
    parentLink,
    root,
  };
}

interface GetConsoleCompanyPromoLinkInterface extends GetConsoleCompanyPromoCodeLinkInterface {
  basePath?: string;
  promoId?: string | ObjectIdModel;
  rubricSlug?: string;
}
export function getConsoleCompanyPromoLinks({
  basePath,
  promoId,
  rubricSlug,
  promoCodeId,
}: GetConsoleCompanyPromoLinkInterface) {
  const parentLink = `${basePath}/promo`;
  const root = `${parentLink}/details/${promoId}`;
  return {
    parentLink,
    root,
    code: getConsoleCompanyPromoCodeLinks({
      basePath: root,
      promoCodeId,
    }),
    rubrics: getConsoleRubricLinks({
      basePath: root,
      rubricSlug,
    }),
  };
}

interface GetConsoleGiftCertificateLinks {
  basePath?: string;
  giftCertificateId?: string | ObjectIdModel;
}

export function getConsoleGiftCertificateLinks({
  basePath,
  giftCertificateId,
}: GetConsoleGiftCertificateLinks) {
  const parentLink = `${basePath}/gift-certificates`;
  const root = `${parentLink}/certificate/${giftCertificateId}`;
  return {
    parentLink,
    root,
  };
}

export interface GetConsolePagesLinksInterface {
  basePath?: string;
  pagesGroupId?: string | ObjectIdModel;
  pageId?: string | ObjectIdModel;
}

export function getConsolePagesLinks({
  basePath,
  pageId,
  pagesGroupId,
}: GetConsolePagesLinksInterface) {
  const mainPath = `/pages`;
  const parentLink = `${basePath}${mainPath}`;
  const root = `${parentLink}/${pagesGroupId}`;

  return {
    mainPath,
    parentLink,
    root,
    page: {
      root: `${root}/${pageId}`,
    },
  };
}

export interface GetConsoleBlogLinksInterface {
  basePath?: string;
  blogPostId?: string | ObjectIdModel;
}

export function getConsoleBlogLinks({ basePath, blogPostId }: GetConsoleBlogLinksInterface) {
  const mainPath = '/blog';
  const parentLink = `${basePath}${mainPath}`;
  const itemPath = `${parentLink}/post`;
  const root = `${itemPath}/${blogPostId}`;
  return {
    parentLink,
    mainPath,
    itemPath,
    root,
    attributes: `${parentLink}/attributes`,
  };
}

// console company
interface GetCmsCompanyLinkInterface
  extends GetConsoleRubricLinkInterface,
    GetConsoleShopLinkInterface,
    GetConsoleGiftCertificateLinks,
    GetConsoleCompanyPromoLinkInterface,
    GetConsoleBlogLinksInterface,
    GetConsolePagesLinksInterface,
    GetConsoleUserLinksInterface {
  companyId?: string | ObjectIdModel;
  shopId?: string | ObjectIdModel;
}
export function getCmsCompanyLinks({
  companyId = '',
  basePath = ROUTE_CMS,
  rubricSlug,
  shopId,
  productId,
  promoId,
  orderId,
  promoCodeId,
  categoryId,
  giftCertificateId,
  userId,
  blogPostId,
  pagesGroupId,
  pageId,
}: GetCmsCompanyLinkInterface) {
  const parentLink = basePath?.includes(ROUTE_CMS) ? `${basePath}/companies` : basePath;
  const root = `${parentLink}/${companyId}`;

  return {
    parentLink,
    root,
    create: `${parentLink}/create`,
    giftCertificate: getConsoleGiftCertificateLinks({
      basePath: root,
      giftCertificateId,
    }),
    assets: `${root}/assets`,
    userCategories: `${root}/user-categories`,
    pages: getConsolePagesLinks({
      basePath: root,
      pagesGroupId,
      pageId,
    }),
    promo: getConsoleCompanyPromoLinks({
      basePath: root,
      rubricSlug,
      promoId,
      promoCodeId,
    }),
    blog: getConsoleBlogLinks({
      basePath: root,
      blogPostId,
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
      categoryId,
    }),
    user: getConsoleUserLinks({
      basePath: root,
      userId: userId,
      orderId: orderId,
    }),
  };
}

interface GetConsoleUserLinksInterface {
  userId?: string | ObjectIdModel;
  basePath?: string;
  orderId?: string | ObjectIdModel;
}

export function getConsoleUserLinks({
  basePath = ROUTE_CMS,
  orderId,
  userId,
}: GetConsoleUserLinksInterface) {
  const parentLink = `${basePath}/users`;
  const itemPath = `${parentLink}/user`;
  const root = `${itemPath}/${userId}`;
  const ordersParentLink = `${root}/orders`;

  return {
    parentLink,
    itemPath,
    root,
    assets: `${root}/assets`,
    notifications: `${root}/notifications`,
    categories: `${root}/categories`,
    password: `${root}/password`,
    order: {
      parentLink: ordersParentLink,
      root: `${ordersParentLink}/${orderId}`,
    },
  };
}

interface GetConsoleCompanyLinkInterface extends GetCmsCompanyLinkInterface {
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
  };
}

export interface GetCmsAttributesLinks {
  attributesGroupId?: string | ObjectIdModel;
  attributeId?: string | ObjectIdModel;
  basePath?: string;
}

export function getCmsAttributesLinks({
  attributeId,
  attributesGroupId,
  basePath,
}: GetCmsAttributesLinks) {
  const parentLink = `${basePath}/attributes`;
  const root = `${parentLink}/${attributesGroupId}`;
  const attributesParentLink = `${root}/attributes`;
  const attributeRoot = `${attributesParentLink}/${attributeId}`;
  return {
    parentLink,
    root,
    attribute: {
      parentLink: attributesParentLink,
      root: attributeRoot,
    },
  };
}

export interface GetCmsLinksInterface
  extends Omit<GetCmsCompanyLinkInterface, 'basePath'>,
    GetCmsAttributesLinks,
    GetConsolePagesLinksInterface {}

export function getCmsLinks(props: GetCmsLinksInterface) {
  const {
    rubricSlug,
    productId,
    categoryId,
    blogPostId,
    userId,
    orderId,
    attributeId,
    attributesGroupId,
    pageId,
    pagesGroupId,
  } = props;
  const root = ROUTE_CMS;
  const basePath = root;

  return {
    root,
    companies: getCmsCompanyLinks({
      ...props,
      basePath,
    }),
    rubrics: getConsoleRubricLinks({
      basePath,
      rubricSlug: rubricSlug,
      productId: productId,
      categoryId: categoryId,
    }),
    pages: getConsolePagesLinks({
      basePath: root,
      pagesGroupId,
      pageId,
    }),
    blog: getConsoleBlogLinks({
      basePath,
      blogPostId: blogPostId,
    }),
    user: getConsoleUserLinks({
      basePath,
      userId: userId,
      orderId: orderId,
    }),
    config: getConsoleConfigsLinks({
      basePath,
    }),
    attributes: getCmsAttributesLinks({
      basePath,
      attributesGroupId,
      attributeId,
    }),
  };
}
