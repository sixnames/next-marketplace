import { ObjectId } from 'mongodb';

type DynamicPagePropType = ObjectId | string | null;
export interface LinkPropsInterface {
  card?: DynamicPagePropType;
  blogPostSlug?: DynamicPagePropType;
  rubricSlug?: DynamicPagePropType;
  attributesGroupId?: DynamicPagePropType;
  blogPostId?: DynamicPagePropType;
  brandId?: DynamicPagePropType;
  companyId?: DynamicPagePropType;
  eventId?: DynamicPagePropType;
  seoContentSlug?: DynamicPagePropType;
  giftCertificateId?: DynamicPagePropType;
  pagesGroupId?: DynamicPagePropType;
  pageId?: DynamicPagePropType;
  promoId?: DynamicPagePropType;
  promoCodeId?: DynamicPagePropType;
  categoryId?: DynamicPagePropType;
  productId?: DynamicPagePropType;
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
  pageSlug?: DynamicPagePropType;
  promoSlug?: DynamicPagePropType;
}

export function getProjectLinks(props?: LinkPropsInterface) {
  const {
    card,
    blogPostSlug,
    rubricSlug,
    attributesGroupId,
    blogPostId,
    brandId,
    companyId,
    eventId,
    seoContentSlug,
    giftCertificateId,
    pagesGroupId,
    pageId,
    promoId,
    promoCodeId,
    categoryId,
    productId,
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
    pageSlug,
    promoSlug,
  } = props || {};
  return {
    card: { url: `/${card}` },
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
      brand: {
        url: `/api/brand`,
        alphabet: { url: `/api/brand/alphabet` },
        logo: { url: `/api/brand/logo` },
      },
      brandCollections: {
        url: `/api/brand-collections`,
        alphabet: { url: `/api/brand-collections/alphabet` },
      },
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
      eventRubrics: {
        url: `/api/event-rubrics`,
        attributesGroup: { url: `/api/event-rubrics/attributes-group` },
        cmsProductAttributes: { url: `/api/event-rubrics/cms-product-attributes` },
        filterAttributes: { url: `/api/event-rubrics/filter-attributes` },
      },
      events: {
        url: `/api/events`,
        assets: { url: `/api/events/assets`, add: { url: `/api/events/assets/add` } },
        attributes: {
          url: `/api/events/attributes`,
          number: { url: `/api/events/attributes/number` },
          select: { url: `/api/events/attributes/select` },
          text: { url: `/api/events/attributes/text` },
        },
        cardContent: { url: `/api/events/card-content` },
        counter: { url: `/api/events/counter` },
      },
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
        assets: { url: `/api/product/assets`, add: { url: `/api/product/assets/add` } },
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
      rubrics: {
        url: `/api/rubrics`,
        attributesGroup: { url: `/api/rubrics/attributes-group` },
        cmsProductAttributes: { url: `/api/rubrics/cms-product-attributes` },
        filterAttributes: { url: `/api/rubrics/filter-attributes` },
      },
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
      xlsx: { url: `/api/xlsx`, shopProducts: { url: `/api/xlsx/shop-products` } },
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
          events: {
            url: `/cms/companies/${companyId}/events`,
            rubricSlug: {
              url: `/cms/companies/${companyId}/events/${rubricSlug}`,
              attributes: { url: `/cms/companies/${companyId}/events/${rubricSlug}/attributes` },
              events: {
                url: `/cms/companies/${companyId}/events/${rubricSlug}/events`,
                create: { url: `/cms/companies/${companyId}/events/${rubricSlug}/events/create` },
                event: {
                  url: `/cms/companies/${companyId}/events/${rubricSlug}/events/event`,
                  eventId: {
                    url: `/cms/companies/${companyId}/events/${rubricSlug}/events/event/${eventId}`,
                    assets: {
                      url: `/cms/companies/${companyId}/events/${rubricSlug}/events/event/${eventId}/assets`,
                    },
                    attributes: {
                      url: `/cms/companies/${companyId}/events/${rubricSlug}/events/event/${eventId}/attributes`,
                    },
                    editor: {
                      url: `/cms/companies/${companyId}/events/${rubricSlug}/events/event/${eventId}/editor`,
                    },
                  },
                },
              },
              seoContent: {
                url: `/cms/companies/${companyId}/events/${rubricSlug}/seo-content`,
                seoContentSlug: {
                  url: `/cms/companies/${companyId}/events/${rubricSlug}/seo-content/${seoContentSlug}`,
                },
              },
            },
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
                    editor: {
                      url: `/cms/companies/${companyId}/rubrics/${rubricSlug}/products/product/${productId}/editor`,
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
      myTasks: {
        url: `/cms/my-tasks`,
        details: {
          url: `/cms/my-tasks/details`,
          taskId: {
            url: `/cms/my-tasks/details/${taskId}`,
            product: {
              url: `/cms/my-tasks/details/${taskId}/product`,
              productId: {
                url: `/cms/my-tasks/details/${taskId}/product/${productId}`,
                assets: { url: `/cms/my-tasks/details/${taskId}/product/${productId}/assets` },
                attributes: {
                  url: `/cms/my-tasks/details/${taskId}/product/${productId}/attributes`,
                },
                brands: { url: `/cms/my-tasks/details/${taskId}/product/${productId}/brands` },
                categories: {
                  url: `/cms/my-tasks/details/${taskId}/product/${productId}/categories`,
                },
                editor: { url: `/cms/my-tasks/details/${taskId}/product/${productId}/editor` },
                variants: { url: `/cms/my-tasks/details/${taskId}/product/${productId}/variants` },
              },
            },
          },
        },
      },
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
                editor: { url: `/cms/rubrics/${rubricSlug}/products/product/${productId}/editor` },
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
        events: {
          url: `/console/${companyId}/events`,
          rubricSlug: {
            url: `/console/${companyId}/events/${rubricSlug}`,
            attributes: { url: `/console/${companyId}/events/${rubricSlug}/attributes` },
            events: {
              url: `/console/${companyId}/events/${rubricSlug}/events`,
              create: { url: `/console/${companyId}/events/${rubricSlug}/events/create` },
              event: {
                url: `/console/${companyId}/events/${rubricSlug}/events/event`,
                eventId: {
                  url: `/console/${companyId}/events/${rubricSlug}/events/event/${eventId}`,
                  assets: {
                    url: `/console/${companyId}/events/${rubricSlug}/events/event/${eventId}/assets`,
                  },
                  attributes: {
                    url: `/console/${companyId}/events/${rubricSlug}/events/event/${eventId}/attributes`,
                  },
                  editor: {
                    url: `/console/${companyId}/events/${rubricSlug}/events/event/${eventId}/editor`,
                  },
                },
              },
            },
            seoContent: {
              url: `/console/${companyId}/events/${rubricSlug}/seo-content`,
              seoContentSlug: {
                url: `/console/${companyId}/events/${rubricSlug}/seo-content/${seoContentSlug}`,
              },
            },
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
    root: { url: `/` },
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

export interface ConsoleCompanyLinkPropsInterface {
  basePath: string;
  card?: DynamicPagePropType;
  blogPostSlug?: DynamicPagePropType;
  rubricSlug?: DynamicPagePropType;
  attributesGroupId?: DynamicPagePropType;
  blogPostId?: DynamicPagePropType;
  brandId?: DynamicPagePropType;
  companyId?: DynamicPagePropType;
  eventId?: DynamicPagePropType;
  seoContentSlug?: DynamicPagePropType;
  giftCertificateId?: DynamicPagePropType;
  pagesGroupId?: DynamicPagePropType;
  pageId?: DynamicPagePropType;
  promoId?: DynamicPagePropType;
  promoCodeId?: DynamicPagePropType;
  categoryId?: DynamicPagePropType;
  productId?: DynamicPagePropType;
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
  pageSlug?: DynamicPagePropType;
  promoSlug?: DynamicPagePropType;
}

export function getConsoleCompanyLinks(props: ConsoleCompanyLinkPropsInterface) {
  const {
    basePath,
    blogPostId,
    rubricSlug,
    eventId,
    seoContentSlug,
    giftCertificateId,
    pagesGroupId,
    pageId,
    promoId,
    promoCodeId,
    categoryId,
    productId,
    shopId,
    shopProductId,
    orderId,
    taskVariantId,
    taskId,
  } = props;
  return {
    assets: { url: `${basePath}/assets` },
    blog: {
      url: `${basePath}/blog`,
      post: {
        url: `${basePath}/blog/post`,
        blogPostId: { url: `${basePath}/blog/post/${blogPostId}` },
      },
    },
    config: {
      url: `${basePath}/config`,
      analytics: { url: `${basePath}/config/analytics` },
      catalogue: { url: `${basePath}/config/catalogue` },
      contacts: { url: `${basePath}/config/contacts` },
      seo: { url: `${basePath}/config/seo` },
      ui: { url: `${basePath}/config/ui` },
    },
    events: {
      url: `${basePath}/events`,
      rubricSlug: {
        url: `${basePath}/events/${rubricSlug}`,
        attributes: { url: `${basePath}/events/${rubricSlug}/attributes` },
        events: {
          url: `${basePath}/events/${rubricSlug}/events`,
          create: { url: `${basePath}/events/${rubricSlug}/events/create` },
          event: {
            url: `${basePath}/events/${rubricSlug}/events/event`,
            eventId: {
              url: `${basePath}/events/${rubricSlug}/events/event/${eventId}`,
              assets: { url: `${basePath}/events/${rubricSlug}/events/event/${eventId}/assets` },
              attributes: {
                url: `${basePath}/events/${rubricSlug}/events/event/${eventId}/attributes`,
              },
              editor: { url: `${basePath}/events/${rubricSlug}/events/event/${eventId}/editor` },
            },
          },
        },
        seoContent: {
          url: `${basePath}/events/${rubricSlug}/seo-content`,
          seoContentSlug: { url: `${basePath}/events/${rubricSlug}/seo-content/${seoContentSlug}` },
        },
      },
    },
    giftCertificates: {
      url: `${basePath}/gift-certificates`,
      certificate: {
        url: `${basePath}/gift-certificates/certificate`,
        giftCertificateId: {
          url: `${basePath}/gift-certificates/certificate/${giftCertificateId}`,
        },
      },
    },
    root: { url: `${basePath}/` },
    pages: {
      url: `${basePath}/pages`,
      pagesGroupId: {
        url: `${basePath}/pages/${pagesGroupId}`,
        pageId: { url: `${basePath}/pages/${pagesGroupId}/${pageId}` },
      },
    },
    promo: {
      url: `${basePath}/promo`,
      details: {
        url: `${basePath}/promo/details`,
        promoId: {
          url: `${basePath}/promo/details/${promoId}`,
          code: {
            url: `${basePath}/promo/details/${promoId}/code`,
            promoCodeId: { url: `${basePath}/promo/details/${promoId}/code/${promoCodeId}` },
          },
          rubrics: {
            url: `${basePath}/promo/details/${promoId}/rubrics`,
            rubricSlug: {
              url: `${basePath}/promo/details/${promoId}/rubrics/${rubricSlug}`,
              products: {
                url: `${basePath}/promo/details/${promoId}/rubrics/${rubricSlug}/products`,
              },
            },
          },
        },
      },
    },
    rubrics: {
      url: `${basePath}/rubrics`,
      rubricSlug: {
        url: `${basePath}/rubrics/${rubricSlug}`,
        categories: {
          url: `${basePath}/rubrics/${rubricSlug}/categories`,
          categoryId: { url: `${basePath}/rubrics/${rubricSlug}/categories/${categoryId}` },
        },
        products: {
          url: `${basePath}/rubrics/${rubricSlug}/products`,
          product: {
            url: `${basePath}/rubrics/${rubricSlug}/products/product`,
            productId: {
              url: `${basePath}/rubrics/${rubricSlug}/products/product/${productId}`,
              assets: {
                url: `${basePath}/rubrics/${rubricSlug}/products/product/${productId}/assets`,
              },
              attributes: {
                url: `${basePath}/rubrics/${rubricSlug}/products/product/${productId}/attributes`,
              },
              brands: {
                url: `${basePath}/rubrics/${rubricSlug}/products/product/${productId}/brands`,
              },
              categories: {
                url: `${basePath}/rubrics/${rubricSlug}/products/product/${productId}/categories`,
              },
              editor: {
                url: `${basePath}/rubrics/${rubricSlug}/products/product/${productId}/editor`,
              },
              variants: {
                url: `${basePath}/rubrics/${rubricSlug}/products/product/${productId}/variants`,
              },
            },
          },
        },
        seoContent: {
          url: `${basePath}/rubrics/${rubricSlug}/seo-content`,
          seoContentSlug: {
            url: `${basePath}/rubrics/${rubricSlug}/seo-content/${seoContentSlug}`,
          },
        },
      },
    },
    shops: {
      url: `${basePath}/shops`,
      shop: {
        url: `${basePath}/shops/shop`,
        shopId: {
          url: `${basePath}/shops/shop/${shopId}`,
          assets: { url: `${basePath}/shops/shop/${shopId}/assets` },
          rubrics: {
            url: `${basePath}/shops/shop/${shopId}/rubrics`,
            rubricSlug: {
              url: `${basePath}/shops/shop/${shopId}/rubrics/${rubricSlug}`,
              add: { url: `${basePath}/shops/shop/${shopId}/rubrics/${rubricSlug}/add` },
              products: {
                url: `${basePath}/shops/shop/${shopId}/rubrics/${rubricSlug}/products`,
                product: {
                  url: `${basePath}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product`,
                  shopProductId: {
                    url: `${basePath}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product/${shopProductId}`,
                    suppliers: {
                      url: `${basePath}/shops/shop/${shopId}/rubrics/${rubricSlug}/products/product/${shopProductId}/suppliers`,
                    },
                  },
                },
              },
            },
          },
          shopOrders: {
            url: `${basePath}/shops/shop/${shopId}/shop-orders`,
            orderId: { url: `${basePath}/shops/shop/${shopId}/shop-orders/${orderId}` },
          },
          syncErrors: { url: `${basePath}/shops/shop/${shopId}/sync-errors` },
        },
      },
    },
    taskVariants: {
      url: `${basePath}/task-variants`,
      taskVariantId: { url: `${basePath}/task-variants/${taskVariantId}` },
      create: { url: `${basePath}/task-variants/create` },
    },
    tasks: {
      url: `${basePath}/tasks`,
      create: { url: `${basePath}/tasks/create` },
      details: {
        url: `${basePath}/tasks/details`,
        taskId: { url: `${basePath}/tasks/details/${taskId}` },
      },
    },
    userCategories: { url: `${basePath}/user-categories` },
  };
}

export interface CmsCompanyLinkPropsInterface
  extends Omit<ConsoleCompanyLinkPropsInterface, 'basePath'> {
  companyId: ObjectId | string;
}

export function getCmsCompanyLinks(props: CmsCompanyLinkPropsInterface) {
  const links = getProjectLinks({
    companyId: props.companyId,
  });

  return getConsoleCompanyLinks({
    basePath: links.cms.companies.companyId.url,
    ...props,
  });
}
