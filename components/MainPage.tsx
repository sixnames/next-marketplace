import * as React from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import { PAGE_EDITOR_DEFAULT_VALUE_STRING, ROUTE_DOCS, ROUTE_PROMO } from '../config/common';
import { useConfigContext } from '../context/configContext';
import { useSiteContext } from '../context/siteContext';
import SiteLayout, { SiteLayoutProviderInterface } from '../layout/SiteLayout';
import ProductSnippetGridBigImage from '../layout/snippet/ProductSnippetGridBigImage';
import { MainPageInterface } from '../lib/mainPageUtils';
import HorizontalScroll from './HorizontalScroll';
import Inner from './Inner';
import TagLink from './Link/TagLink';
import WpLink from './Link/WpLink';
import PageEditor from './PageEditor';
import ShopsMap from './ShopsMap';
import WpTitle from './WpTitle';

const MainPageConsumer: React.FC<MainPageInterface> = ({
  topProducts,
  topShops,
  mainBanners,
  secondaryBanners,
  topFilters,
  mobileTopFilters,
}) => {
  const [topFiltersVisible, setTopFiltersVisible] = React.useState<boolean>(false);
  const { domainCompany } = useSiteContext();
  const { configs } = useConfigContext();
  const configTitle = configs.seoTextTitle;
  const configSeoContent = configs.seoText;
  const configBottomSeoContent = configs.seoTextBottom;
  const autoplaySpeed = configs.mainBannerAutoplaySpeed;
  const sectionClassName = `mb-14 sm:mb-28`;

  const sliderItems = mainBanners.reduce(
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
        asPage,
      },
    ) => {
      if (!mainBanner || !showAsMainBanner) {
        return acc;
      }

      return [
        ...acc,
        {
          original: `${mainBanner}`,
          renderItem(): React.ReactNode {
            return (
              <div key={mainBanner} className='overflow-hidden rounded-xl'>
                <WpLink
                  target={'_blank'}
                  href={`${asPage ? ROUTE_DOCS : ROUTE_PROMO}/${slug}`}
                  className={`relative block ${mainBannerMobile ? '' : 'h-[400px] md:h-auto'}`}
                >
                  {/*image*/}
                  <picture>
                    {mainBannerMobile ? (
                      <source media='(max-width:767px)' srcSet={mainBannerMobile} />
                    ) : null}
                    <source srcSet={mainBanner} />
                    <img
                      className='relative z-10 block h-full w-full object-cover'
                      src={mainBanner}
                      alt={`${name}`}
                      title={`${name}`}
                      width='1250'
                      height='435'
                    />
                  </picture>

                  {/*text*/}
                  <span
                    className='absolute inset-0 z-20 flex flex-col p-4 text-white lg:p-8'
                    style={
                      {
                        paddingTop: mainBannerTextPadding ? `${mainBannerTextPadding}%` : '2rem',
                        justifyContent: mainBannerHorizontalTextAlign || 'flex-start',
                        alignItems: mainBannerVerticalTextAlign || 'flex-start',
                        textAlign: mainBannerTextAlign || 'left',
                      } as React.CSSProperties
                    }
                  >
                    <span className='block max-w-full whitespace-normal'>
                      <span
                        className='block text-2xl font-medium md:text-3xl lg:text-5xl'
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
                          className='mt-8 block text-2xl font-medium md:mt-10 lg:mt-12'
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
                </WpLink>
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
          <div className='mb-14 sm:mb-20'>
            <ImageGallery
              showBullets={sliderItems.length > 1}
              autoPlay={process.env.NODE_ENV !== 'development'}
              slideInterval={autoplaySpeed}
              showFullscreenButton={false}
              showPlayButton={false}
              showNav={false}
              items={sliderItems}
            />
          </div>
        ) : null}

        {/*seo top*/}
        {configTitle || configSeoContent ? (
          <div className='mb-14 sm:mb-20'>
            {configTitle ? <WpTitle textClassName='max-w-[1440px]'>{configTitle}</WpTitle> : null}
            {configSeoContent &&
            configSeoContent.length &&
            configSeoContent !== PAGE_EDITOR_DEFAULT_VALUE_STRING ? (
              <PageEditor value={JSON.parse(configSeoContent)} readOnly />
            ) : null}
          </div>
        ) : null}

        {/*top products*/}
        {topProducts.length > 0 ? (
          <section className={sectionClassName}>
            <div className='mb-4 text-2xl font-medium'>
              <h2>Популярные товары</h2>
            </div>
            <HorizontalScroll>
              {topProducts.map((product) => {
                return (
                  <div
                    className='flex min-w-[220px] max-w-[220px] items-stretch md:min-w-[280px] md:max-w-[280px]'
                    key={`${product._id}`}
                  >
                    <ProductSnippetGridBigImage
                      className='flex-grow'
                      showSnippetBackground
                      shopProduct={product}
                      showSnippetArticle
                    />
                  </div>
                );
              })}
            </HorizontalScroll>
          </section>
        ) : null}

        {/*promotions*/}
        {secondaryBanners.length > 0 ? (
          <section className={sectionClassName}>
            <div className='mb-4 text-2xl font-medium'>
              <h2>Акции</h2>
            </div>
            <HorizontalScroll>
              {secondaryBanners.map(
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
                  asPage,
                }) => {
                  if (!secondaryBanner || !showAsSecondaryBanner) {
                    return null;
                  }

                  return (
                    <div
                      className='flex w-[80vw] min-w-[80vw] overflow-hidden rounded-lg sm:w-[21rem] sm:min-w-[21rem]'
                      key={`${secondaryBanner}`}
                    >
                      <WpLink
                        className='relative block'
                        target={'_blank'}
                        href={`${asPage ? ROUTE_DOCS : ROUTE_PROMO}/${slug}`}
                      >
                        <img
                          className='relative z-10 block'
                          src={`${secondaryBanner}`}
                          width='526'
                          height='360'
                          alt={`${name}`}
                          title={`${name}`}
                        />
                        <span
                          className='absolute inset-0 z-20 flex flex-col p-8 text-white'
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
                            className='block max-w-[250px] text-3xl font-medium'
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
                      </WpLink>
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
            <div className='mb-4 text-2xl font-medium'>
              <h2>Популярные разделы</h2>
            </div>

            {/*Desktop*/}
            <div className='hidden flex-wrap gap-3 lg:flex'>
              {topFilters.map(({ name, href }) => {
                return (
                  <TagLink href={`${href}`} key={href}>
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
                    <TagLink href={`${href}`} key={href}>
                      {name}
                    </TagLink>
                  );
                })}
              </div>

              {topFiltersVisible ? (
                <div className='mt-3 flex flex-wrap gap-3'>
                  {mobileTopFilters.hidden.map(({ name, href }) => {
                    return (
                      <TagLink href={`${href}`} key={href}>
                        {name}
                      </TagLink>
                    );
                  })}
                </div>
              ) : null}

              <div
                className='mt-5 cursor-pointer font-medium text-theme'
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
          <section className={`${sectionClassName} relative`}>
            <div className='absolute top-[-50px] left-0 h-[1px] w-full' id={'top-shops'} />
            <div className='mb-4 flex items-baseline text-2xl font-medium'>
              <h2>Магазины{domainCompany ? ` ${domainCompany.name}` : ''}</h2>
              <span className='ml-3 text-xl text-theme'>({topShops.length})</span>
            </div>
            <ShopsMap shops={topShops} />
          </section>
        ) : null}

        {/*seo top*/}
        {configBottomSeoContent ? (
          <div className='mb-14 sm:mb-20'>
            {configBottomSeoContent &&
            configBottomSeoContent.length &&
            configBottomSeoContent !== PAGE_EDITOR_DEFAULT_VALUE_STRING ? (
              <PageEditor value={JSON.parse(configBottomSeoContent)} readOnly />
            ) : null}
          </div>
        ) : null}
      </Inner>
    </React.Fragment>
  );
};

export interface MainPagePropsInterface extends SiteLayoutProviderInterface, MainPageInterface {}

const MainPage: React.FC<MainPagePropsInterface> = ({
  topProducts,
  topShops,
  topFilters,
  secondaryBanners,
  mainBanners,
  mobileTopFilters,
  ...props
}) => {
  return (
    <SiteLayout {...props}>
      <MainPageConsumer
        topProducts={topProducts}
        topFilters={topFilters}
        topShops={topShops}
        mainBanners={mainBanners}
        secondaryBanners={secondaryBanners}
        mobileTopFilters={mobileTopFilters}
      />
    </SiteLayout>
  );
};

export default MainPage;
