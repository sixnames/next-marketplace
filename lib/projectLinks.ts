import { ObjectId } from 'mongodb';

type DynamicPagePropType = ObjectId | string | null | undefined;

export interface LinkPropsInterface {
  basePath?: string;
  card: DynamicPagePropType;
  blogPostSlug: DynamicPagePropType;
  rubricSlug: DynamicPagePropType;
  pageSlug: DynamicPagePropType;
  attributesGroupId: DynamicPagePropType;
  blogPostId: DynamicPagePropType;
  brandId: DynamicPagePropType;
  companyId: DynamicPagePropType;
  giftCertificateId: DynamicPagePropType;
  pagesGroupId: DynamicPagePropType;
  pageId: DynamicPagePropType;
  promoId: DynamicPagePropType;
  promoCodeId: DynamicPagePropType;
  categoryId: DynamicPagePropType;
  productId: DynamicPagePropType;
  seoContentSlug: DynamicPagePropType;
  shopId: DynamicPagePropType;
  shopProductId: DynamicPagePropType;
  orderId: DynamicPagePropType;
  taskVariantId: DynamicPagePropType;
  taskId: DynamicPagePropType;
  optionsGroupId: DynamicPagePropType;
  optionId: DynamicPagePropType;
  roleId: DynamicPagePropType;
  rubricVariantId: DynamicPagePropType;
  userId: DynamicPagePropType;
  promoSlug: DynamicPagePropType;
}

