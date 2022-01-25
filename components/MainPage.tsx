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
                      className='block relative w-full h-full z-10 object-cover'
                      src={mainBanner}
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
            <div className='text-2xl mb-4 font-medium'>
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
                      className='flex min-w-[80vw] sm:min-w-[21rem] w-[80vw] sm:w-[21rem] overflow-hidden rounded-lg'
                      key={`${secondaryBanner}`}
                    >
                      <WpLink
                        className='relative block'
                        target={'_blank'}
                        href={`${asPage ? ROUTE_DOCS : ROUTE_PROMO}/${slug}`}
                      >
                        <img
                          className='block relative z-10'
                          src={`${secondaryBanner}`}
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
            <div className='text-2xl mb-4 font-medium'>
              <h2>Популярные разделы</h2>
            </div>

            {/*Desktop*/}
            <div className='hidden lg:flex flex-wrap gap-3'>
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
                <div className='flex flex-wrap gap-3 mt-3'>
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
          <section className={`${sectionClassName} relative`}>
            <div className='absolute w-full h-[1px] top-[-50px] left-0' id={'top-shops'} />
            <div className='text-2xl mb-4 font-medium flex items-baseline'>
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
