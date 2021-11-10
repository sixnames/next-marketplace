import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/button/Button';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import WpImage from 'components/WpImage';
import { useSiteContext } from 'context/siteContext';
import CardSimilarProducts from 'layout/card/CardSimilarProducts';
import Title from 'components/Title';
import useCardData from 'hooks/useCardData';
import CardControls from 'layout/card/CardControls';
import CardDynamicContent from 'layout/card/CardDynamicContent';
import CardIconFeatures from 'layout/card/CardIconFeatures';
import CardPrices from 'layout/card/CardPrices';
import CardRatingFeatures from 'layout/card/CardRatingFeatures';
import CardShopsList from 'layout/card/CardShopsList';
import CardTagFeatures from 'layout/card/CardTagFeatures';
import CardTextFeatures from 'layout/card/CardTextFeatures';
import { noNaN } from 'lib/numbers';
import dynamic from 'next/dynamic';
import { CardLayoutInterface } from 'pages/catalogue/[rubricSlug]/product/[card]';
import * as React from 'react';

const CardImageSlider = dynamic(() => import('layout/card/CardImageSlider'));
const CardSimpleGallery = dynamic(() => import('layout/card/CardSimpleGallery'));

const dataSectionClassName = 'mb-14';
const stickyClassName = 'sticky top-20';

const CardHalfColumnsLayout: React.FC<CardLayoutInterface> = ({
  cardData,
  companySlug,
  companyId,
}) => {
  const { urlPrefix } = useSiteContext();
  const {
    isSingleImage,
    assets,
    similarProducts,
    attributesGroups,
    showFeaturesSection,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
    shopsCounterPostfix,
    isShopless,
    addShoplessProductToCart,
    addProductToCart,
    showArticle,
    connections,
    product,
    cardBreadcrumbs,
    cardContent,
    cardPrices,
    shopsCount,
    cardShops,
    showCardImagesSlider,
    showCardBrands,
    cardBrandsLabel,
    cardTitle,
  } = useCardData({
    cardData,
    companySlug,
    companyId,
  });

  const { brand, brandCollection, manufacturer, name, cardDescription } = product;

  return (
    <article className='pb-20 pt-8 lg:pt-0' data-cy={`card`}>
      <Breadcrumbs urlPrefix={urlPrefix} currentPageName={cardTitle} config={cardBreadcrumbs} />

      <div className='mb-28 relative'>
        <Inner lowBottom lowTop>
          {/*title*/}
          <div className='mb-8'>
            <Title low>{cardTitle}</Title>
            {name ? <div className='text-secondary-text mt-3'>{name}</div> : null}
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
                    <div className='flex items-center mb-6 gap-4 relative'>
                      <WpImage
                        className='object-contain w-[70px] h-[70px]'
                        url={brand.logo}
                        alt={`${brand.name}`}
                        title={`${brand.name}`}
                        width={70}
                      />
                      <div>{brand.name}</div>
                      {brand.mainUrl ? (
                        <a
                          target={'_blank'}
                          href={brand.mainUrl}
                          className='block absolute z-10 inset-0 text-indent-full overflow-hidden'
                          rel={'noreferrer nofollow'}
                        >
                          {brand.name}
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  {/*price*/}
                  <div className='flex flex-wrap gap-6 items-baseline mb-8'>
                    <CardPrices cardPrices={cardPrices} shopsCount={shopsCount} />

                    {/*availability*/}
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
                          <Icon name={'eye'} className='w-5 h-5 ml-2' />
                        </React.Fragment>
                      )}
                    </a>
                  </div>

                  <div className='flex items-center justify-between flex-wrap gap-6'>
                    {/*cart button*/}
                    <Button
                      onClick={() => {
                        if (cardShops && cardShops.length < 2) {
                          addProductToCart({
                            amount: 1,
                            productId: product._id,
                            shopProductId: `${cardShops[0].cardShopProduct?._id}`,
                          });
                        } else {
                          addShoplessProductToCart({
                            amount: 1,
                            productId: product._id,
                          });
                        }
                      }}
                      testId={`card-add-to-cart`}
                      className='w-full sm:half-column'
                    >
                      В корзину
                    </Button>

                    {/*controls*/}
                    <CardControls />
                  </div>
                </div>

                {/*connections*/}
                {connections.length > 0 ? (
                  <div className={dataSectionClassName}>
                    {connections.map(({ _id, attribute, connectionProducts }) => {
                      return (
                        <div key={`${_id}`} className='mb-12'>
                          <div className='text-secondary-text mb-3 font-bold'>{`${attribute?.name}:`}</div>
                          <div className='grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-6'>
                            {(connectionProducts || []).map(({ option, shopProduct }) => {
                              const mainImage = shopProduct?.product?.mainImage;
                              const isCurrent = shopProduct?.product?.slug === product.slug;
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
                                    <Link
                                      className='absolute inset-0 z-30 block text-indent-full overflow-hidden'
                                      href={`${urlPrefix}/${shopProduct?.product?.slug}`}
                                    >
                                      {name}
                                    </Link>
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
                        {attributesGroup.attributes.map(({ _id, attribute, readableValue }) => {
                          if (!attribute) {
                            return null;
                          }
                          return (
                            <li key={`${_id}`} className='sm:flex justify-between'>
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
                          <div className='sm:text-right sm:half-column'>{brand.name}</div>
                        </li>
                      ) : null}

                      {brand?.mainUrl ? (
                        <li className='sm:flex justify-between'>
                          <div className='text-secondary-text mb-1 font-bold sm:half-column'>
                            Сайт бренда
                          </div>
                          <div className='sm:text-right sm:half-column'>
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

                      {brandCollection ? (
                        <li className='sm:flex justify-between'>
                          <div className='text-secondary-text mb-1 font-bold sm:half-column'>
                            Линейка бренда
                          </div>
                          <div className='sm:text-right sm:half-column'>{brandCollection.name}</div>
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
                            <a
                              className='text-primary-text'
                              target={'_blank'}
                              href={manufacturer.mainUrl}
                              rel={'noreferrer nofollow'}
                            >
                              {manufacturer.mainUrl}
                            </a>
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
          <CardTextFeatures
            cardTitle={cardTitle}
            textFeatures={textFeatures}
            cardDescription={cardDescription}
            className='mb-28'
          />

          {/*dynamic content*/}
          <CardDynamicContent cardContent={cardContent} />

          {/*shops*/}
          <CardShopsList cardShops={cardShops} />

          {/*similar products*/}
          <CardSimilarProducts similarProducts={similarProducts} />
        </Inner>
      </div>
    </article>
  );
};

export default CardHalfColumnsLayout;
