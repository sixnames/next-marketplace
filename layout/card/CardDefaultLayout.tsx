import parse from 'html-react-parser';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import Inner from '../../components/Inner';
import TagLink from '../../components/Link/TagLink';
import WpBreadcrumbs from '../../components/WpBreadcrumbs';
import WpIcon from '../../components/WpIcon';
import WpImage from '../../components/WpImage';
import WpTitle from '../../components/WpTitle';
import {
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
  FILTER_SEPARATOR,
  ROUTE_CATALOGUE,
} from '../../config/common';
import { useConfigContext } from '../../context/configContext';
import { CardLayoutInterface } from '../../db/uiInterfaces';
import useCardData from '../../hooks/useCardData';
import { noNaN } from '../../lib/numbers';
import ProductAddToCartButton from '../snippet/ProductAddToCartButton';
import CardControls from './CardControls';
import CardDynamicContent from './CardDynamicContent';
import CardIconFeatures from './CardIconFeatures';
import CardPrices from './CardPrices';
import CardRatingFeatures from './CardRatingFeatures';
import CardShopsList from './CardShopsList';
import CardSimilarProducts from './CardSimilarProducts';
import CardTagFeatures from './CardTagFeatures';
import CardTextFeatures from './CardTextFeatures';

const CardImageSlider = dynamic(() => import('./CardImageSlider'));

interface CardTitleInterface {
  productId: any;
  itemId: string;
  isMobile?: boolean;
  showArticle: boolean;
  cardTitle: string;
  name?: string | null;
}

const CardTitle: React.FC<CardTitleInterface> = ({
  cardTitle,
  showArticle,
  name,
  itemId,
  isMobile,
}) => {
  return (
    <div className='mb-6'>
      <WpTitle className='mb-1' tag={isMobile ? 'div' : 'h1'} low>
        {cardTitle}
      </WpTitle>

      {name ? (
        isMobile ? (
          <div className='mb-2 text-secondary-text'>{name}</div>
        ) : (
          <h2 className='mb-2 text-secondary-text'>{name}</h2>
        )
      ) : null}

      <div className='flex items-center justify-between'>
        {showArticle ? <div className='text-sm text-secondary-text'>Арт: {itemId}</div> : null}

        {/*controls*/}
        <CardControls />
      </div>
    </div>
  );
};

