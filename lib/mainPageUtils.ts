import { ObjectId } from 'mongodb';
import {
  CATALOGUE_TOP_FILTERS_LIMIT,
  CATALOGUE_TOP_PRODUCTS_LIMIT,
  DEFAULT_COMPANY_SLUG,
  FILTER_SEPARATOR,
  ROUTE_CATALOGUE,
  SORT_DESC,
} from '../config/common';
import { COL_PROMO, COL_SHOP_PRODUCTS, COL_SHOPS } from '../db/collectionNames';
import { ignoreNoImageStage, summaryPipeline } from '../db/dao/constantPipelines';
import { getDatabase } from '../db/mongodb';
import {
  CompanyInterface,
  MainPageBannerInterface,
  MobileTopFilters,
  PagesGroupInterface,
  PromoInterface,
  RubricInterface,
  ShopInterface,
  ShopProductInterface,
  TopFilterInterface,
} from '../db/uiInterfaces';
import { getFieldStringLocale } from './i18n';
import { noNaN } from './numbers';
import { phoneToRaw, phoneToReadable } from './phoneUtils';
import { castDbData } from './ssrUtils';
import { generateTitle } from './titleUtils';

export interface MainPageInterface {
  topProducts: ShopProductInterface[];
  topShops: ShopInterface[];
  topFilters: TopFilterInterface[];
  mobileTopFilters: MobileTopFilters;
  mainBanners: MainPageBannerInterface[];
  secondaryBanners: MainPageBannerInterface[];
}

