import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import HorizontalScroll from 'components/HorizontalScroll';
import Inner from 'components/Inner';
import TagLink from 'components/Link/TagLink';
import ProductSnippetGrid from 'components/Product/ProductSnippetGrid';
import Title from 'components/Title';
import { LOCALE_NOT_FOUND_FIELD_MESSAGE, ROUTE_CATALOGUE } from 'config/common';
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
import Image from 'next/image';
import { CardLayoutInterface } from 'pages/catalogue/[rubricSlug]/product/[card]';
import * as React from 'react';

interface CardTitleInterface {
  productId: any;
  originalName: string;
  name?: string | null;
  itemId: string;
  tag?: keyof JSX.IntrinsicElements;
  showArticle: boolean;
}

const CardTitle: React.FC<CardTitleInterface> = ({ name, originalName, showArticle, itemId }) => {
  return (
    <div className='mb-6'>
      <Title className='mb-1' low>
        {originalName}
      </Title>
      {name && name !== LOCALE_NOT_FOUND_FIELD_MESSAGE ? (
        <div className='text-secondary-text mb-4'>{name}</div>
      ) : null}

      <div className='flex justify-between items-center'>
        {showArticle ? <div className='text-secondary-text text-sm'>Арт: {itemId}</div> : null}

        {/*controls*/}
        <CardControls />
      </div>
    </div>
  );
};

const CardDefaultLayout: React.FC<CardLayoutInterface> = ({ cardData, companySlug, companyId }) => {
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
    addShoplessProductToCart,
    addProductToCart,
    showArticle,
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
        <Inner className='relative z-20' lowBottom lowTop>
          {/*content holder*/}
          <div className='relative'>
            {/*desktop title*/}
            <div className='relative z-20 lg:hidden pt-8 pr-inner-block-horizontal-padding'>
              <CardTitle
                showArticle={showArticle}
                productId={cardData._id}
                originalName={cardData.originalName}
                itemId={cardData.itemId}
                name={cardData.name}
              />
            </div>

            {/*content*/}
            <div className='relative z-20 grid gap-12 py-8 pr-inner-block-horizontal-padding md:grid-cols-2 lg:py-10 lg:grid-cols-12'>
              {/*image*/}
              <div className='md:col-span-1 md:order-2 lg:col-span-3 lg:flex lg:justify-center'>
                <div className='relative h-[300px] w-[160px] md:h-[500px] lg:h-[600px]'>
                  <Image
                    src={`${cardData.mainImage}`}
                    alt={cardData.originalName}
                    title={cardData.originalName}
                    layout='fill'
                    objectFit='contain'
                  />
                </div>
              </div>

              {/*main data*/}
              <div className='flex flex-col md:col-span-2 md:order-3 lg:col-span-7'>
                {/*desktop title*/}
                <div className='hidden lg:block'>
                  <CardTitle
                    showArticle={showArticle}
                    productId={cardData._id}
                    originalName={cardData.originalName}
                    itemId={cardData.itemId}
                    name={cardData.name}
                  />
                </div>

                {/*connections*/}
                {connections.length > 0 ? (
                  <div className='mb-8'>
                    {connections.map(({ _id, attribute, connectionProducts }) => {
                      return (
                        <div key={`${_id}`} className='mb-8'>
                          <div className='text-secondary-text mb-3 font-medium'>{`${attribute?.name}:`}</div>
                          <div className='flex flex-wrap gap-2'>
                            {(connectionProducts || []).map(({ option, productSlug }) => {
                              const isCurrent = productSlug === cardData.slug;
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
                                  href={`${ROUTE_CATALOGUE}/${cardData.rubricSlug}/product/${productSlug}`}
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
                <div className='flex flex-wrap gap-6 items-baseline mb-6 mt-auto'>
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

                {/*cart button*/}
                <div className='flex flex-wrap gap-4 mb-8'>
                  <div className='flex flex-col xs:flex-row gap-6 max-w-[460px]'>
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
                  </div>
                </div>
              </div>

              {/*list features*/}
              <div className='flex flex-col justify-center md:col-span-1 md:order-1 lg:col-span-2'>
                {visibleListFeatures.map(({ showInCard, _id, name, readableValue }) => {
                  if (!showInCard) {
                    return null;
                  }

                  return (
                    <div key={`${_id}`} className='mb-6'>
                      <div className='text-secondary-text mb-1 font-medium'>{name}</div>
                      <div>{readableValue}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/*bg*/}
            <div className='absolute inset-x-0 inset-y-0 --xl:top-[10%] --xl:h-[80%] z-10 bg-secondary rounded-tr-xl rounded-br-xl wp-shadow-bottom-right-100' />
          </div>
        </Inner>

        {/*bg left patch*/}
        <div className='absolute z-10 inset-x-0 inset-y-0 --xl:top-[10%] --xl:h-[80%] left-0 w-[50%] bg-secondary' />
      </div>

      <Inner lowTop lowBottom>
        {/* Features */}
        {showFeaturesSection ? (
          <div className='mb-28' id={`card-features`}>
            <div className='grid gap-8 md:grid-cols-7 mb-12'>
              <div className='md:col-span-2'>
                {/*icon features*/}
                <CardIconFeatures
                  className='mb-12'
                  iconFeatures={iconFeatures}
                  rubricSlug={cardData.rubricSlug}
                />

                {/*tag features*/}
                <CardTagFeatures
                  className='mb-12'
                  tagFeatures={tagFeatures}
                  rubricSlug={cardData.rubricSlug}
                />

                {/*rating features*/}
                <CardRatingFeatures className='mb-12' ratingFeatures={ratingFeatures} />
              </div>

              {/*text features*/}
              <CardTextFeatures textFeatures={textFeatures} className='md:col-span-5' />
            </div>
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
    </article>
  );
};

export default CardDefaultLayout;
