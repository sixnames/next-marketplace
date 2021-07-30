import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import HorizontalScroll from 'components/HorizontalScroll';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import TagLink from 'components/Link/TagLink';
import ProductSnippetGrid from 'components/Product/ProductSnippetGrid';
import Title from 'components/Title';
import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import useCardData from 'hooks/useCardData';
import CardControls from 'layout/card/CardControls';
import CardDynamicContent from 'layout/card/CardDynamicContent';
import CardIconFeatures from 'layout/card/CardIconFeatures';
import CardPrices from 'layout/card/CardPrices';
import CardShopsList from 'layout/card/CardShopsList';
import { noNaN } from 'lib/numbers';
import Image from 'next/image';
import { CardLayoutInterface } from 'pages/catalogue/[rubricSlug]/product/[card]';
import * as React from 'react';

const dataSectionClassName = 'mb-14';
const stickyClassName = 'sticky top-20';

const CardHalfColumnsLayout: React.FC<CardLayoutInterface> = ({
  cardData,
  companySlug,
  companyId,
}) => {
  const {
    isSingleImage,
    similarProducts,
    showFeaturesSection,
    visibleListFeatures,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
    shopsCounterPostfix,
    isShopless,
    addShoplessProductToCart,
    addProductToCart,
    showArticle,
    assets,
    connections,
  } = useCardData({
    cardData,
    companySlug,
    companyId,
  });

  return (
    <article className='pb-20 pt-8 lg:pt-0' data-cy={`card`}>
      <Breadcrumbs currentPageName={cardData.originalName} config={cardData.cardBreadcrumbs} />

      <div className='mb-28 relative'>
        <Inner lowBottom lowTop>
          {/*title*/}
          <div className='mb-8'>
            <Title low>{cardData.originalName}</Title>
            <div className='flex items-center gap-4 mt-4'>
              {/*article*/}
              {showArticle ? (
                <div className='text-secondary-text text-sm'>Арт: {cardData.itemId}</div>
              ) : null}
            </div>
          </div>

          {/*columns*/}
          <div className='lg:grid lg:grid-cols-7 gap-8 mb-28'>
            {/*gallery*/}
            <div className='lg:col-span-4 relative'>
              {isSingleImage ? (
                <div className={stickyClassName}>
                  <div className='relative mb-12 lg:mb-0 w-full max-w-[480px] mx-auto'>
                    <Image
                      src={`${cardData.mainImage}`}
                      alt={cardData.originalName}
                      title={cardData.originalName}
                      width={480}
                      height={480}
                      objectFit='contain'
                    />
                  </div>
                </div>
              ) : (
                <div className={stickyClassName}>
                  <div className='overflow-x-auto lg:overflow-x-auto max-w-full'>
                    <div className='flex mb-12 lg:mb-0 lg:grid lg:grid-cols-2 gap-x-6 gap-y-8'>
                      {assets.map(({ url }) => {
                        return (
                          <div key={url} className='min-w-[260px] lg:min-w-full'>
                            <Image
                              src={url}
                              alt={cardData.originalName}
                              title={cardData.originalName}
                              width={400}
                              height={400}
                              objectFit='contain'
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/*data*/}
            <div className='lg:col-span-3 relative'>
              <div className={stickyClassName}>
                {/*main block*/}
                <div className={`rounded-xl bg-secondary px-6 py-8 ${dataSectionClassName}`}>
                  {/*price*/}
                  <div className='flex flex-wrap gap-6 items-baseline mb-8'>
                    <CardPrices cardPrices={cardData.cardPrices} shopsCount={cardData.shopsCount} />

                    {/*availability*/}
                    <a
                      href={`#card-shops`}
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
                      {isShopless
                        ? 'Нет в наличии'
                        : `В наличии в ${cardData.shopsCount} ${shopsCounterPostfix}`}
                    </a>
                  </div>

                  <div className='flex items-center justify-between flex-wrap gap-6'>
                    {/*cart button*/}
                    <Button
                      onClick={() => {
                        if (cardData.shopProducts && cardData.shopProducts.length < 2) {
                          addProductToCart({
                            amount: 1,
                            productId: cardData._id,
                            shopProductId: `${cardData.shopProducts[0]._id}`,
                          });
                        } else {
                          addShoplessProductToCart({
                            amount: 1,
                            productId: cardData._id,
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
                          <div className='text-secondary-text mb-3 font-medium'>{`${attribute?.name}:`}</div>
                          <div className='grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-6'>
                            {(connectionProducts || []).map(
                              ({ option, productSlug, shopProduct }) => {
                                const mainImage = shopProduct?.mainImage;
                                const isCurrent = productSlug === cardData.slug;
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
                                      <Image
                                        src={mainImage}
                                        alt={name}
                                        layout='fill'
                                        objectFit='contain'
                                      />
                                    </div>
                                    <div className='mt-3 text-sm'>{name}</div>
                                    {isCurrent ? null : (
                                      <Link
                                        className='absolute inset-0 z-30 block text-indent-full overflow-hidden'
                                        href={`${ROUTE_CATALOGUE}/${cardData.rubricSlug}/product/${productSlug}`}
                                      >
                                        {name}
                                      </Link>
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/*list features*/}
                <section className={`${dataSectionClassName}`}>
                  <h2 className='text-2xl mb-4'>Характеристики</h2>

                  <ul className='space-y-6'>
                    {visibleListFeatures.map(({ showInCard, _id, name, readableValue }) => {
                      if (!showInCard) {
                        return null;
                      }

                      return (
                        <li key={`${_id}`} className='sm:flex justify-between'>
                          <div className='text-secondary-text mb-1 font-medium'>{name}</div>
                          <div>{readableValue}</div>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {showFeaturesSection ? (
                  <React.Fragment>
                    {/*icon features*/}
                    <CardIconFeatures
                      iconFeatures={iconFeatures}
                      className={dataSectionClassName}
                      rubricSlug={cardData.rubricSlug}
                    />

                    {/*tag features*/}
                    <div className={`${dataSectionClassName}`}>
                      {tagFeatures.map((attribute) => {
                        return (
                          <div key={`${attribute._id}`} className='mb-8'>
                            <div className='text-secondary-text mb-3 font-medium'>{`${attribute.name}:`}</div>
                            <ul className='flex flex-wrap gap-4'>
                              {(attribute.options || []).map((option) => {
                                const name = `${option?.name} ${
                                  attribute?.metric ? ` ${attribute.metric.name}` : ''
                                }`;

                                return (
                                  <li key={`${option?.name}`}>
                                    <TagLink
                                      href={`${ROUTE_CATALOGUE}/${cardData.rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
                                      testId={`card-tag-option-${name}`}
                                    >
                                      {name}
                                    </TagLink>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>

                    {/*rating features*/}
                    <div className={`${dataSectionClassName}`}>
                      {ratingFeatures.length > 0 ? (
                        <div className=''>
                          <div className=''>Мнение экспертов:</div>
                          <ul className='flex flex-wrap gap-4'>
                            {(cardData.ratingFeatures || []).map(({ _id, name, number }) => {
                              const optionName = `${name} ${number}`;
                              return (
                                <li key={`${_id}`}>
                                  <TagLink testId={`card-rating-option-${name}`}>
                                    {optionName}
                                  </TagLink>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </div>

          {/*text features*/}
          {textFeatures.length > 0 ? (
            <div className='mb-28'>
              {textFeatures.map(({ _id, name, readableValue }) => {
                if (!readableValue) {
                  return null;
                }
                return (
                  <section className='mb-8' key={`${_id}`}>
                    <h2 className='text-2xl mb-4'>{name}</h2>
                    <div className='prose max-w-full'>
                      <p>{readableValue}</p>
                    </div>
                  </section>
                );
              })}
            </div>
          ) : null}

          {/*dynamic content*/}
          <CardDynamicContent cardContent={cardData.cardContent} />

          {/*shops*/}
          <CardShopsList cardShopProducts={cardData.cardShopProducts} />

          {/*similar products*/}
          {similarProducts.length > 0 ? (
            <section className='mb-28'>
              <h2 className='text-2xl font-medium mb-6'>Вам может понравиться</h2>

              <HorizontalScroll>
                {similarProducts.map((product) => {
                  return (
                    <div className='flex min-w-[80vw] sm:min-w-[30rem]' key={`${product._id}`}>
                      <ProductSnippetGrid noAttributes noSecondaryName product={product} />
                    </div>
                  );
                })}
              </HorizontalScroll>
            </section>
          ) : null}
        </Inner>
      </div>
    </article>
  );
};

export default CardHalfColumnsLayout;