const CardDefaultLayout: React.FC<CardLayoutInterface> = ({ cardData, companySlug }) => {
  const router = useRouter();
  const { configs } = useConfigContext();
  const {
    similarProducts,
    showFeaturesSection,
    visibleListFeatures,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
    shopsCounterPostfix,
    isShopless,
    showArticle,
    product,
    cardBreadcrumbs,
    shopsCount,
    cardShops,
    cardContent,
    showCardImagesSlider,
    cardTitle,
    maxAvailable,
  } = useCardData({
    cardData,
    companySlug,
  });

  const { brand, brandCollection, manufacturer, name, variants, assets, minPrice, maxPrice } =
    product;

  const videos = (product.videos || []).filter((video) => video);

  return (
    <article className='pb-20 pt-8 lg:pt-0' data-cy={`card`}>
      <WpBreadcrumbs currentPageName={cardTitle} config={cardBreadcrumbs} />

      <div className='relative mb-28 bg-secondary shadow-md'>
        <Inner className='relative z-20' lowBottom lowTop>
          {/*content holder*/}
          <div className='relative'>
            {/*mobile title*/}
            <div className='relative z-20 pt-8 lg:hidden'>
              <CardTitle
                isMobile
                showArticle={showArticle}
                productId={product._id}
                itemId={product.itemId}
                cardTitle={cardTitle}
                name={name}
              />
            </div>

            {/*content*/}
            <div className='relative z-20 grid gap-12 py-8 md:grid-cols-2 lg:grid-cols-12 lg:py-10'>
              {/*image*/}
              <div className='flex items-center justify-center md:order-2 md:col-span-1 lg:col-span-3'>
                {showCardImagesSlider ? (
                  <div className='relative min-h-[560px] w-full md:h-[500px] md:min-h-[500px] lg:h-[600px]'>
                    <CardImageSlider
                      assets={assets}
                      showThumbnails={false}
                      showBullets={false}
                      showFullscreenButton={false}
                      imageWidth={270}
                      slideTitle={cardTitle}
                      slideClassName='relative w-full min-h-[560px] md:min-h-[500px] md:h-[500px] lg:h-[600px]'
                      slideImageClassName='absolute inset-0'
                      arrowLeftClassName={'absolute top-half left-0 lg:-left-10 z-40'}
                      arrowRightClassName={'absolute top-half right-0 lg:-right-10 z-40'}
                      additionalClass='standard-card-image-slider'
                    />
                  </div>
                ) : (
                  <div className='relative h-[320px] w-full md:h-[500px] lg:h-[600px]'>
                    <WpImage
                      url={`${product.mainImage}`}
                      alt={cardTitle}
                      title={cardTitle}
                      width={240}
                      className='absolute inset-0 h-full w-full object-contain'
                    />
                  </div>
                )}
              </div>

              {/*main data*/}
              <div className='flex flex-col md:order-3 md:col-span-2 lg:col-span-7'>
                {/*desktop title*/}
                <div className='visually-hidden lg:visually-visible'>
                  <CardTitle
                    cardTitle={cardTitle}
                    showArticle={showArticle}
                    productId={product._id}
                    itemId={product.itemId}
                    name={name}
                  />
                </div>

                {/*connections*/}
                {variants.length > 0 ? (
                  <div className='mb-8'>
                    {variants.map(({ _id, attribute, products }) => {
                      return (
                        <div key={`${_id}`} className='mb-8'>
                          <div className='mb-3 font-bold text-secondary-text'>{`${attribute?.name}:`}</div>
                          <div className='flex flex-wrap gap-2'>
                            {products.map(({ option, productSlug, isCurrent }) => {
                              const name = `${option?.name} ${
                                attribute?.metric ? ` ${attribute.metric.name}` : ''
                              }`;

                              return (
                                <TagLink
                                  theme={'primary'}
                                  data-cy={`card-connection`}
                                  className={isCurrent ? `pointer-events-none` : ``}
                                  key={`${option?.name}`}
                                  isActive={isCurrent}
                                  href={`/${productSlug}`}
                                >
                                  {name}
                                </TagLink>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/*price*/}
                <div className='mb-6 mt-auto flex flex-wrap items-baseline gap-6'>
                  <CardPrices minPrice={minPrice} maxPrice={maxPrice} shopsCount={shopsCount} />

                  {/*availability*/}
                  {configs.isOneShopCompany || maxAvailable === 0 ? null : (
                    <a
                      href={`#card-shops`}
                      className='flex items-center'
                      onClick={(e) => {
                        e.preventDefault();
                        const target = e.target as Element;
                        const distId = target.getAttribute('href');
                        const distElement = document.querySelector(`${distId}`);
                        if (distElement) {
                          window.scrollTo({
                            top: noNaN(distElement.getBoundingClientRect().top),
                            left: 0,
                            behavior: 'smooth',
                          });
                        }
                      }}
                    >
                      {isShopless ? (
                        'Нет в наличии'
                      ) : (
                        <React.Fragment>
                          В наличии в {shopsCount} {shopsCounterPostfix}. Посмотреть
                          <WpIcon name={'eye'} className='ml-2 h-5 w-5' />
                        </React.Fragment>
                      )}
                    </a>
                  )}
                </div>

                {/*cart button*/}
                <div className='mb-8 flex flex-wrap gap-4'>
                  <div className='flex max-w-[460px] flex-col gap-6 xs:flex-row'>
                    <ProductAddToCartButton
                      available={maxAvailable}
                      disabled={isShopless}
                      productId={product._id}
                      shopProductIds={
                        (cardShops || []).length > 0 ? [`${cardShops[0].cardShopProduct?._id}`] : []
                      }
                      testId={`card-add-to-cart`}
                    />
                  </div>
                </div>
              </div>

              {/*list features*/}
              <div className='flex flex-col justify-center md:order-1 md:col-span-1 lg:col-span-2'>
                {visibleListFeatures.map(({ attribute, readableValue }) => {
                  if (!attribute || !attribute.showInCard) {
                    return null;
                  }

                  return (
                    <div key={`${attribute._id}`} className='mb-6'>
                      <div className='mb-1 font-bold text-secondary-text'>{attribute.name}</div>
                      <div>{readableValue}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Inner>
      </div>

      <Inner lowTop lowBottom>
        {/* Features */}
        {showFeaturesSection ? (
          <div className='mb-28' id={`card-features`}>
            <div className='mb-12 grid gap-8 md:grid-cols-7'>
              <div className='md:col-span-2'>
                {/*icon features*/}
                <CardIconFeatures
                  className='mb-12'
                  iconFeatures={iconFeatures}
                  rubricSlug={product.rubricSlug}
                />

                {/*tag features*/}
                <CardTagFeatures
                  className='mb-12'
                  tagFeatures={tagFeatures}
                  rubricSlug={product.rubricSlug}
                />

                {/*rating features*/}
                <CardRatingFeatures className='mb-12' ratingFeatures={ratingFeatures} />
              </div>

              {/*text features*/}
              <CardTextFeatures
                cardTitle={cardTitle}
                textFeatures={textFeatures}
                className='md:col-span-5'
              >
                {/*brand / brand collection / manufacturer as features*/}
                {brand || manufacturer || brandCollection ? (
                  <section className='mb-8 max-w-[30rem]'>
                    <h2 className='mb-4 text-2xl font-medium'>Дополнительная информация</h2>

                    <ul className='space-y-4 sm:space-y-2'>
                      {brand ? (
                        <li className='justify-between sm:flex'>
                          <div className='sm:half-column mb-1 font-bold text-secondary-text'>
                            Бренд
                          </div>
                          <div
                            className='sm:half-column cursor-pointer hover:text-theme sm:text-right'
                            onClick={() => {
                              router
                                .push(
                                  `${ROUTE_CATALOGUE}/${product.rubricSlug}/${FILTER_BRAND_KEY}${FILTER_SEPARATOR}${brand.itemId}`,
                                )
                                .catch(console.log);
                            }}
                          >
                            {brand.name}
                          </div>
                        </li>
                      ) : null}

                      {brand?.mainUrl ? (
                        <li className='justify-between sm:flex'>
                          <div className='sm:half-column mb-1 font-bold text-secondary-text'>
                            Сайт бренда
                          </div>
                          <div className='sm:half-column sm:text-right'>
                            <a
                              className='text-primary-text'
                              target={'_blank'}
                              href={brand.mainUrl}
                              rel={'noreferrer nofollow'}
                            >
                              {brand.mainUrl}
                            </a>
                          </div>
                        </li>
                      ) : null}

                      {brandCollection && brand ? (
                        <li className='justify-between sm:flex'>
                          <div className='sm:half-column mb-1 font-bold text-secondary-text'>
                            Линейка бренда
                          </div>
                          <div
                            className='sm:half-column cursor-pointer hover:text-theme sm:text-right'
                            onClick={() => {
                              router
                                .push(
                                  `${ROUTE_CATALOGUE}/${product.rubricSlug}/${FILTER_BRAND_KEY}${FILTER_SEPARATOR}${brand.itemId}/${FILTER_BRAND_COLLECTION_KEY}${FILTER_SEPARATOR}${brandCollection.itemId}`,
                                )
                                .catch(console.log);
                            }}
                          >
                            {brandCollection.name}
                          </div>
                        </li>
                      ) : null}

                      {manufacturer ? (
                        <li className='justify-between sm:flex'>
                          <div className='sm:half-column mb-1 font-bold text-secondary-text'>
                            Производитель
                          </div>
                          <div className='sm:half-column sm:text-right'>{manufacturer.name}</div>
                        </li>
                      ) : null}

                      {manufacturer?.mainUrl ? (
                        <li className='justify-between sm:flex'>
                          <div className='sm:half-column mb-1 font-bold text-secondary-text'>
                            Сайт производителя
                          </div>
                          <div className='sm:half-column sm:text-right'>
                            <div
                              className='cursor-pointer text-primary-text hover:underline'
                              onClick={() => {
                                window.open(`${manufacturer.mainUrl}`, '_blank');
                              }}
                            >
                              {manufacturer.mainUrl}
                            </div>
                          </div>
                        </li>
                      ) : null}
                    </ul>
                  </section>
                ) : null}
              </CardTextFeatures>
            </div>
          </div>
        ) : null}

        {videos && videos.length > 0 ? (
          <div className='mb-28 space-y-8'>
            {videos.map((video, index) => {
              return (
                <div className={`video-box`} key={index}>
                  {parse(video, {
                    trim: true,
                  })}
                </div>
              );
            })}
          </div>
        ) : null}

        {/*dynamic content*/}
        <CardDynamicContent cardContent={cardContent} product={cardData.product} />

        {/*similar products*/}
        <CardSimilarProducts similarProducts={similarProducts} />

        {/*shops*/}
        {configs.isOneShopCompany ? null : <CardShopsList cardShops={cardShops} />}
      </Inner>
    </article>
  );
};

export default CardDefaultLayout;
