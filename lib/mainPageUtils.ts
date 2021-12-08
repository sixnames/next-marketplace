import {
  CATALOGUE_TOP_FILTERS_LIMIT,
  CATALOGUE_TOP_PRODUCTS_LIMIT,
  FILTER_SEPARATOR,
  ROUTE_CATALOGUE,
  SORT_DESC,
} from 'config/common';
import { COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { ignoreNoImageStage, shopProductFieldsPipeline } from 'db/dao/constantPipelines';
import { getDatabase } from 'db/mongodb';
import {
  CompanyInterface,
  MobileTopFilters,
  PageInterface,
  PagesGroupInterface,
  RubricInterface,
  ShopInterface,
  ShopProductInterface,
  TopFilterInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getTreeFromList } from 'lib/optionUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { castDbData } from 'lib/ssrUtils';
import { generateSnippetTitle, generateTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';

export interface MainPageInterface {
  topProducts: ShopProductInterface[];
  topShops: ShopInterface[];
  topFilters: TopFilterInterface[];
  mobileTopFilters: MobileTopFilters;
  sliderPages: PageInterface[];
  bannerPages: PageInterface[];
}

interface GetMainPageDataInterface {
  companySlug: string;
  sessionCity: string;
  currency: string;
  sessionLocale: string;
  domainCompany?: CompanyInterface | null;
  footerPageGroups: PagesGroupInterface[];
  headerPageGroups: PagesGroupInterface[];
  navRubrics: RubricInterface[];
}

export async function getMainPageData({
  companySlug,
  domainCompany,
  footerPageGroups,
  headerPageGroups,
  sessionCity,
  sessionLocale,
  currency,
  navRubrics,
}: GetMainPageDataInterface): Promise<MainPageInterface> {
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);

  const companyRubricsMatch = domainCompany ? { companyId: new ObjectId(domainCompany._id) } : {};
  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: sessionCity,
          ...ignoreNoImageStage,
        },
      },
      {
        $group: {
          _id: '$productId',
          itemId: { $first: '$itemId' },
          rubricId: { $first: '$rubricId' },
          rubricSlug: { $first: `$rubricSlug` },
          brandSlug: { $first: '$brandSlug' },
          brandCollectionSlug: { $first: '$brandCollectionSlug' },
          views: { $max: `$views.${companySlug}.${sessionCity}` },
          priorities: { $max: `$priorities.${companySlug}.${sessionCity}` },
          minPrice: {
            $min: '$price',
          },
          maxPrice: {
            $min: '$price',
          },
          available: {
            $max: '$available',
          },
          selectedOptionsSlugs: {
            $first: '$selectedOptionsSlugs',
          },
          shopProductsIds: {
            $addToSet: '$_id',
          },
        },
      },
      {
        $sort: {
          priorities: SORT_DESC,
          views: SORT_DESC,
          _id: SORT_DESC,
        },
      },
      {
        $limit: CATALOGUE_TOP_PRODUCTS_LIMIT,
      },

      // get shop product fields
      ...shopProductFieldsPipeline('$_id'),

      {
        $addFields: {
          shopsCount: { $size: '$shopProductsIds' },
          cardPrices: {
            min: '$minPrice',
            max: '$maxPrice',
          },
        },
      },
    ])
    .toArray();

  const topProducts: ShopProductInterface[] = [];
  shopProductsAggregation.forEach((shopProduct) => {
    const { product, shopsCount, ...restShopProduct } = shopProduct;
    if (!product) {
      return;
    }

    // title
    const snippetTitle = generateSnippetTitle({
      locale: sessionLocale,
      brand: product?.brand,
      rubricName: getFieldStringLocale(product?.rubric?.nameI18n, sessionLocale),
      showRubricNameInProductTitle: product?.rubric?.showRubricNameInProductTitle,
      showCategoryInProductTitle: product?.rubric?.showCategoryInProductTitle,
      attributes: product?.attributes || [],
      titleCategoriesSlugs: product?.titleCategoriesSlugs,
      originalName: product?.originalName,
      defaultGender: product?.gender,
      categories: getTreeFromList({
        list: product?.categories,
        childrenFieldName: 'categories',
        locale: sessionLocale,
      }),
    });

    // prices
    const minPrice = noNaN(shopProduct.cardPrices?.min);
    const maxPrice = noNaN(shopProduct.cardPrices?.max);
    const cardPrices = {
      _id: new ObjectId(),
      min: `${minPrice}`,
      max: `${maxPrice}`,
    };

    topProducts.push({
      ...restShopProduct,
      product: {
        ...product,
        shopsCount,
        name: getFieldStringLocale(product?.nameI18n, sessionLocale),
        cardPrices,
        connections: [],
        snippetTitle,
      },
    });
  });

  // Get top shops
  const shopsAggregation = await shopsCollection
    .aggregate<ShopInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: sessionCity,
        },
      },
      {
        $sort: {
          rating: SORT_DESC,
          _id: SORT_DESC,
        },
      },
      /*{
        $limit: 1,
      },*/
      /*{
        $limit: CATALOGUE_TOP_SHOPS_LIMIT,
      },*/
    ])
    .toArray();

  const topShops = shopsAggregation.map((shop) => {
    return {
      ...shop,
      contacts: {
        ...shop.contacts,
        formattedPhones: shop.contacts.phones.map((phone) => {
          return {
            raw: phoneToRaw(phone),
            readable: phoneToReadable(phone),
          };
        }),
      },
    };
  });
  // console.log(JSON.stringify(props.navRubrics, null, 2));

  const topFilters: TopFilterInterface[] = [];
  navRubrics.forEach(({ gender, defaultTitleI18n, keywordI18n, prefixI18n, slug, attributes }) => {
    (attributes || []).forEach((attribute) => {
      const options = (attribute.options || []).slice(0, 2);
      if (options.length < 1) {
        return;
      }

      options.forEach((option) => {
        const name = generateTitle({
          attributes: [
            {
              ...attribute,
              options: [option],
            },
          ],
          attributeNameVisibilityFieldName: 'showNameInTitle',
          positionFieldName: 'positioningInTitle',
          attributeVisibilityFieldName: 'showInCatalogueTitle',
          defaultGender: gender,
          fallbackTitle: getFieldStringLocale(defaultTitleI18n, sessionLocale),
          defaultKeyword: getFieldStringLocale(keywordI18n, sessionLocale),
          prefix: getFieldStringLocale(prefixI18n, sessionLocale),
          locale: sessionLocale,
          currency,
        });

        const exist = topFilters.some((topFilter) => topFilter.name === name);
        if (!exist) {
          topFilters.push({
            name,
            href: `${ROUTE_CATALOGUE}/${slug}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`,
          });
        }
      });
    });
  });

  const allPageGroups: PagesGroupInterface[] = castDbData([
    ...headerPageGroups,
    ...footerPageGroups,
  ]);
  const sliderPages: PageInterface[] = [];
  const bannerPages: PageInterface[] = [];

  allPageGroups.forEach((pagesGroup) => {
    const { pages } = pagesGroup;
    (pages || []).forEach((page) => {
      // main slide
      const showAsMainBanner = page.showAsMainBanner && page.mainBanner?.url;
      const existInSliderPages = sliderPages.find(({ _id }) => {
        return _id === page._id;
      });
      if (!existInSliderPages && showAsMainBanner) {
        sliderPages.push(page);
      }

      // banners
      const showAsSecondaryBanner = page.showAsSecondaryBanner && page.secondaryBanner?.url;
      const existInBannerPages = bannerPages.find(({ _id }) => {
        return _id === page._id;
      });
      if (!existInBannerPages && showAsSecondaryBanner) {
        bannerPages.push(page);
      }
    });
  });

  const mobileTopFilters: MobileTopFilters = {
    visible: topFilters.slice(0, CATALOGUE_TOP_FILTERS_LIMIT),
    hidden: topFilters.slice(CATALOGUE_TOP_FILTERS_LIMIT),
  };

  return {
    topFilters: castDbData(topFilters),
    topProducts: castDbData(topProducts),
    topShops: castDbData(topShops),
    mobileTopFilters: castDbData(mobileTopFilters),
    sliderPages,
    bannerPages,
  };
}