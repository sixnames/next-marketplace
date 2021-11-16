import HorizontalScroll from 'components/HorizontalScroll';
import Link from 'components/Link/Link';
import TagLink from 'components/Link/TagLink';
import PageEditor from 'components/PageEditor';
import ShopsMap from 'components/ShopsMap';
import {
  CATALOGUE_TOP_PRODUCTS_LIMIT,
  SORT_DESC,
  FILTER_SEPARATOR,
  ROUTE_CATALOGUE,
  ROUTE_DOCS_PAGES,
  CATALOGUE_TOP_FILTERS_LIMIT,
  ISR_FIVE_SECONDS,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { noImageStage, shopProductFieldsPipeline } from 'db/dao/constantPipelines';
import { getDatabase } from 'db/mongodb';
import {
  MobileTopFilters,
  PageInterface,
  PagesGroupInterface,
  ShopInterface,
  ShopProductInterface,
  TopFilterInterface,
} from 'db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import ProductSnippetGridBigImage from 'layout/snippet/ProductSnippetGridBigImage';
import { getIsrSiteInitialData, IsrContextInterface } from 'lib/isrUtils';
import { getTreeFromList } from 'lib/optionsUtils';
import { generateSnippetTitle, generateTitle } from 'lib/titleUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from 'next';
import Title from 'components/Title';
import Inner from 'components/Inner';
import { castDbData } from 'lib/ssrUtils';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';

interface HomeRouteInterface {
  topProducts: ShopProductInterface[];
  topShops: ShopInterface[];
  topFilters: TopFilterInterface[];
  mobileTopFilters: MobileTopFilters;
  sliderPages: PageInterface[];
  bannerPages: PageInterface[];
}

const HomeRoute: React.FC<HomeRouteInterface> = ({
  topProducts,
  topShops,
  sliderPages,
  bannerPages,
  topFilters,
  mobileTopFilters,
}) => {
  const [topFiltersVisible, setTopFiltersVisible] = React.useState<boolean>(false);
  const { urlPrefix } = useSiteContext();
  const { configs } = useConfigContext();
  const configTitle = configs.seoTextTitle;
  const configSeoText = configs.seoText;
  const autoplaySpeed = configs.mainBannerAutoplaySpeed;
  const sectionClassName = `mb-14 sm:mb-28`;

  const sliderItems = sliderPages.reduce(
    (
      acc: ReactImageGalleryItem[],
      {
        slug,
        name,
        description,
        mainBanner,
        mainBannerMobile,
        mainBannerTextColor,
        mainBannerTextPadding,
        mainBannerVerticalTextAlign,
        mainBannerHorizontalTextAlign,
        mainBannerTextMaxWidth,
        mainBannerTextAlign,
        showAsMainBanner,
      },
    ) => {
      if (!mainBanner || !showAsMainBanner) {
        return acc;
      }

      return [
        ...acc,
        {
          original: `${mainBanner?.url}`,
          renderItem(): React.ReactNode {
            return (
              <div key={mainBanner.url} className='overflow-hidden rounded-xl'>
                <Link
                  target={'_blank'}
                  href={`${ROUTE_DOCS_PAGES}/${slug}`}
                  className={`relative block ${mainBannerMobile ? '' : 'h-[400px] md:h-auto'}`}
                >
                  {/*image*/}
                  <picture>
                    {mainBannerMobile ? (
                      <source media='(max-width:767px)' srcSet={mainBannerMobile.url} />
                    ) : null}
                    <source srcSet={mainBanner.url} />
                    <img
                      className='block relative w-full h-full z-10 object-cover'
                      src={mainBanner.url}
                      alt={`${name}`}
                      title={`${name}`}
                      width='1250'
                      height='435'
                    />
                  </picture>

                  {/*text*/}
                  <span
                    className='absolute flex flex-col z-20 inset-0 p-4 lg:p-8 text-white'
                    style={
                      {
                        paddingTop: mainBannerTextPadding ? `${mainBannerTextPadding}%` : '2rem',
                        justifyContent: mainBannerHorizontalTextAlign || 'flex-start',
                        alignItems: mainBannerVerticalTextAlign || 'flex-start',
                        textAlign: mainBannerTextAlign || 'left',
                      } as React.CSSProperties
                    }
                  >
                    <span className='max-w-full block whitespace-normal'>
                      <span
                        className='block font-medium text-2xl md:text-3xl lg:text-5xl'
                        style={{
                          color: mainBannerTextColor ? mainBannerTextColor : 'var(--textColor)',
                          maxWidth: mainBannerTextMaxWidth
                            ? `${mainBannerTextMaxWidth}px`
                            : '520px',
                        }}
                      >
                        {name}
                      </span>
                      {description ? (
                        <span
                          className='font-medium block text-2xl mt-8 md:mt-10 lg:mt-12'
                          style={{
                            color: mainBannerTextColor ? mainBannerTextColor : 'var(--textColor)',
                            maxWidth: mainBannerTextMaxWidth
                              ? `${mainBannerTextMaxWidth}px`
                              : '650px',
                          }}
                        >
                          {description}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </Link>
              </div>
            );
          },
        },
      ];
    },
    [],
  );

  return (
    <React.Fragment>
      <Inner testId={'main-page'}>
        {/*main banner*/}
        {sliderItems.length > 0 ? (
          <div className='sm:mb-20 mb-14'>
            <ImageGallery
              showBullets={sliderItems.length > 1}
              autoPlay
              slideInterval={autoplaySpeed}
              showFullscreenButton={false}
              showPlayButton={false}
              showNav={false}
              items={sliderItems}
            />
          </div>
        ) : null}

        {/*title*/}
        {configTitle ? (
          <div className='mb-14 sm:mb-20'>
            <Title textClassName='max-w-[1440px]'>{configTitle}</Title>
            {configSeoText && configSeoText.length > 0 ? (
              <PageEditor value={JSON.parse(configSeoText)} readOnly />
            ) : null}
          </div>
        ) : null}

        {/*top products*/}
        {topProducts.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Популярные товары</h2>
            </div>
            <HorizontalScroll>
              {topProducts.map((product) => {
                return (
                  <div
                    className='min-w-[220px] max-w-[220px] md:min-w-[280px] md:max-w-[280px] flex items-stretch'
                    key={`${product._id}`}
                  >
                    <ProductSnippetGridBigImage
                      className='flex-grow'
                      showSnippetBackground
                      shopProduct={product}
                    />
                  </div>
                );
              })}
            </HorizontalScroll>
          </section>
        ) : null}

        {/*promotions*/}
        {bannerPages.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Акции</h2>
            </div>
            <HorizontalScroll>
              {bannerPages.map(
                ({
                  secondaryBanner,
                  name,
                  slug,
                  secondaryBannerTextColor,
                  secondaryBannerTextPadding,
                  secondaryBannerHorizontalTextAlign,
                  secondaryBannerVerticalTextAlign,
                  secondaryBannerTextAlign,
                  secondaryBannerTextMaxWidth,
                  showAsSecondaryBanner,
                }) => {
                  if (!secondaryBanner || !showAsSecondaryBanner) {
                    return null;
                  }

                  return (
                    <div
                      className='flex min-w-[80vw] sm:min-w-[21rem] w-[80vw] sm:w-[21rem] overflow-hidden rounded-lg'
                      key={`${secondaryBanner.url}`}
                    >
                      <Link
                        className='relative block'
                        target={'_blank'}
                        href={`${ROUTE_DOCS_PAGES}/${slug}`}
                      >
                        <img
                          className='block relative z-10'
                          src={`${secondaryBanner.url}`}
                          width='526'
                          height='360'
                          alt={`${name}`}
                          title={`${name}`}
                        />
                        <span
                          className='absolute z-20 flex flex-col inset-0 p-8 text-white'
                          style={
                            {
                              paddingTop: secondaryBannerTextPadding
                                ? `${secondaryBannerTextPadding}%`
                                : '2rem',
                              justifyContent: secondaryBannerHorizontalTextAlign || 'flex-start',
                              alignItems: secondaryBannerVerticalTextAlign || 'flex-start',
                              textAlign: secondaryBannerTextAlign || 'left',
                            } as React.CSSProperties
                          }
                        >
                          <span
                            className='block font-medium text-3xl max-w-[250px]'
                            style={{
                              color: secondaryBannerTextColor
                                ? secondaryBannerTextColor
                                : 'var(--textColor)',
                              maxWidth: secondaryBannerTextMaxWidth
                                ? `${secondaryBannerTextMaxWidth}px`
                                : '200px',
                            }}
                          >
                            {name}
                          </span>
                        </span>
                      </Link>
                    </div>
                  );
                },
              )}
            </HorizontalScroll>
          </section>
        ) : null}

        {/*top filters*/}
        {topFilters.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Популярные разделы</h2>
            </div>

            {/*Desktop*/}
            <div className='hidden lg:flex flex-wrap gap-3'>
              {topFilters.map(({ name, href }) => {
                return (
                  <TagLink href={`${urlPrefix}${href}`} key={href}>
                    {name}
                  </TagLink>
                );
              })}
            </div>

            {/*Mobile*/}
            <div className='lg:hidden'>
              <div className='flex flex-wrap gap-3'>
                {mobileTopFilters.visible.map(({ name, href }) => {
                  return (
                    <TagLink href={href} key={href}>
                      {name}
                    </TagLink>
                  );
                })}
              </div>

              {topFiltersVisible ? (
                <div className='flex flex-wrap gap-3 mt-3'>
                  {mobileTopFilters.hidden.map(({ name, href }) => {
                    return (
                      <TagLink href={href} key={href}>
                        {name}
                      </TagLink>
                    );
                  })}
                </div>
              ) : null}

              <div
                className='mt-5 font-medium cursor-pointer text-theme'
                onClick={() =>
                  setTopFiltersVisible((prevState) => {
                    return !prevState;
                  })
                }
              >
                {topFiltersVisible ? 'Скрыть' : 'Показать ещё'}
              </div>
            </div>
          </section>
        ) : null}

        {/*top shops*/}
        {topShops.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium flex items-baseline'>
              <h2>Магазины</h2>
              <span className='ml-3 text-xl text-theme'>({topShops.length})</span>
            </div>
            <ShopsMap shops={topShops} />
          </section>
        ) : null}
      </Inner>
    </React.Fragment>
  );
};

