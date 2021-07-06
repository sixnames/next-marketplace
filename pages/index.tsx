import HorizontalScroll from 'components/HorizontalScroll';
import Link from 'components/Link/Link';
import TagLink from 'components/Link/TagLink';
import ProductSnippetGrid from 'components/Product/ProductSnippetGrid';
import ShopsMap from 'components/ShopsMap';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ROUTE_CATALOGUE_DEFAULT_RUBRIC,
  CATALOGUE_TOP_PRODUCTS_LIMIT,
  SORT_DESC,
  CATALOGUE_OPTION_SEPARATOR,
  ROUTE_CATALOGUE,
  CATALOGUE_TOP_SHOPS_LIMIT,
  ROUTE_DOCS_PAGES,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  PageInterface,
  PagesGroupInterface,
  ProductInterface,
  ShopInterface,
  ShopProductInterface,
  TopFilterInterface,
} from 'db/uiInterfaces';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getCatalogueTitle } from 'lib/catalogueUtils';
import { getCurrencyString, getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title';
import Inner from 'components/Inner';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';

interface HomeRoutInterface {
  topProducts: ProductInterface[];
  topShops: ShopInterface[];
  topFilters: TopFilterInterface[];
  sliderPages: PageInterface[];
  bannerPages: PageInterface[];
}

const HomeRoute: React.FC<HomeRoutInterface> = ({
  topProducts,
  topShops,
  sliderPages,
  bannerPages,
  topFilters,
}) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');
  const sectionClassName = `mb-14 sm:mb-28`;

  console.log({ sliderPages });

  return (
    <React.Fragment>
      <Inner testId={'main-page'}>
        <div className='mb-14 sm:mb-20 overflow-hidden rounded-xl'>
          <Link className='block' href={ROUTE_CATALOGUE_DEFAULT_RUBRIC}>
            <img
              className='w-full'
              src={`https://${process.env.OBJECT_STORAGE_DOMAIN}/banners/main-banner.jpg`}
              width='1249'
              height='432'
              alt={'slider'}
              title={'slider'}
            />
          </Link>
        </div>

        {configTitle ? (
          <div className='mb-14 sm:mb-20 max-w-[690px]'>
            <Title>{configTitle}</Title>
          </div>
        ) : null}

        {topProducts.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Бестселлеры</h2>
            </div>
            <HorizontalScroll>
              {topProducts.map((product) => {
                return (
                  <div className='flex min-w-[80vw] sm:min-w-[30rem]' key={`${product._id}`}>
                    <ProductSnippetGrid noAttributes noSecondaryName product={product} />
                  </div>
                );
              })}
            </HorizontalScroll>
          </section>
        ) : null}

        {bannerPages.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Акции</h2>
            </div>
            <HorizontalScroll>
              {bannerPages.map(({ secondaryBanner, name, slug }) => {
                if (!secondaryBanner) {
                  return null;
                }

                return (
                  <div
                    className='relative flex min-w-[80vw] sm:min-w-[30rem] overflow-hidden rounded-lg'
                    key={`${secondaryBanner.url}`}
                  >
                    <Link
                      className='block z-10'
                      target={'_blank'}
                      href={`${ROUTE_DOCS_PAGES}/${slug}`}
                    >
                      <img
                        className='block'
                        src={`${secondaryBanner.url}`}
                        width='526'
                        height='360'
                        alt={`${name}`}
                        title={`${name}`}
                      />
                      <span className='absolute block inset-0 p-8 text-white'>
                        <span className='block font-medium text-3xl max-h-[160px]'>{name}</span>
                      </span>
                    </Link>
                  </div>
                );
              })}
            </HorizontalScroll>
          </section>
        ) : null}

        {topFilters.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Популярные разделы</h2>
            </div>
            <div className='flex flex-wrap gap-3'>
              {topFilters.map(({ name, href }) => {
                return (
                  <TagLink href={href} key={href}>
                    {name}
                  </TagLink>
                );
              })}
            </div>
          </section>
        ) : null}

        {topShops.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Магазины</h2>
            </div>
            <ShopsMap shops={topShops} />
          </section>
        ) : null}
      </Inner>
    </React.Fragment>
  );
};

