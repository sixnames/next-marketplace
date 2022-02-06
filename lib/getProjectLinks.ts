import { ObjectId } from 'mongodb';

type DynamicPagePropType = ObjectId | string | null;
export interface LinkPropsInterface {
  card?: DynamicPagePropType;
  blogPostSlug?: DynamicPagePropType;
  rubricSlug?: DynamicPagePropType;
  pageSlug?: DynamicPagePropType;
  attributesGroupId?: DynamicPagePropType;
  blogPostId?: DynamicPagePropType;
  brandId?: DynamicPagePropType;
  companyId?: DynamicPagePropType;
  giftCertificateId?: DynamicPagePropType;
  pagesGroupId?: DynamicPagePropType;
  pageId?: DynamicPagePropType;
  promoId?: DynamicPagePropType;
  promoCodeId?: DynamicPagePropType;
  categoryId?: DynamicPagePropType;
  productId?: DynamicPagePropType;
  seoContentSlug?: DynamicPagePropType;
  shopId?: DynamicPagePropType;
  shopProductId?: DynamicPagePropType;
  orderId?: DynamicPagePropType;
  taskVariantId?: DynamicPagePropType;
  taskId?: DynamicPagePropType;
  optionsGroupId?: DynamicPagePropType;
  optionId?: DynamicPagePropType;
  roleId?: DynamicPagePropType;
  rubricVariantId?: DynamicPagePropType;
  userId?: DynamicPagePropType;
  promoSlug?: DynamicPagePropType;
}