interface HomeInterface extends SiteLayoutProviderInterface, HomeRouteInterface {}

const Home: NextPage<HomeInterface> = ({
  topProducts,
  topShops,
  topFilters,
  bannerPages,
  sliderPages,
  mobileTopFilters,
  ...props
}) => {
  return (
    <SiteLayout {...props}>
      <HomeRoute
        topProducts={topProducts}
        topFilters={topFilters}
        topShops={topShops}
        sliderPages={sliderPages}
        bannerPages={bannerPages}
        mobileTopFilters={mobileTopFilters}
      />
    </SiteLayout>
  );
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths: any[] = [];
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(
  context: IsrContextInterface,
): Promise<GetStaticPropsResult<HomeInterface>> {
  try {
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
    const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
    const { props } = await getIsrSiteInitialData({
      context,
    });

    // redirect to product
    const isCitySlug = noNaN(context.params?.citySlug) === 0;
    if (!isCitySlug) {
      return {
        redirect: {
          destination: `${props.urlPrefix}/${context.params?.citySlug}`,
          permanent: true,
        },
      };
    }

    if (!props) {
      return {
        notFound: true,
      };
    }

    const {
      companySlug,
      sessionCity,
      sessionLocale,
      initialData,
      domainCompany,
      footerPageGroups,
      headerPageGroups,
    } = props;

    const companyRubricsMatch = domainCompany ? { companyId: new ObjectId(domainCompany._id) } : {};
    const shopProductsAggregation = await shopProductsCollection
      .aggregate<ShopProductInterface>([
        {
          $match: {
            ...companyRubricsMatch,
            citySlug: sessionCity,
            ...noImageStage,
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
    props.navRubrics.forEach(
      ({ gender, defaultTitleI18n, keywordI18n, prefixI18n, slug, attributes }) => {
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
              currency: initialData.currency,
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
      },
    );

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
      revalidate: ISR_FIVE_SECONDS,
      props: {
        ...props,
        topFilters: castDbData(topFilters),
        topProducts: castDbData(topProducts),
        topShops: castDbData(topShops),
        mobileTopFilters: castDbData(mobileTopFilters),
        sliderPages,
        bannerPages,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
    };
  }
}

export default Home;