export function getProjectLinks({
  card,
  blogPostSlug,
  rubricSlug,
  pageSlug,
  attributesGroupId,
  blogPostId,
  brandId,
  companyId,
  giftCertificateId,
  pagesGroupId,
  pageId,
  promoId,
  promoCodeId,
  categoryId,
  productId,
  seoContentSlug,
  shopId,
  shopProductId,
  orderId,
  taskVariantId,
  taskId,
  optionsGroupId,
  optionId,
  roleId,
  rubricVariantId,
  userId,
  promoSlug,
}: LinkPropsInterface) {
  return {
    '0': { url: `/0`, msk: { url: `/0/msk` } },
    '5': { url: `/5`, msk: { url: `/5/msk` } },
    '6': { url: `/6`, msk: { url: `/6/msk` } },
    '7': { url: `/7`, msk: { url: `/7/msk` } },
    '8': { url: `/8`, msk: { url: `/8/msk` } },
    '9': { url: `/9`, msk: { url: `/9/msk` } },
    '10': { url: `/10`, msk: { url: `/10/msk` } },
    '11': { url: `/11`, msk: { url: `/11/msk` } },
    '12': { url: `/12`, msk: { url: `/12/msk` } },
    '14': { url: `/14`, msk: { url: `/14/msk` } },
    '15': { url: `/15`, msk: { url: `/15/msk` } },
    '16': { url: `/16`, msk: { url: `/16/msk` } },
    '17': { url: `/17`, msk: { url: `/17/msk` } },
    '18': { url: `/18`, msk: { url: `/18/msk` } },
    '19': { url: `/19`, msk: { url: `/19/msk` } },
    '20': { url: `/20`, msk: { url: `/20/msk` } },
    '21': { url: `/21`, msk: { url: `/21/msk` } },
    '22': { url: `/22`, msk: { url: `/22/msk` } },
    '23': { url: `/23`, msk: { url: `/23/msk` } },
    '24': { url: `/24`, msk: { url: `/24/msk` } },
    '25': { url: `/25`, msk: { url: `/25/msk` } },
    '26': { url: `/26`, msk: { url: `/26/msk` } },
    '404': { url: `/404` },
    card: { url: `/${card}` },
    _app: { url: `/_app` },
    _document: { url: `/_document` },
    _error: { url: `/_error` },
    api: {
      url: `/api`,
      attributes: { url: `/api/attributes`, move: { url: `/api/attributes/move` } },
      auth: { url: `/api/auth` },
      blog: {
        url: `/api/blog`,
        addPostAsset: { url: `/api/blog/add-post-asset` },
        addPostLike: { url: `/api/blog/add-post-like` },
        attribute: { url: `/api/blog/attribute` },
        deletePreviewImage: { url: `/api/blog/delete-preview-image` },
        postPreviewImage: { url: `/api/blog/post-preview-image` },
        post: { url: `/api/blog/post` },
        updateAttributeCounters: { url: `/api/blog/update-attribute-counters` },
        updatePostAttribute: { url: `/api/blog/update-post-attribute` },
        updatePostCounters: { url: `/api/blog/update-post-counters` },
      },
      brand: { url: `/api/brand`, logo: { url: `/api/brand/logo` } },
      cart: {
        url: `/api/cart`,
        product: { url: `/api/cart/product` },
        repeatOrder: { url: `/api/cart/repeat-order` },
        sessionCart: { url: `/api/cart/session-cart` },
      },
      catalogue: {
        url: `/api/catalogue`,
        getProductSimilarItems: { url: `/api/catalogue/get-product-similar-items` },
      },
      category: {
        url: `/api/category`,
        updateCategoryIcon: { url: `/api/category/update-category-icon` },
        updateCategoryImage: { url: `/api/category/update-category-image` },
      },
      company: {
        url: `/api/company`,
        updateCompanyLogo: { url: `/api/company/update-company-logo` },
      },
      config: {
        url: `/api/config`,
        addSeoTextAsset: { url: `/api/config/add-seo-text-asset` },
        updateAssetConfig: { url: `/api/config/update-asset-config` },
      },
      dev: { url: `/api/dev`, algolia: { url: `/api/dev/algolia` } },
      giftCertificates: { url: `/api/gift-certificates` },
      graphql: { url: `/api/graphql` },
      logs: { url: `/api/logs` },
      messages: { url: `/api/messages`, validation: { url: `/api/messages/validation` } },
      option: {
        url: `/api/option`,
        updateOptionIcon: { url: `/api/option/update-option-icon` },
        updateOptionImage: { url: `/api/option/update-option-image` },
      },
      order: {
        url: `/api/order`,
        make: { url: `/api/order/make` },
        newOrdersCounter: { url: `/api/order/new-orders-counter` },
        product: { url: `/api/order/product` },
      },
      page: {
        url: `/api/page`,
        updatePageMainBanner: { url: `/api/page/update-page-main-banner` },
        updatePageScreenshot: { url: `/api/page/update-page-screenshot` },
        updatePageSecondaryBanner: { url: `/api/page/update-page-secondary-banner` },
      },
      product: {
        url: `/api/product`,
        searchModal: { url: `/api/product/search-modal` },
        syncError: { url: `/api/product/sync-error` },
        variants: { url: `/api/product/variants` },
      },
      promo: {
        url: `/api/promo`,
        products: { url: `/api/promo/products` },
        updatePromoMainBanner: { url: `/api/promo/update-promo-main-banner` },
        updatePromoSecondaryBanner: { url: `/api/promo/update-promo-secondary-banner` },
      },
      rubrics: { url: `/api/rubrics` },
      search: { url: `/api/search`, headerSearch: { url: `/api/search/header-search` } },
      seoContent: { url: `/api/seo-content`, uniqueness: { url: `/api/seo-content/uniqueness` } },
      shopProduct: { url: `/api/shop-product` },
      shops: {
        url: `/api/shops`,
        addShopAsset: { url: `/api/shops/add-shop-asset` },
        blacklist: { url: `/api/shops/blacklist` },
        getOrderStatuses: { url: `/api/shops/get-order-statuses` },
        getOrders: { url: `/api/shops/get-orders` },
        getShopProducts: { url: `/api/shops/get-shop-products` },
        getSyncErrors: { url: `/api/shops/get-sync-errors` },
        sync: { url: `/api/shops/sync` },
        updateOrderProduct: { url: `/api/shops/update-order-product` },
        updateShopLogo: { url: `/api/shops/update-shop-logo` },
        updateShopMarker: { url: `/api/shops/update-shop-marker` },
      },
      tasks: { url: `/api/tasks`, variants: { url: `/api/tasks/variants` } },
      user: {
        url: `/api/user`,
        paginated: { url: `/api/user/paginated` },
        password: { url: `/api/user/password` },
        profile: { url: `/api/user/profile`, password: { url: `/api/user/profile/password` } },
        session: { url: `/api/user/session` },
        signUp: { url: `/api/user/sign-up` },
        updateUserAvatar: { url: `/api/user/update-user-avatar` },
      },
      userCategory: { url: `/api/user-category` },
    },
    assets: { url: `/assets` },
    blog: {
      url: `/blog`,
      post: { url: `/blog/post`, blogPostSlug: { url: `/blog/post/${blogPostSlug}` } },
    },
    cart: { url: `/cart` },
    catalogue: { url: `/catalogue`, rubricSlug: { url: `/catalogue/${rubricSlug}` } },
    cms: {
      url: `/cms`,
      languages: { url: `/cms/languages` },
      manufacturers: { url: `/cms/manufacturers` },
      metrics: { url: `/cms/metrics` },
      nav: { url: `/cms/nav` },
      options: { url: `/cms/options` },
      orderStatuses: { url: `/cms/order-statuses` },
      orders: { url: `/cms/orders` },
      pageTemplates: { url: `/cms/page-templates` },
      pages: { url: `/cms/pages` },
      roles: { url: `/cms/roles` },
      rubricVariants: { url: `/cms/rubric-variants` },
      rubrics: { url: `/cms/rubrics` },
      suppliers: { url: `/cms/suppliers` },
      syncErrors: { url: `/cms/sync-errors` },
      taskVariants: { url: `/cms/task-variants` },
      tasks: { url: `/cms/tasks` },
      users: {
        url: `/cms/users`,
        user: {
          url: `/cms/users/user`,
          userId: {
            url: `/cms/users/user/${userId}`,
            notifications: { url: `/cms/users/user/${userId}/notifications` },
            orders: { url: `/cms/users/user/${userId}/orders` },
            password: { url: `/cms/users/user/${userId}/password` },
          },
        },
      },
    },
    console: { url: `/console` },
    contacts: { url: `/contacts` },
    docs: { url: `/docs`, pageSlug: { url: `/docs/${pageSlug}` } },
    '': { url: `/` },
    profile: { url: `/profile` },
    promo: { url: `/promo`, promoSlug: { url: `/promo/${promoSlug}` } },
    searchResult: { url: `/search-result` },
    signIn: { url: `/sign-in` },
    thankYou: { url: `/thank-you` },
  };
}
