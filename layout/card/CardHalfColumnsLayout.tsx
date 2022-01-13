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
import { useSiteContext } from '../../context/siteContext';
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
  const { urlPrefix } = useSiteContext();
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
      <WpBreadcrumbs urlPrefix={urlPrefix} currentPageName={cardTitle} config={cardBreadcrumbs} />

      <div className='mb-28 relative'>
        <Inner lowBottom lowTop>
          {/*title*/}
          <div className='mb-8'>
            <WpTitle low>{cardTitle}</WpTitle>
            {name ? <h2 className='text-secondary-text mt-3'>{name}</h2> : null}
            <div className='flex items-center gap-4 mt-4'>
              {/*article*/}
              {showArticle ? (
                <div className='text-secondary-text text-sm'>Арт: {product.itemId}</div>
              ) : null}
            </div>
          </div>

          {/*columns*/}
          <div className='lg:grid lg:grid-cols-7 gap-8 mb-28'>
            {/*gallery*/}
            <div className='lg:col-span-4 relative'>
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
            <div className='lg:col-span-3 relative'>
              <div className={stickyClassName}>
                {/*main block*/}
                <div className={`rounded-xl bg-secondary px-6 py-8 ${dataSectionClassName}`}>
                  {/*brand preview*/}
                  {brand && brand.logo ? (
                    <div
                      className={`flex items-center mb-6 gap-3 relative cursor-pointer group`}
                      onClick={() => {
                        router
                          .push(
                            `${urlPrefix}${ROUTE_CATALOGUE}/${product.rubricSlug}/${FILTER_BRAND_KEY}${FILTER_SEPARATOR}${brand.itemId}`,
                          )
                          .catch(console.log);
                      }}
                    >
                      <WpImage
                        className='object-contain w-[70px] h-[70px]'
                        url={brand.logo}
                        alt={`О бренде ${brand.name}`}
                        title={`О бренде ${brand.name}`}
                        width={70}
                      />
                      <div className='group-hover:underline'>О бренде</div>
                    </div>
                  ) : null}

                  {/*price*/}
                  <div className='flex flex-wrap gap-6 items-baseline mb-8'>
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
                            <WpIcon name={'eye'} className='w-5 h-5 ml-2' />
                          </React.Fragment>
                        )}
                      </a>
                    )}
                  </div>

                  <div className='flex items-center justify-between flex-wrap gap-6'>
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
                          <div className='text-secondary-text mb-3 font-bold'>{`${attribute?.name}:`}</div>
                          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6'>
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
                                      className='absolute inset-0 w-full h-full object-contain'
                                    />
                                  </div>
                                  <div className='mt-3 text-sm'>{name}</div>
                                  {isCurrent ? null : (
                                    <WpLink
                                      className='absolute inset-0 z-30 block text-indent-full overflow-hidden'
                                      href={`${urlPrefix}/${summary?.slug}`}
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
                      <h2 className='text-2xl mb-4 font-medium'>{attributesGroup.name}</h2>

                      <ul className='space-y-4 sm:space-y-2'>
                        {attributesGroup.attributes.map(({ attribute, readableValue }) => {
                          if (!attribute) {
                            return null;
                          }
                          return (
                            <li key={`${attribute._id}`} className='sm:flex justify-between'>
                              <div className='text-secondary-text mb-1 font-bold sm:half-column'>
                                {attribute.name}
                              </div>
                              <div className='sm:text-right sm:half-column'>{readableValue}</div>
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
                      <h2 className='text-2xl mb-4 font-medium'>{cardBrandsLabel}</h2>
                    ) : null}

                    <ul className='space-y-4 sm:space-y-2'>
                      {brand ? (
                        <li className='sm:flex justify-between'>
                          <div className='text-secondary-text mb-1 font-bold sm:half-column'>
                            Бренд
                          </div>
                          <div
                            className='sm:text-right sm:half-column cursor-pointer hover:text-theme'
                            onClick={() => {
                              router
                                .push(
                                  `${urlPrefix}${ROUTE_CATALOGUE}/${product.rubricSlug}/${FILTER_BRAND_KEY}${FILTER_SEPARATOR}${brand.itemId}`,
                                )
                                .catch(console.log);
                            }}
                          >
                            {brand.name}
                          </div>
                        </li>
                      ) : null}

                      {brand?.mainUrl ? (
                        <li className='sm:flex justify-between'>
                          <div className='text-secondary-text mb-1 font-bold sm:half-column'>
                            Сайт бренда
                          </div>
                          <div className='sm:text-right sm:half-column'>
                            <div
                              className='text-primary-text cursor-pointer hover:underline'
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
                        <li className='sm:flex justify-between'>
                          <div className='text-secondary-text mb-1 font-bold sm:half-column'>
                            Линейка бренда
                          </div>
                          <div
                            className='sm:text-right sm:half-column cursor-pointer hover:text-theme'
                            onClick={() => {
                              router
                                .push(
                                  `${urlPrefix}${ROUTE_CATALOGUE}/${product.rubricSlug}/${FILTER_BRAND_KEY}${FILTER_SEPARATOR}${brand.itemId}/${FILTER_BRAND_COLLECTION_KEY}${FILTER_SEPARATOR}${brandCollection.itemId}`,
                                )
                                .catch(console.log);
                            }}
                          >
                            {brandCollection.name}
                          </div>
                        </li>
                      ) : null}

                      {manufacturer ? (
                        <li className='sm:flex justify-between'>
                          <div className='text-secondary-text mb-1 font-bold sm:half-column'>
                            Производитель
                          </div>
                          <div className='sm:text-right sm:half-column'>{manufacturer.name}</div>
                        </li>
                      ) : null}

                      {manufacturer?.mainUrl ? (
                        <li className='sm:flex justify-between'>
                          <div className='text-secondary-text mb-1 font-bold sm:half-column'>
                            Сайт производителя
                          </div>
                          <div className='sm:text-right sm:half-column'>
                            <div
                              className='text-primary-text cursor-pointer hover:underline'
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
            <div className='space-y-8 mb-28'>
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

          {/*shops*/}
          {configs.isOneShopCompany ? null : <CardShopsList cardShops={cardShops} />}

          {/*similar products*/}
          <CardSimilarProducts similarProducts={similarProducts} />
        </Inner>
      </div>
    </article>
  );
};

export default CardHalfColumnsLayout;
