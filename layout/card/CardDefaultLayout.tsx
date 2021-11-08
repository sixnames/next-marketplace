import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/button/Button';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import TagLink from 'components/Link/TagLink';
import WpImage from 'components/WpImage';
import CardSimilarProducts from 'layout/card/CardSimilarProducts';
import Title from 'components/Title';
import { ROUTE_CATALOGUE } from 'config/common';
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

interface CardTitleInterface {
  productId: any;
  itemId: string;
  tag?: keyof JSX.IntrinsicElements;
  showArticle: boolean;
  cardTitle: string;
  name?: string | null;
}

const CardTitle: React.FC<CardTitleInterface> = ({ cardTitle, showArticle, name, itemId }) => {
  return (
    <div className='mb-6'>
      <Title className='mb-1' low>
        {cardTitle}
      </Title>

      {name ? <div className='text-secondary-text mb-2'>{name}</div> : null}

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
    product,
    cardBreadcrumbs,
    cardPrices,
    shopsCount,
    cardShops,
    cardContent,
    assets,
    showCardImagesSlider,
    cardTitle,
  } = useCardData({
    cardData,
    companySlug,
    companyId,
  });

  const { brand, brandCollection, manufacturer, name, cardDescription } = product;

  return (
    <article className='pb-20 pt-8 lg:pt-0' data-cy={`card`}>
      <Breadcrumbs currentPageName={cardTitle} config={cardBreadcrumbs} />

      <div className='mb-28 relative'>
        <Inner className='relative z-20' lowBottom lowTop>
          {/*content holder*/}
          <div className='relative'>
            {/*mobile title*/}
            <div className='relative z-20 lg:hidden pt-8 pr-inner-block-horizontal-padding'>
              <CardTitle
                showArticle={showArticle}
                productId={product._id}
                itemId={product.itemId}
                cardTitle={cardTitle}
                name={name}
              />
            </div>

            {/*content*/}
            <div className='relative z-20 grid gap-12 py-8 pr-inner-block-horizontal-padding md:grid-cols-2 lg:py-10 lg:grid-cols-12'>
              {/*image*/}
              <div className='md:col-span-1 md:order-2 lg:col-span-3 flex justify-center items-center'>
                {showCardImagesSlider ? (
                  <div className='relative w-full min-h-[560px] md:min-h-[500px] md:h-[500px] lg:h-[600px]'>
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
                  <div className='relative w-full md:h-[500px] lg:h-[600px]'>
                    <WpImage
                      url={`${product.mainImage}`}
                      alt={cardTitle}
                      title={cardTitle}
                      width={240}
                      className='absolute inset-0 w-full h-full object-contain'
                    />
                  </div>
                )}
              </div>

              {/*main data*/}
              <div className='flex flex-col md:col-span-2 md:order-3 lg:col-span-7'>
                {/*desktop title*/}
                <div className='hidden lg:block'>
                  <CardTitle
                    cardTitle={cardTitle}
                    showArticle={showArticle}
                    productId={product._id}
                    itemId={product.itemId}
                    name={name}
                  />
                </div>

                {/*connections*/}
                {connections.length > 0 ? (
                  <div className='mb-8'>
                    {connections.map(({ _id, attribute, connectionProducts }) => {
                      return (
                        <div key={`${_id}`} className='mb-8'>
                          <div className='text-secondary-text mb-3 font-bold'>{`${attribute?.name}:`}</div>
                          <div className='flex flex-wrap gap-2'>
                            {(connectionProducts || []).map(({ option, productSlug }) => {
                              const isCurrent = productSlug === product.slug;
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
                                  href={`${ROUTE_CATALOGUE}/${product.rubricSlug}/product/${productSlug}`}
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
                      console.log({
                        target,
                        distId,
                        distElement,
                      });
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

                {/*cart button*/}
                <div className='flex flex-wrap gap-4 mb-8'>
                  <div className='flex flex-col xs:flex-row gap-6 max-w-[460px]'>
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
                  </div>
                </div>
              </div>

              {/*list features*/}
              <div className='flex flex-col justify-center md:col-span-1 md:order-1 lg:col-span-2'>
                {visibleListFeatures.map(({ attribute, _id, readableValue }) => {
                  if (!attribute || !attribute.showInCard) {
                    return null;
                  }

                  return (
                    <div key={`${_id}`} className='mb-6'>
                      <div className='text-secondary-text mb-1 font-bold'>{attribute.name}</div>
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
                cardDescription={cardDescription}
                textFeatures={textFeatures}
                className='md:col-span-5'
              >
                {/*brand / brand collection / manufacturer as features*/}
                {brand || manufacturer || brandCollection ? (
                  <section className='mb-8 max-w-[30rem]'>
                    <h2 className='text-2xl mb-4 font-medium'>Дополнительная информация</h2>

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
                              rel='noreferrer'
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
                              rel='noreferrer'
                            >
                              {manufacturer.mainUrl}
                            </a>
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

        {/*dynamic content*/}
        <CardDynamicContent cardContent={cardContent} />

        {/*shops*/}
        <CardShopsList cardShops={cardShops} />

        {/*similar products*/}
        <CardSimilarProducts similarProducts={similarProducts} />
      </Inner>
    </article>
  );
};

export default CardDefaultLayout;
