import Button from 'components/Button';
import ControlButton from 'components/ControlButton';
import Link from 'components/Link/Link';
import RatingStars from 'components/RatingStars';
import { LOCALE_NOT_FOUND_FIELD_MESSAGE, ROUTE_CATALOGUE } from 'config/common';
import { useSiteContext } from 'context/siteContext';
import { ProductSnippetInterface } from 'db/uiInterfaces';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';
import { noNaN } from 'lib/numbers';
import Image from 'next/image';
import * as React from 'react';

const ProductSnippetRowDefault: React.FC<ProductSnippetInterface> = ({
  product,
  testId,
  className,
  showSnippetBackground,
  showSnippetButtonsOnHover,
  showSnippetArticle,
  showSnippetRating,
}) => {
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const {
    name,
    originalName,
    slug,
    cardPrices,
    itemId,
    listFeatures,
    ratingFeatures,
    connections,
    shopsCount,
    mainImage,
    rubricSlug,
    shopProductsIds,
  } = product;

  const shopsCounterPostfix = noNaN(shopsCount) > 1 ? 'магазинах' : 'магазине';
  const isShopless = noNaN(shopsCount) < 1;

  const bgClassName = showSnippetBackground
    ? 'bg-secondary dark:shadow-md'
    : 'transition-all hover:shadow-md';

  return (
    <div
      className={`group grid relative md:grid-cols-12 py-6 px-5 w-full ${bgClassName} ${
        className ? className : ''
      }`}
    >
      <div className='relative flex flex-col col-span-3 md:col-span-2 items-center justify-center flex-grow pt-4 pl-5 pr-5 snippet-image'>
        {/*image*/}
        <div className='relative flex-grow pb-5 pt-5'>
          <Image
            priority={true}
            src={mainImage}
            objectFit={'contain'}
            objectPosition={'center'}
            alt={originalName}
            title={originalName}
            width={85}
            height={190}
            quality={50}
          />
          <Link
            testId={`${testId}-image-row`}
            target={'_blank'}
            className='block absolute z-10 inset-0 text-indent-full'
            href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
          >
            {originalName}
          </Link>
        </div>

        {/*rating*/}
        {showSnippetRating ? (
          <div className='pl-5 pr-5 flex items-center justify-center h-control-button-height mt-auto'>
            <RatingStars size={'small'} rating={4.9} />
          </div>
        ) : null}
      </div>

      <div className='flex flex-col col-span-9 md:col-span-10'>
        {/*art*/}
        {showSnippetArticle ? (
          <div className='text-secondary-text mb-5'>Артикул: {itemId}</div>
        ) : null}

        <div className='grid gap-4 grid-cols-7 flex-grow'>
          <div className='flex flex-col col-span-7 md:col-span-5'>
            {/*original name*/}
            <div className='text-2xl font-medium mb-1'>
              <Link
                testId={`${testId}-name-row`}
                target={'_blank'}
                className='block text-primary-text hover:no-underline hover:text-primary-text'
                href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
              >
                {originalName}
              </Link>
            </div>

            {/*name translation*/}
            {!name || name === LOCALE_NOT_FOUND_FIELD_MESSAGE ? null : (
              <div className='text-secondary-text mb-6'>{name}</div>
            )}

            {/*list features*/}
            <div className='mb-6 space-y-2 md:space-y-2'>
              {(listFeatures || []).map(({ name, _id, readableValue }) => {
                return (
                  <div className='md:grid grid-cols-12 gap-x-4 gap-y-2' key={`${_id}`}>
                    <div className='col-span-5 text-secondary-text'>{name}</div>
                    <div className='col-span-7'>{readableValue}</div>
                  </div>
                );
              })}
            </div>

            {/*rating features*/}
            {(ratingFeatures || []).length > 0 ? (
              <div className='flex flex-wrap items-center min-h-control-button-height'>
                {(ratingFeatures || []).map(({ _id, name, readableValue }) => {
                  return (
                    <div
                      key={`${_id}`}
                      className='text-secondary-text text-sm uppercase whitespace-nowrap mr-3 mt-1 mb-1'
                    >
                      {`${name} ${readableValue}`}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className='flex flex-col col-span-7 md:col-span-2'>
            {/*price*/}
            {isShopless ? null : (
              <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
            )}

            {/*connections*/}
            {(connections || []).length > 0 ? (
              <div className='hidden md:block mt-2 mb-4'>
                {(connections || []).map(({ _id, attribute, connectionProducts }) => {
                  return (
                    <div key={`${_id}`} className='mb-4'>
                      <div className='mr-1 whitespace-nowrap'>{`${attribute?.name}:`}</div>
                      <div>
                        {(connectionProducts || []).map(({ option, productId }, index) => {
                          const isLast = (connectionProducts || []).length - 1 === index;
                          const isCurrent = productId === product._id;

                          if (!option) {
                            return null;
                          }
                          return (
                            <span
                              key={`${option?.name}`}
                              className={`mr-1 ${
                                isCurrent ? 'text-primary-text' : 'text-secondary-text'
                              }`}
                            >
                              {isLast ? option?.name : `${option?.name}, `}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        {/*controls*/}
        <div className='grid gap-4 grid-cols-7 flex-grow items-end'>
          <div
            className={`hidden md:flex flex-col col-span-7 md:col-span-5 ${
              showSnippetButtonsOnHover ? 'lg:opacity-0 group-hover:opacity-100 transition-all' : ''
            }`}
          >
            <div className='flex items-center justify-end'>
              <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
              <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
            </div>
          </div>

          <div className='flex flex-col col-span-7 md:col-span-2'>
            <div className='mt-auto'>
              {/*availability*/}
              <div className='mb-3'>
                {noNaN(shopsCount) > 0
                  ? `В наличии в ${shopsCount} ${shopsCounterPostfix}`
                  : 'Нет в наличии'}
              </div>

              <div
                className={`flex gap-2 ${
                  showSnippetButtonsOnHover
                    ? 'lg:opacity-0 group-hover:opacity-100 transition-all'
                    : ''
                }`}
              >
                <Button
                  className='w-full'
                  disabled={isShopless}
                  theme={'gray'}
                  short
                  testId={`${testId}-add-to-cart-row`}
                  ariaLabel={'Добавить в корзину'}
                  onClick={() => {
                    if (shopProductsIds && shopProductsIds.length < 2) {
                      addProductToCart({
                        amount: 1,
                        productId: product._id,
                        shopProductId: `${shopProductsIds[0]}`,
                      });
                    } else {
                      addShoplessProductToCart({
                        amount: 1,
                        productId: product._id,
                      });
                    }
                  }}
                >
                  В корзину
                </Button>

                <div className='flex md:hidden items-center justify-end'>
                  <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
                  <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnippetRowDefault;