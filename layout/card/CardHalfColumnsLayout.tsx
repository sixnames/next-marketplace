import parse from 'html-react-parser';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpLink from '../../components/Link/WpLink';
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
const CardSimpleGallery = dynamic(() => import('./CardSimpleGallery'));

const dataSectionClassName = 'mb-14';
const stickyClassName = 'sticky top-20';

const CardHalfColumnsLayout: React.FC<CardLayoutInterface> = ({ cardData, companySlug }) => {
  const router = useRouter();
  const { configs } = useConfigContext();
  const {
    isSingleImage,
    similarProducts,
    attributesGroups,
    showFeaturesSection,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
    shopsCounterPostfix,
    isShopless,
    showArticle,
    product,
    cardBreadcrumbs,
    cardContent,
    shopsCount,
    cardShops,
    showCardImagesSlider,
    showCardBrands,
    cardBrandsLabel,
    cardTitle,
    maxAvailable,
  } = useCardData({
    cardData,
    companySlug,
  });

  const {
    brand,
    brandCollection,
    manufacturer,
    name,
    variants,
    assets,
    minPrice,
    maxPrice,
    videos,
  } = product;

  return (
    <article className='pb-20 pt-8 lg:pt-0' data-cy={`card`}>
      <WpBreadcrumbs currentPageName={cardTitle} config={cardBreadcrumbs} />

      <div className='relative mb-28'>
        <Inner lowBottom lowTop>
          {/*title*/}
          <div className='mb-8'>
            <WpTitle low>{cardTitle}</WpTitle>
            {name ? <h2 className='mt-3 text-secondary-text'>{name}</h2> : null}
            <div className='mt-4 flex items-center gap-4'>
              {/*article*/}
              {showArticle ? (
                <div className='text-sm text-secondary-text'>Арт: {product.itemId}</div>
              ) : null}
            </div>
          </div>

          {/*columns*/}
          <div className='relative mb-28 gap-8 lg:grid lg:grid-cols-7'>
            {/*gallery*/}
            <div className='relative z-20 lg:col-span-4'>
              {showCardImagesSlider ? (
                <CardImageSlider
                  assets={assets}
                  className={`mb-8 lg:mb-0 ${stickyClassName}`}
                  slideTitle={cardTitle}
                  imageWidth={550}
                />
              ) : (
                <CardSimpleGallery
                  mainImage={product.mainImage}
                  className={stickyClassName}
                  alt={cardTitle}
                  title={cardTitle}
                  assets={assets}
                  isSingleImage={isSingleImage}
                />
              )}
            </div>

            {/*data*/}
            <div className='relative z-10 lg:col-span-3'>
              <div className={stickyClassName}>
                {/*main block*/}
                <div className={`rounded-xl bg-secondary px-6 py-8 ${dataSectionClassName}`}>
                  {/*brand preview*/}
                  {brand && brand.logo ? (
                    <div
                      className={`group relative mb-6 flex cursor-pointer items-center gap-3`}
                      onClick={() => {
                        router
                          .push(
                            `${ROUTE_CATALOGUE}/${product.rubricSlug}/${FILTER_BRAND_KEY}${FILTER_SEPARATOR}${brand.itemId}`,
                          )
                          .catch(console.log);
                      }}
                    >
                      <WpImage
                        className='h-[70px] w-[70px] object-contain'
                        url={brand.logo}
                        alt={`О бренде ${brand.name}`}
                        title={`О бренде ${brand.name}`}
                        width={70}
                      />
                      <div className='group-hover:underline'>О бренде</div>
                    </div>
                  ) : null}

                  {/*price*/}
                  <div className='mb-8 flex flex-wrap items-baseline gap-6'>
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

                  <div className='flex flex-wrap items-center justify-between gap-6'>
                    {/*cart button*/}
                    <ProductAddToCartButton
                      available={maxAvailable}
                      disabled={isShopless}
                      productId={product._id}
                      shopProductIds={
                        (cardShops || []).length > 0 ? [`${cardShops[0].cardShopProduct?._id}`] : []
                      }
                      testId={`card-add-to-cart`}
                    />

                    {/*controls*/}
                    <CardControls />
                  </div>
                </div>

                {/*variants*/}
                {variants.length > 0 ? (
                  <div className={dataSectionClassName}>
                    {variants.map(({ _id, attribute, products }) => {
                      return (
                        <div key={`${_id}`} className='mb-12'>
                          <div className='mb-3 font-bold text-secondary-text'>{`${attribute?.name}:`}</div>
                          <div className='grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5'>
                            {products.map(({ option, summary, isCurrent }) => {
                              const mainImage = summary?.mainImage;
                              const name = `${option?.name} ${
                                attribute?.metric ? ` ${attribute.metric.name}` : ''
                              }`;

                              if (!mainImage) {
                                return null;
                              }

                              return (
                                <div
                                  key={`${option?.name}`}
                                  className={`relative text-center ${
                                    isCurrent ? 'text-theme' : 'hover:text-theme'
                                  }`}
                                >
                                  <div className='relative h-16 w-full'>
                                    <WpImage
                                      url={mainImage}
                                      alt={name}
                                      title={name}
                                      width={100}
                                      className='absolute inset-0 h-full w-full object-contain'
                                    />
                                  </div>
                                  <div className='mt-3 text-sm'>{name}</div>
                                  {isCurrent ? null : (
                                    <WpLink
                                      className='text-indent-full absolute inset-0 z-30 block overflow-hidden'
                                      href={`/${summary?.slug}`}
                                    >
                                      {name}
                                    </WpLink>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/*attributes groups*/}
                {attributesGroups.map((attributesGroup) => {
                  if ((attributesGroup.attributes || []).length < 1) {
                    return null;
                  }
                  return (
                    <section key={`${attributesGroup._id}`} className={`${dataSectionClassName}`}>
                      <h2 className='mb-4 text-2xl font-medium'>{attributesGroup.name}</h2>

                      <ul className='space-y-4 sm:space-y-2'>
                        {attributesGroup.attributes.map(({ attribute, readableValue }) => {
                          if (!attribute) {
                            return null;
                          }
                          return (
                            <li key={`${attribute._id}`} className='justify-between sm:flex'>
                              <div className='sm:half-column mb-1 font-bold text-secondary-text'>
                                {attribute.name}
                              </div>
                              <div className='sm:half-column sm:text-right'>{readableValue}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  );
                })}

                {/*brand / brand collection / manufacturer as features*/}
                {showCardBrands && (brand || manufacturer || brandCollection) ? (
                  <section className={`${dataSectionClassName}`}>
                    {cardBrandsLabel ? (
                      <h2 className='mb-4 text-2xl font-medium'>{cardBrandsLabel}</h2>
                    ) : null}

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
                            <div
                              className='cursor-pointer text-primary-text hover:underline'
                              onClick={() => {
                                window.open(`${brand.mainUrl}`, '_blank');
                              }}
                            >
                              {brand.mainUrl}
                            </div>
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

                {showFeaturesSection ? (
                  <React.Fragment>
                    {/*icon features*/}
                    <CardIconFeatures
                      iconFeatures={iconFeatures}
                      className={dataSectionClassName}
                      rubricSlug={product.rubricSlug}
                    />

                    {/*tag features*/}
                    <CardTagFeatures
                      tagFeatures={tagFeatures}
                      className={dataSectionClassName}
                      rubricSlug={product.rubricSlug}
                    />

                    {/*rating features*/}
                    <CardRatingFeatures
                      ratingFeatures={ratingFeatures}
                      className={dataSectionClassName}
                    />
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </div>

          {/*text features*/}
          <CardTextFeatures cardTitle={cardTitle} textFeatures={textFeatures} className='mb-28' />

          {/*dynamic content*/}
          <CardDynamicContent cardContent={cardContent} product={cardData.product} />

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

          {/*similar products*/}
          <CardSimilarProducts similarProducts={similarProducts} />

          {/*shops*/}
          {configs.isOneShopCompany ? null : <CardShopsList cardShops={cardShops} />}
        </Inner>
      </div>
    </article>
  );
};

export default CardHalfColumnsLayout;