export function getProjectLinks(props?: LinkPropsInterface) {
  const {
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
  } = props || {};
  return {
    '0': {
      url: `/0`,
      msk: {
        url: `/0/msk`,
        card: { url: `/0/msk/${card}` },
        blog: {
          url: `/0/msk/blog`,
          post: {
            url: `/0/msk/blog/post`,
            blogPostSlug: { url: `/0/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/0/msk/catalogue`,
          rubricSlug: { url: `/0/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/0/msk/contacts` },
        docs: { url: `/0/msk/docs`, pageSlug: { url: `/0/msk/docs/${pageSlug}` } },
      },
    },
    '5': {
      url: `/5`,
      msk: {
        url: `/5/msk`,
        card: { url: `/5/msk/${card}` },
        blog: {
          url: `/5/msk/blog`,
          post: {
            url: `/5/msk/blog/post`,
            blogPostSlug: { url: `/5/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/5/msk/catalogue`,
          rubricSlug: { url: `/5/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/5/msk/contacts` },
        docs: { url: `/5/msk/docs`, pageSlug: { url: `/5/msk/docs/${pageSlug}` } },
      },
    },
    '6': {
      url: `/6`,
      msk: {
        url: `/6/msk`,
        card: { url: `/6/msk/${card}` },
        blog: {
          url: `/6/msk/blog`,
          post: {
            url: `/6/msk/blog/post`,
            blogPostSlug: { url: `/6/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/6/msk/catalogue`,
          rubricSlug: { url: `/6/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/6/msk/contacts` },
        docs: { url: `/6/msk/docs`, pageSlug: { url: `/6/msk/docs/${pageSlug}` } },
      },
    },
    '7': {
      url: `/7`,
      msk: {
        url: `/7/msk`,
        card: { url: `/7/msk/${card}` },
        blog: {
          url: `/7/msk/blog`,
          post: {
            url: `/7/msk/blog/post`,
            blogPostSlug: { url: `/7/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/7/msk/catalogue`,
          rubricSlug: { url: `/7/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/7/msk/contacts` },
        docs: { url: `/7/msk/docs`, pageSlug: { url: `/7/msk/docs/${pageSlug}` } },
      },
    },
    '8': {
      url: `/8`,
      msk: {
        url: `/8/msk`,
        card: { url: `/8/msk/${card}` },
        blog: {
          url: `/8/msk/blog`,
          post: {
            url: `/8/msk/blog/post`,
            blogPostSlug: { url: `/8/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/8/msk/catalogue`,
          rubricSlug: { url: `/8/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/8/msk/contacts` },
        docs: { url: `/8/msk/docs`, pageSlug: { url: `/8/msk/docs/${pageSlug}` } },
      },
    },
    '9': {
      url: `/9`,
      msk: {
        url: `/9/msk`,
        card: { url: `/9/msk/${card}` },
        blog: {
          url: `/9/msk/blog`,
          post: {
            url: `/9/msk/blog/post`,
            blogPostSlug: { url: `/9/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/9/msk/catalogue`,
          rubricSlug: { url: `/9/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/9/msk/contacts` },
        docs: { url: `/9/msk/docs`, pageSlug: { url: `/9/msk/docs/${pageSlug}` } },
      },
    },
    '10': {
      url: `/10`,
      msk: {
        url: `/10/msk`,
        card: { url: `/10/msk/${card}` },
        blog: {
          url: `/10/msk/blog`,
          post: {
            url: `/10/msk/blog/post`,
            blogPostSlug: { url: `/10/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/10/msk/catalogue`,
          rubricSlug: { url: `/10/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/10/msk/contacts` },
        docs: { url: `/10/msk/docs`, pageSlug: { url: `/10/msk/docs/${pageSlug}` } },
      },
    },
    '11': {
      url: `/11`,
      msk: {
        url: `/11/msk`,
        card: { url: `/11/msk/${card}` },
        blog: {
          url: `/11/msk/blog`,
          post: {
            url: `/11/msk/blog/post`,
            blogPostSlug: { url: `/11/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/11/msk/catalogue`,
          rubricSlug: { url: `/11/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/11/msk/contacts` },
        docs: { url: `/11/msk/docs`, pageSlug: { url: `/11/msk/docs/${pageSlug}` } },
      },
    },
    '12': {
      url: `/12`,
      msk: {
        url: `/12/msk`,
        card: { url: `/12/msk/${card}` },
        blog: {
          url: `/12/msk/blog`,
          post: {
            url: `/12/msk/blog/post`,
            blogPostSlug: { url: `/12/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/12/msk/catalogue`,
          rubricSlug: { url: `/12/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/12/msk/contacts` },
        docs: { url: `/12/msk/docs`, pageSlug: { url: `/12/msk/docs/${pageSlug}` } },
      },
    },
    '14': {
      url: `/14`,
      msk: {
        url: `/14/msk`,
        card: { url: `/14/msk/${card}` },
        blog: {
          url: `/14/msk/blog`,
          post: {
            url: `/14/msk/blog/post`,
            blogPostSlug: { url: `/14/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/14/msk/catalogue`,
          rubricSlug: { url: `/14/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/14/msk/contacts` },
        docs: { url: `/14/msk/docs`, pageSlug: { url: `/14/msk/docs/${pageSlug}` } },
      },
    },
    '15': {
      url: `/15`,
      msk: {
        url: `/15/msk`,
        card: { url: `/15/msk/${card}` },
        blog: {
          url: `/15/msk/blog`,
          post: {
            url: `/15/msk/blog/post`,
            blogPostSlug: { url: `/15/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/15/msk/catalogue`,
          rubricSlug: { url: `/15/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/15/msk/contacts` },
        docs: { url: `/15/msk/docs`, pageSlug: { url: `/15/msk/docs/${pageSlug}` } },
      },
    },
    '16': {
      url: `/16`,
      msk: {
        url: `/16/msk`,
        card: { url: `/16/msk/${card}` },
        blog: {
          url: `/16/msk/blog`,
          post: {
            url: `/16/msk/blog/post`,
            blogPostSlug: { url: `/16/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/16/msk/catalogue`,
          rubricSlug: { url: `/16/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/16/msk/contacts` },
        docs: { url: `/16/msk/docs`, pageSlug: { url: `/16/msk/docs/${pageSlug}` } },
      },
    },
    '17': {
      url: `/17`,
      msk: {
        url: `/17/msk`,
        card: { url: `/17/msk/${card}` },
        blog: {
          url: `/17/msk/blog`,
          post: {
            url: `/17/msk/blog/post`,
            blogPostSlug: { url: `/17/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/17/msk/catalogue`,
          rubricSlug: { url: `/17/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/17/msk/contacts` },
        docs: { url: `/17/msk/docs`, pageSlug: { url: `/17/msk/docs/${pageSlug}` } },
      },
    },
    '18': {
      url: `/18`,
      msk: {
        url: `/18/msk`,
        card: { url: `/18/msk/${card}` },
        blog: {
          url: `/18/msk/blog`,
          post: {
            url: `/18/msk/blog/post`,
            blogPostSlug: { url: `/18/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/18/msk/catalogue`,
          rubricSlug: { url: `/18/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/18/msk/contacts` },
        docs: { url: `/18/msk/docs`, pageSlug: { url: `/18/msk/docs/${pageSlug}` } },
      },
    },
    '19': {
      url: `/19`,
      msk: {
        url: `/19/msk`,
        card: { url: `/19/msk/${card}` },
        blog: {
          url: `/19/msk/blog`,
          post: {
            url: `/19/msk/blog/post`,
            blogPostSlug: { url: `/19/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/19/msk/catalogue`,
          rubricSlug: { url: `/19/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/19/msk/contacts` },
        docs: { url: `/19/msk/docs`, pageSlug: { url: `/19/msk/docs/${pageSlug}` } },
      },
    },
    '20': {
      url: `/20`,
      msk: {
        url: `/20/msk`,
        card: { url: `/20/msk/${card}` },
        blog: {
          url: `/20/msk/blog`,
          post: {
            url: `/20/msk/blog/post`,
            blogPostSlug: { url: `/20/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/20/msk/catalogue`,
          rubricSlug: { url: `/20/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/20/msk/contacts` },
        docs: { url: `/20/msk/docs`, pageSlug: { url: `/20/msk/docs/${pageSlug}` } },
      },
    },
    '21': {
      url: `/21`,
      msk: {
        url: `/21/msk`,
        card: { url: `/21/msk/${card}` },
        blog: {
          url: `/21/msk/blog`,
          post: {
            url: `/21/msk/blog/post`,
            blogPostSlug: { url: `/21/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/21/msk/catalogue`,
          rubricSlug: { url: `/21/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/21/msk/contacts` },
        docs: { url: `/21/msk/docs`, pageSlug: { url: `/21/msk/docs/${pageSlug}` } },
      },
    },
    '22': {
      url: `/22`,
      msk: {
        url: `/22/msk`,
        card: { url: `/22/msk/${card}` },
        blog: {
          url: `/22/msk/blog`,
          post: {
            url: `/22/msk/blog/post`,
            blogPostSlug: { url: `/22/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/22/msk/catalogue`,
          rubricSlug: { url: `/22/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/22/msk/contacts` },
        docs: { url: `/22/msk/docs`, pageSlug: { url: `/22/msk/docs/${pageSlug}` } },
      },
    },
    '23': {
      url: `/23`,
      msk: {
        url: `/23/msk`,
        card: { url: `/23/msk/${card}` },
        blog: {
          url: `/23/msk/blog`,
          post: {
            url: `/23/msk/blog/post`,
            blogPostSlug: { url: `/23/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/23/msk/catalogue`,
          rubricSlug: { url: `/23/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/23/msk/contacts` },
        docs: { url: `/23/msk/docs`, pageSlug: { url: `/23/msk/docs/${pageSlug}` } },
      },
    },
    '24': {
      url: `/24`,
      msk: {
        url: `/24/msk`,
        card: { url: `/24/msk/${card}` },
        blog: {
          url: `/24/msk/blog`,
          post: {
            url: `/24/msk/blog/post`,
            blogPostSlug: { url: `/24/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/24/msk/catalogue`,
          rubricSlug: { url: `/24/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/24/msk/contacts` },
        docs: { url: `/24/msk/docs`, pageSlug: { url: `/24/msk/docs/${pageSlug}` } },
      },
    },
    '25': {
      url: `/25`,
      msk: {
        url: `/25/msk`,
        card: { url: `/25/msk/${card}` },
        blog: {
          url: `/25/msk/blog`,
          post: {
            url: `/25/msk/blog/post`,
            blogPostSlug: { url: `/25/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/25/msk/catalogue`,
          rubricSlug: { url: `/25/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/25/msk/contacts` },
        docs: { url: `/25/msk/docs`, pageSlug: { url: `/25/msk/docs/${pageSlug}` } },
      },
    },
    '26': {
      url: `/26`,
      msk: {
        url: `/26/msk`,
        card: { url: `/26/msk/${card}` },
        blog: {
          url: `/26/msk/blog`,
          post: {
            url: `/26/msk/blog/post`,
            blogPostSlug: { url: `/26/msk/blog/post/${blogPostSlug}` },
          },
        },
        catalogue: {
          url: `/26/msk/catalogue`,
          rubricSlug: { url: `/26/msk/catalogue/${rubricSlug}` },
        },
        contacts: { url: `/26/msk/contacts` },
        docs: { url: `/26/msk/docs`, pageSlug: { url: `/26/msk/docs/${pageSlug}` } },
      },
    },
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
      giftCertificates: {
        url: `/api/gift-certificates`,
        check: { url: `/api/gift-certificates/check` },
      },
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
        cancel: { url: `/api/order/cancel` },
        confirm: { url: `/api/order/confirm` },
        make: { url: `/api/order/make` },
        newOrdersCounter: { url: `/api/order/new-orders-counter` },
        product: { url: `/api/order/product` },
      },
      page: {
        url: `/api/page`,
        addPageAsset: { url: `/api/page/add-page-asset` },
        group: { url: `/api/page/group` },
        updatePageMainBanner: { url: `/api/page/update-page-main-banner` },
        updatePageScreenshot: { url: `/api/page/update-page-screenshot` },
        updatePageSecondaryBanner: { url: `/api/page/update-page-secondary-banner` },
      },
      product: {
        url: `/api/product`,
        asset: { url: `/api/product/asset-` },
        assets: { url: `/api/product/assets` },
        attributes: {
          url: `/api/product/attributes`,
          brandCollection: { url: `/api/product/attributes/brand-collection` },
          brand: { url: `/api/product/attributes/brand` },
          manufacturer: { url: `/api/product/attributes/manufacturer` },
          number: { url: `/api/product/attributes/number` },
          select: { url: `/api/product/attributes/select` },
          text: { url: `/api/product/attributes/text` },
        },
        cardContent: { url: `/api/product/card-content` },
        category: {
          url: `/api/product/category`,
          visibility: { url: `/api/product/category/visibility` },
        },
        copy: { url: `/api/product/copy` },
        counter: { url: `/api/product/counter` },
        deleteAsset: { url: `/api/product/delete-asset` },
        searchModal: { url: `/api/product/search-modal` },
        syncError: { url: `/api/product/sync-error` },
        variants: { url: `/api/product/variants` },
      },
      promo: {
        url: `/api/promo`,
        addPromoAsset: { url: `/api/promo/add-promo-asset` },
        codes: { url: `/api/promo/codes`, check: { url: `/api/promo/codes/check` } },
        products: { url: `/api/promo/products` },
        updatePromoMainBanner: { url: `/api/promo/update-promo-main-banner` },
        updatePromoSecondaryBanner: { url: `/api/promo/update-promo-secondary-banner` },
      },
      rubrics: { url: `/api/rubrics` },
      search: { url: `/api/search`, headerSearch: { url: `/api/search/header-search` } },
      seoContent: {
        url: `/api/seo-content`,
        addAsset: { url: `/api/seo-content/add-asset` },
        uniqueness: { url: `/api/seo-content/uniqueness` },
      },
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
        category: { url: `/api/user/category` },
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
      attributes: {
        url: `/cms/attributes`,
        attributesGroupId: {
          url: `/cms/attributes/${attributesGroupId}`,
          attributes: { url: `/cms/attributes/${attributesGroupId}/attributes` },
        },
      },
      blog: {
        url: `/cms/blog`,
        attributes: { url: `/cms/blog/attributes` },
        post: { url: `/cms/blog/post`, blogPostId: { url: `/cms/blog/post/${blogPostId}` } },
      },
      brands: {
        url: `/cms/brands`,
        brand: {
          url: `/cms/brands/brand`,
          brandId: {
            url: `/cms/brands/brand/${brandId}`,
            collections: { url: `/cms/brands/brand/${brandId}/collections` },
          },
        },
      },
      companies: {
        url: `/cms/companies`,
        companyId: {
          url: `/cms/companies/${companyId}`,
          assets: { url: `/cms/companies/${companyId}/assets` },
          blog: {
            url: `/cms/companies/${companyId}/blog`,
            post: {
              url: `/cms/companies/${companyId}/blog/post`,
              blogPostId: { url: `/cms/companies/${companyId}/blog/post/${blogPostId}` },
            },
          },
          config: {
            url: `/cms/companies/${companyId}/config`,
            analytics: { url: `/cms/companies/${companyId}/config/analytics` },
            catalogue: { url: `/cms/companies/${companyId}/config/catalogue` },
            contacts: { url: `/cms/companies/${companyId}/config/contacts` },
            seo: { url: `/cms/companies/${companyId}/config/seo` },
            ui: { url: `/cms/companies/${companyId}/config/ui` },
          },
          giftCertificates: {
            url: `/cms/companies/${companyId}/gift-certificates`,
            certificate: {
              url: `/cms/companies/${companyId}/gift-certificates/certificate`,
              giftCertificateId: {
                url: `/cms/companies/${companyId}/gift-certificates/certificate/${giftCertificateId}`,
              },
            },
          },
          pages: {
            url: `/cms/companies/${companyId}/pages`,
            pagesGroupId: {
              url: `/cms/companies/${companyId}/pages/${pagesGroupId}`,
              pageId: { url: `/cms/companies/${companyId}/pages/${pagesGroupId}/${pageId}` },
            },
          },
          promo: {
            url: `/cms/companies/${companyId}/promo`,
            details: {
              url: `/cms/companies/${companyId}/promo/details`,
              promoId: {
                url: `/cms/companies/${companyId}/promo/details/${promoId}`,
                code: {
                  url: `/cms/companies/${companyId}/promo/details/${promoId}/code`,
                  promoCodeId: {
                    url: `/cms/companies/${companyId}/promo/details/${promoId}/code/${promoCodeId}`,
                  },
                },
                rubrics: {
                  url: `/cms/companies/${companyId}/promo/details/${promoId}/rubrics`,
                  rubricSlug: {
                    url: `/cms/companies/${companyId}/promo/details/${promoId}/rubrics/${rubricSlug}`,
                    products: {
                      url: `/cms/companies/${companyId}/promo/details/${promoId}/rubrics/${rubricSlug}/products`,
                    },
                  },
                },
              },
            },
          },
          rubrics: {
            url: `/cms/companies/${companyId}/rubrics`,
            rubricSlug: {
              url: `/cms/companies/${companyId}/rubrics/${rubricSlug}`,
              categories: {
                url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/categories`,
                categoryId: {
                  url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/categories/${categoryId}`,
                },
              },
              products: {
                url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products`,
                product: {
                  url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products/product`,
                  productId: {
                    url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products/product/${productId}`,
                    assets: {
                      url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products/product/${productId}/assets`,
                    },
                    attributes: {
                      url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products/product/${productId}/attributes`,
                    },
                    brands: {
                      url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products/product/${productId}/brands`,
                    },
                    categories: {
                      url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products/product/${productId}/categories`,
                    },
                    variants: {
                      url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products/product/${productId}/variants`,
                    },
                  },
                },
              },
              seoContent: {
                url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/seo-content`,
                seoContentSlug: {
                  url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/seo-content/${seoContentSlug}`,
                },
              },
            },
          },
          shops: {
            url: `/cms/companies/${companyId}/shops`,
            shop: {
              url: `/cms/companies/${companyId}/shops/shop`,
              shopId: {
                url: `/cms/companies/${companyId}/shops/shop/${shopId}`,
                assets: { url: `/cms/companies/${companyId}/shops/shop/${shopId}/assets` },
                rubrics: {
                  url: `/cms/companies/${companyId}/shops/shop/${shopId}/rubrics`,
                  rubricSlug: {
                    url: `/cms/companies/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}`,
                    add: {
                      url: `/cms/companies/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/add`,
                    },
                    products: {
                      url: `/cms/companies/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/products`,
                      product: {
                        url: `/cms/companies/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product`,
                        shopProductId: {
                          url: `/cms/companies/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product/${shopProductId}`,
                          suppliers: {
                            url: `/cms/companies/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product/${shopProductId}/suppliers`,
                          },
                        },
                      },
                    },
                  },
                },
                shopOrders: {
                  url: `/cms/companies/${companyId}/shops/shop/${shopId}/shop-orders`,
                  orderId: {
                    url: `/cms/companies/${companyId}/shops/shop/${shopId}/shop-orders/${orderId}`,
                  },
                },
                syncErrors: { url: `/cms/companies/${companyId}/shops/shop/${shopId}/sync-errors` },
              },
            },
          },
          taskVariants: {
            url: `/cms/companies/${companyId}/task-variants`,
            taskVariantId: { url: `/cms/companies/${companyId}/task-variants/${taskVariantId}` },
            create: { url: `/cms/companies/${companyId}/task-variants/create` },
          },
          tasks: {
            url: `/cms/companies/${companyId}/tasks`,
            create: { url: `/cms/companies/${companyId}/tasks/create` },
            details: {
              url: `/cms/companies/${companyId}/tasks/details`,
              taskId: { url: `/cms/companies/${companyId}/tasks/details/${taskId}` },
            },
          },
          userCategories: { url: `/cms/companies/${companyId}/user-categories` },
        },
        create: { url: `/cms/companies/create` },
      },
      config: {
        url: `/cms/config`,
        analytics: { url: `/cms/config/analytics` },
        catalogue: { url: `/cms/config/catalogue` },
        contacts: { url: `/cms/config/contacts` },
        project: { url: `/cms/config/project` },
        seo: { url: `/cms/config/seo` },
        ui: { url: `/cms/config/ui` },
      },
      languages: { url: `/cms/languages` },
      manufacturers: { url: `/cms/manufacturers` },
      metrics: { url: `/cms/metrics` },
      myTasks: { url: `/cms/my-tasks` },
      nav: { url: `/cms/nav` },
      options: {
        url: `/cms/options`,
        optionsGroupId: {
          url: `/cms/options/${optionsGroupId}`,
          options: {
            url: `/cms/options/${optionsGroupId}/options`,
            optionId: { url: `/cms/options/${optionsGroupId}/options/${optionId}` },
          },
        },
      },
      orderStatuses: { url: `/cms/order-statuses` },
      orders: { url: `/cms/orders`, orderId: { url: `/cms/orders/${orderId}` } },
      pageTemplates: {
        url: `/cms/page-templates`,
        pagesGroupId: {
          url: `/cms/page-templates/${pagesGroupId}`,
          pageId: { url: `/cms/page-templates/${pagesGroupId}/${pageId}` },
        },
      },
      pages: {
        url: `/cms/pages`,
        pagesGroupId: {
          url: `/cms/pages/${pagesGroupId}`,
          pageId: { url: `/cms/pages/${pagesGroupId}/${pageId}` },
        },
      },
      roles: {
        url: `/cms/roles`,
        roleId: {
          url: `/cms/roles/${roleId}`,
          nav: { url: `/cms/roles/${roleId}/nav` },
          rules: { url: `/cms/roles/${roleId}/rules` },
        },
      },
      rubricVariants: {
        url: `/cms/rubric-variants`,
        rubricVariantId: { url: `/cms/rubric-variants/${rubricVariantId}` },
      },
      rubrics: {
        url: `/cms/rubrics`,
        rubricSlug: {
          url: `/cms/rubrics/${rubricSlug}`,
          attributes: { url: `/cms/rubrics/${rubricSlug}/attributes` },
          categories: {
            url: `/cms/rubrics/${rubricSlug}/categories`,
            categoryId: {
              url: `/cms/rubrics/${rubricSlug}/categories/${categoryId}`,
              attributes: { url: `/cms/rubrics/${rubricSlug}/categories/${categoryId}/attributes` },
            },
          },
          products: {
            url: `/cms/rubrics/${rubricSlug}/products`,
            product: {
              url: `/cms/rubrics/${rubricSlug}/products/product`,
              productId: {
                url: `/cms/rubrics/${rubricSlug}/products/product/${productId}`,
                assets: { url: `/cms/rubrics/${rubricSlug}/products/product/${productId}/assets` },
                attributes: {
                  url: `/cms/rubrics/${rubricSlug}/products/product/${productId}/attributes`,
                },
                brands: { url: `/cms/rubrics/${rubricSlug}/products/product/${productId}/brands` },
                categories: {
                  url: `/cms/rubrics/${rubricSlug}/products/product/${productId}/categories`,
                },
                variants: {
                  url: `/cms/rubrics/${rubricSlug}/products/product/${productId}/variants`,
                },
              },
            },
          },
          seoContent: {
            url: `/cms/rubrics/${rubricSlug}/seo-content`,
            seoContentSlug: { url: `/cms/rubrics/${rubricSlug}/seo-content/${seoContentSlug}` },
          },
        },
      },
      suppliers: { url: `/cms/suppliers` },
      syncErrors: { url: `/cms/sync-errors` },
      taskVariants: {
        url: `/cms/task-variants`,
        taskVariantId: { url: `/cms/task-variants/${taskVariantId}` },
        create: { url: `/cms/task-variants/create` },
      },
      tasks: {
        url: `/cms/tasks`,
        create: { url: `/cms/tasks/create` },
        details: { url: `/cms/tasks/details`, taskId: { url: `/cms/tasks/details/${taskId}` } },
      },
      users: {
        url: `/cms/users`,
        user: {
          url: `/cms/users/user`,
          userId: {
            url: `/cms/users/user/${userId}`,
            assets: { url: `/cms/users/user/${userId}/assets` },
            categories: { url: `/cms/users/user/${userId}/categories` },
            notifications: { url: `/cms/users/user/${userId}/notifications` },
            orders: {
              url: `/cms/users/user/${userId}/orders`,
              orderId: { url: `/cms/users/user/${userId}/orders/${orderId}` },
            },
            password: { url: `/cms/users/user/${userId}/password` },
          },
        },
      },
    },
    console: {
      url: `/console`,
      companyId: {
        url: `/console/${companyId}`,
        blog: {
          url: `/console/${companyId}/blog`,
          post: {
            url: `/console/${companyId}/blog/post`,
            blogPostId: { url: `/console/${companyId}/blog/post/${blogPostId}` },
          },
        },
        config: {
          url: `/console/${companyId}/config`,
          assets: { url: `/console/${companyId}/config/assets` },
          config: {
            url: `/console/${companyId}/config/config`,
            analytics: { url: `/console/${companyId}/config/config/analytics` },
            catalogue: { url: `/console/${companyId}/config/config/catalogue` },
            contacts: { url: `/console/${companyId}/config/config/contacts` },
            seo: { url: `/console/${companyId}/config/config/seo` },
            ui: { url: `/console/${companyId}/config/config/ui` },
          },
        },
        giftCertificates: {
          url: `/console/${companyId}/gift-certificates`,
          certificate: {
            url: `/console/${companyId}/gift-certificates/certificate`,
            giftCertificateId: {
              url: `/console/${companyId}/gift-certificates/certificate/${giftCertificateId}`,
            },
          },
        },
        myTasks: { url: `/console/${companyId}/my-tasks` },
        orders: {
          url: `/console/${companyId}/orders`,
          order: {
            url: `/console/${companyId}/orders/order`,
            orderId: { url: `/console/${companyId}/orders/order/${orderId}` },
          },
        },
        pages: {
          url: `/console/${companyId}/pages`,
          pagesGroupId: {
            url: `/console/${companyId}/pages/${pagesGroupId}`,
            pageId: { url: `/console/${companyId}/pages/${pagesGroupId}/${pageId}` },
          },
        },
        promo: {
          url: `/console/${companyId}/promo`,
          details: {
            url: `/console/${companyId}/promo/details`,
            promoId: {
              url: `/console/${companyId}/promo/details/${promoId}`,
              code: {
                url: `/console/${companyId}/promo/details/${promoId}/code`,
                promoCodeId: {
                  url: `/console/${companyId}/promo/details/${promoId}/code/${promoCodeId}`,
                },
              },
              rubrics: {
                url: `/console/${companyId}/promo/details/${promoId}/rubrics`,
                rubricSlug: {
                  url: `/console/${companyId}/promo/details/${promoId}/rubrics/${rubricSlug}`,
                  products: {
                    url: `/console/${companyId}/promo/details/${promoId}/rubrics/${rubricSlug}/products`,
                  },
                },
              },
            },
          },
        },
        rubrics: {
          url: `/console/${companyId}/rubrics`,
          rubricSlug: {
            url: `/console/${companyId}/rubrics/${rubricSlug}`,
            categories: {
              url: `/console/${companyId}/rubrics/${rubricSlug}/categories`,
              categoryId: {
                url: `/console/${companyId}/rubrics/${rubricSlug}/categories/${categoryId}`,
              },
            },
            products: {
              url: `/console/${companyId}/rubrics/${rubricSlug}/products`,
              product: {
                url: `/console/${companyId}/rubrics/${rubricSlug}/products/product`,
                productId: {
                  url: `/console/${companyId}/rubrics/${rubricSlug}/products/product/${productId}`,
                },
              },
            },
            seoContent: {
              url: `/console/${companyId}/rubrics/${rubricSlug}/seo-content`,
              seoContentSlug: {
                url: `/console/${companyId}/rubrics/${rubricSlug}/seo-content/${seoContentSlug}`,
              },
            },
          },
        },
        shops: {
          url: `/console/${companyId}/shops`,
          shop: {
            url: `/console/${companyId}/shops/shop`,
            shopId: {
              url: `/console/${companyId}/shops/shop/${shopId}`,
              assets: { url: `/console/${companyId}/shops/shop/${shopId}/assets` },
              rubrics: {
                url: `/console/${companyId}/shops/shop/${shopId}/rubrics`,
                rubricSlug: {
                  url: `/console/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}`,
                  add: {
                    url: `/console/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/add`,
                  },
                  products: {
                    url: `/console/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/products`,
                    product: {
                      url: `/console/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product`,
                      shopProductId: {
                        url: `/console/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product/${shopProductId}`,
                        suppliers: {
                          url: `/console/${companyId}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product/${shopProductId}/suppliers`,
                        },
                      },
                    },
                  },
                },
              },
              shopOrders: {
                url: `/console/${companyId}/shops/shop/${shopId}/shop-orders`,
                orderId: {
                  url: `/console/${companyId}/shops/shop/${shopId}/shop-orders/${orderId}`,
                },
              },
              syncErrors: { url: `/console/${companyId}/shops/shop/${shopId}/sync-errors` },
            },
          },
        },
        taskVariants: {
          url: `/console/${companyId}/task-variants`,
          taskVariantId: { url: `/console/${companyId}/task-variants/${taskVariantId}` },
          create: { url: `/console/${companyId}/task-variants/create` },
        },
        tasks: {
          url: `/console/${companyId}/tasks`,
          create: { url: `/console/${companyId}/tasks/create` },
          details: {
            url: `/console/${companyId}/tasks/details`,
            taskId: { url: `/console/${companyId}/tasks/details/${taskId}` },
          },
        },
        userCategories: { url: `/console/${companyId}/user-categories` },
        users: {
          url: `/console/${companyId}/users`,
          user: {
            url: `/console/${companyId}/users/user`,
            userId: {
              url: `/console/${companyId}/users/user/${userId}`,
              orders: {
                url: `/console/${companyId}/users/user/${userId}/orders`,
                orderId: { url: `/console/${companyId}/users/user/${userId}/orders/${orderId}` },
              },
            },
          },
        },
      },
    },
    contacts: { url: `/contacts` },
    docs: { url: `/docs`, pageSlug: { url: `/docs/${pageSlug}` } },
    '': { url: `/` },
    profile: {
      url: `/profile`,
      details: { url: `/profile/details` },
      giftCertificates: { url: `/profile/gift-certificates` },
    },
    promo: { url: `/promo`, promoSlug: { url: `/promo/${promoSlug}` } },
    searchResult: { url: `/search-result` },
    signIn: { url: `/sign-in` },
    thankYou: { url: `/thank-you` },
  };
}
