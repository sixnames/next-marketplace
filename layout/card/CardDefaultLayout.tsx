import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import HorizontalScroll from 'components/HorizontalScroll';
import Inner from 'components/Inner';
import TagLink from 'components/Link/TagLink';
import PageEditor from 'components/PageEditor';
import ProductSnippetGrid from 'components/Product/ProductSnippetGrid';
import Title from 'components/Title';
import {
  CATALOGUE_OPTION_SEPARATOR,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  ROUTE_CATALOGUE,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import useCardFeatures from 'hooks/useCardFeatures';
import useGetSimilarProducts from 'hooks/useGetSimilarProducts';
import useUpdateCardCounter from 'hooks/useUpdateCardCounter';
import CardActions from 'layout/card/CardActions';
import CardPrices from 'layout/card/CardPrices';
import CardShopsList from 'layout/card/CardShopsList';
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
}

const CardTitle: React.FC<CardTitleInterface> = ({ name, originalName, itemId }) => {
  const { getSiteConfigBoolean } = useConfigContext();
  const showArticle = getSiteConfigBoolean('showCardArticle');
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
        <CardActions />
      </div>
    </div>
  );
};

const CardDefaultLayout: React.FC<CardLayoutInterface> = ({ cardData, companySlug, companyId }) => {
  const shopsCounterPostfix = noNaN(cardData.shopsCount) > 1 ? 'магазинах' : 'магазине';
  const isShopless = noNaN(cardData.shopsCount) < 1;
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const { similarProducts } = useGetSimilarProducts({
    companyId,
    productId: cardData._id,
  });
  const {
    showFeaturesSection,
    visibleListFeatures,
    ratingFeatures,
    textFeatures,
    tagFeatures,
    iconFeatures,
  } = useCardFeatures(cardData);

  // update product counters
  useUpdateCardCounter({
    companySlug,
    shopProductIds: cardData.shopProductIds,
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
                    productId={cardData._id}
                    originalName={cardData.originalName}
                    itemId={cardData.itemId}
                    name={cardData.name}
                  />
                </div>

                {/*connections*/}
                {(cardData.connections || []).length > 0 ? (
                  <div className='mb-8'>
                    {(cardData.connections || []).map(({ _id, attribute, connectionProducts }) => {
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

                {/*cart action elements*/}
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
                {(visibleListFeatures || []).map(({ showInCard, _id, name, readableValue }) => {
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
                {iconFeatures.map((attribute) => {
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
                                icon={option.icon}
                                href={`${ROUTE_CATALOGUE}/${cardData.rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
                                testId={`card-icon-option-${name}`}
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

                {ratingFeatures.length > 0 ? (
                  <div className=''>
                    <div className=''>Мнение экспертов:</div>
                    <ul className='flex flex-wrap gap-4'>
                      {(cardData.ratingFeatures || []).map(({ _id, name, number }) => {
                        const optionName = `${name} ${number}`;
                        return (
                          <li key={`${_id}`}>
                            <TagLink testId={`card-rating-option-${name}`}>{optionName}</TagLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className='md:col-span-5'>
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
            </div>
          </div>
        ) : null}

        {cardData.cardContent && cardData.cardContent.value ? (
          <section className='mb-28'>
            <PageEditor value={JSON.parse(cardData.cardContent.value)} readOnly />
          </section>
        ) : null}

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