interface HomeInterface extends SiteLayoutProviderInterface, HomeRoutInterface {}

const Home: NextPage<HomeInterface> = ({
  topProducts,
  topShops,
  topFilters,
  bannerPages,
  sliderPages,
  ...props
}) => {
  return (
    <SiteLayoutProvider {...props}>
      <HomeRoute
        topProducts={topProducts}
        topFilters={topFilters}
        topShops={topShops}
        sliderPages={sliderPages}
        bannerPages={bannerPages}
      />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<HomeInterface>> {
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const { companySlug, sessionCity, sessionLocale, company, footerPageGroups, headerPageGroups } =
    props;

  const companyRubricsMatch = company ? { companyId: new ObjectId(company._id) } : {};
  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ProductInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: sessionCity,
        },
      },
      {
        $group: {
          _id: '$productId',
          itemId: { $first: '$itemId' },
          rubricId: { $first: '$rubricId' },
          rubricSlug: { $first: `$rubricSlug` },
          slug: { $first: '$slug' },
          mainImage: { $first: `$mainImage` },
          originalName: { $first: `$originalName` },
          nameI18n: { $first: `$nameI18n` },
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
            $addToSet: '$selectedOptionsSlugs',
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
          available: SORT_DESC,
          _id: SORT_DESC,
        },
      },
      {
        $limit: CATALOGUE_TOP_PRODUCTS_LIMIT,
      },
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

  const products = shopProductsAggregation.map((product) => {
    const { attributes, ...restProduct } = product;

    // prices
    const minPrice = noNaN(product.cardPrices?.min);
    const maxPrice = noNaN(product.cardPrices?.max);
    const cardPrices = {
      _id: new ObjectId(),
      min: getCurrencyString(minPrice),
      max: getCurrencyString(maxPrice),
    };

    // listFeatures
    const listFeatures = getProductCurrentViewCastedAttributes({
      attributes: attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      locale: sessionLocale,
    });

    // ratingFeatures
    const ratingFeatures = getProductCurrentViewCastedAttributes({
      attributes: attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
      locale: sessionLocale,
    });

    return {
      ...restProduct,
      listFeatures,
      ratingFeatures,
      name: getFieldStringLocale(product.nameI18n, sessionLocale),
      cardPrices,
      connections: [],
    };
  });

  // Get top shops
  const shopsAggregation = await shopsCollection
    .aggregate([
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
      {
        $limit: CATALOGUE_TOP_SHOPS_LIMIT,
      },
    ])
    .toArray();

  const topShops = shopsAggregation.map((shop) => {
    return {
      ...shop,
      address: {
        ...shop.address,
        formattedCoordinates: {
          lat: shop.address.point.coordinates[1],
          lng: shop.address.point.coordinates[0],
        },
      },
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
  props.navRubrics.forEach(({ catalogueTitle, slug, attributes }) => {
    (attributes || []).forEach((attribute) => {
      const options = (attribute.options || []).slice(0, 2);
      if (options.length < 1) {
        return;
      }

      options.forEach((option) => {
        const name = getCatalogueTitle({
          selectedFilters: [
            {
              attribute,
              options: [option],
            },
          ],
          catalogueTitle,
          locale: sessionLocale,
        });

        const exist = topFilters.some((topFilter) => topFilter.name === name);
        if (!exist) {
          topFilters.push({
            name,
            href: `${ROUTE_CATALOGUE}/${slug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`,
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

  return {
    props: {
      ...props,
      topFilters: castDbData(topFilters),
      topProducts: castDbData(products),
      topShops: castDbData(topShops),
      sliderPages,
      bannerPages,
    },
  };
}

export default Home;