interface GetMainPageDataInterface {
  companySlug: string;
  citySlug: string;
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
  citySlug,
  sessionLocale,
  currency,
  navRubrics,
}: GetMainPageDataInterface): Promise<MainPageInterface> {
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
  const promoCollection = db.collection<PromoInterface>(COL_PROMO);

  const companyRubricsMatch = domainCompany ? { companyId: new ObjectId(domainCompany._id) } : {};
  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ShopProductInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug,
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
          views: { $max: `$views.${companySlug}.${citySlug}` },
          priorities: { $max: `$priorities.${companySlug}.${citySlug}` },
          minPrice: {
            $min: '$price',
          },
          maxPrice: {
            $min: '$price',
          },
          available: {
            $max: '$available',
          },
          filterSlugs: {
            $first: '$filterSlugs',
          },
          shopProductIds: {
            $addToSet: '$_id',
          },
        },
      },
      {
        $sort: {
          available: SORT_DESC,
          views: SORT_DESC,
          _id: SORT_DESC,
        },
      },
      {
        $limit: CATALOGUE_TOP_PRODUCTS_LIMIT,
      },

      // get shop product fields
      ...summaryPipeline('$_id'),

      {
        $addFields: {
          shopsCount: { $size: '$shopProductIds' },
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
    const { summary, shopsCount, ...restShopProduct } = shopProduct;
    if (!summary) {
      return;
    }

    topProducts.push({
      ...restShopProduct,
      summary: {
        ...summary,
        shopsCount,
        name: getFieldStringLocale(summary?.nameI18n, sessionLocale),
        snippetTitle: getFieldStringLocale(summary.snippetTitleI18n, sessionLocale),
        minPrice: noNaN(shopProduct.minPrice),
        maxPrice: noNaN(shopProduct.maxPrice),
        variants: [],
      },
    });
  });

  // Get top shops
  const shopsAggregation = await shopsCollection
    .aggregate<ShopInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: citySlug,
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

  // banners
  const promoCompanyMatch =
    companySlug === DEFAULT_COMPANY_SLUG
      ? {}
      : {
          companySlug,
        };
  const promoList = await promoCollection
    .find({
      ...promoCompanyMatch,
      startAt: {
        $lt: new Date(),
      },
      endAt: {
        $gt: new Date(),
      },
    })
    .toArray();

  const allPageGroups: PagesGroupInterface[] = castDbData([
    ...headerPageGroups,
    ...footerPageGroups,
  ]);
  const mainBanners: MainPageBannerInterface[] = [];
  const secondaryBanners: MainPageBannerInterface[] = [];

  promoList.forEach((page) => {
    // main banner
    const showAsMainBanner = page.showAsMainBanner && page.mainBanner;
    const existInSliderPages = mainBanners.find(({ _id }) => {
      return _id === page._id;
    });
    if (!existInSliderPages && showAsMainBanner) {
      const banner: MainPageBannerInterface = {
        _id: page._id,
        slug: page.slug,
        assetKeys: page.assetKeys,
        description: getFieldStringLocale(page.descriptionI18n, sessionLocale),
        name: getFieldStringLocale(page.nameI18n, sessionLocale),
        title: getFieldStringLocale(page.titleI18n, sessionLocale),
        content: '',
        descriptionI18n: {},
        nameI18n: {},
        titleI18n: {},
        showAsMainBanner: page.showAsMainBanner,
        mainBanner: page.mainBanner,
        mainBannerHorizontalTextAlign: page.mainBannerHorizontalTextAlign,
        mainBannerMobile: page.mainBannerMobile,
        mainBannerTextAlign: page.mainBannerTextAlign,
        mainBannerTextColor: page.mainBannerTextColor,
        mainBannerTextMaxWidth: page.mainBannerTextMaxWidth,
        mainBannerTextPadding: page.mainBannerTextPadding,
        mainBannerVerticalTextAlign: page.mainBannerVerticalTextAlign,
        asPromo: true,
      };
      mainBanners.push(banner);
    }

    // secondary banner
    const showAsSecondaryBanner = page.showAsSecondaryBanner && page.secondaryBanner;
    const existInBannerPages = secondaryBanners.find(({ _id }) => {
      return _id === page._id;
    });
    if (!existInBannerPages && showAsSecondaryBanner) {
      const banner: MainPageBannerInterface = {
        _id: page._id,
        slug: page.slug,
        assetKeys: page.assetKeys,
        description: getFieldStringLocale(page.descriptionI18n, sessionLocale),
        name: getFieldStringLocale(page.nameI18n, sessionLocale),
        title: getFieldStringLocale(page.titleI18n, sessionLocale),
        content: '',
        descriptionI18n: {},
        nameI18n: {},
        titleI18n: {},
        showAsSecondaryBanner: page.showAsSecondaryBanner,
        secondaryBanner: page.secondaryBanner,
        secondaryBannerTextColor: page.secondaryBannerTextColor,
        secondaryBannerVerticalTextAlign: page.secondaryBannerVerticalTextAlign,
        secondaryBannerHorizontalTextAlign: page.secondaryBannerHorizontalTextAlign,
        secondaryBannerTextAlign: page.secondaryBannerTextAlign,
        secondaryBannerTextPadding: page.secondaryBannerTextPadding,
        secondaryBannerTextMaxWidth: page.secondaryBannerTextMaxWidth,
        asPromo: true,
      };
      secondaryBanners.push(banner);
    }
  });

  allPageGroups.forEach((pagesGroup) => {
    const { pages } = pagesGroup;
    (pages || []).forEach((page) => {
      // main banner
      const showAsMainBanner = page.showAsMainBanner && page.mainBanner;
      const existInSliderPages = mainBanners.find(({ _id }) => {
        return _id === page._id;
      });
      if (!existInSliderPages && showAsMainBanner) {
        const banner: MainPageBannerInterface = {
          _id: page._id,
          slug: page.slug,
          assetKeys: page.assetKeys,
          description: page.description,
          name: page.name,
          title: page.title,
          content: '',
          descriptionI18n: {},
          nameI18n: {},
          titleI18n: {},
          showAsMainBanner: page.showAsMainBanner,
          mainBanner: page.mainBanner,
          mainBannerHorizontalTextAlign: page.mainBannerHorizontalTextAlign,
          mainBannerMobile: page.mainBannerMobile,
          mainBannerTextAlign: page.mainBannerTextAlign,
          mainBannerTextColor: page.mainBannerTextColor,
          mainBannerTextMaxWidth: page.mainBannerTextMaxWidth,
          mainBannerTextPadding: page.mainBannerTextPadding,
          mainBannerVerticalTextAlign: page.mainBannerVerticalTextAlign,
          asPage: true,
        };
        mainBanners.push(banner);
      }

      // secondary banner
      const showAsSecondaryBanner = page.showAsSecondaryBanner && page.secondaryBanner;
      const existInBannerPages = secondaryBanners.find(({ _id }) => {
        return _id === page._id;
      });
      if (!existInBannerPages && showAsSecondaryBanner) {
        const banner: MainPageBannerInterface = {
          _id: page._id,
          slug: page.slug,
          assetKeys: page.assetKeys,
          description: page.description,
          name: page.name,
          title: page.title,
          content: '',
          descriptionI18n: {},
          nameI18n: {},
          titleI18n: {},
          showAsSecondaryBanner: page.showAsSecondaryBanner,
          secondaryBanner: page.secondaryBanner,
          secondaryBannerTextColor: page.secondaryBannerTextColor,
          secondaryBannerVerticalTextAlign: page.secondaryBannerVerticalTextAlign,
          secondaryBannerHorizontalTextAlign: page.secondaryBannerHorizontalTextAlign,
          secondaryBannerTextAlign: page.secondaryBannerTextAlign,
          secondaryBannerTextPadding: page.secondaryBannerTextPadding,
          secondaryBannerTextMaxWidth: page.secondaryBannerTextMaxWidth,
          asPage: true,
        };
        secondaryBanners.push(banner);
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
    mainBanners: castDbData(mainBanners),
    secondaryBanners: castDbData(secondaryBanners),
  };
}
