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

const ProductSnippetRowBigImage: React.FC<ProductSnippetInterface> = ({
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
      <div className='md:col-span-4'>
        {/*image*/}
        <div className='relative flex-grow pb-5 pt-5'>
          <div className='flex justify-center'>
            <Image
              priority={true}
              src={mainImage}
              objectFit={'contain'}
              objectPosition={'center'}
              alt={originalName}
              title={originalName}
              width={260}
              height={260}
              quality={50}
            />
          </div>
          <Link
            testId={`${testId}-image-row`}
            target={'_blank'}
            className='block absolute z-10 inset-0 text-indent-full'
            href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
          >
            {originalName}
          </Link>
        </div>
      </div>

      {/*data*/}
      <div className='md:col-span-8 flex flex-col'>
        {showSnippetRating || showSnippetArticle ? (
          <div className='flex items-baseline gap-4 mb-5'>
            {/*rating*/}
            {showSnippetRating ? <RatingStars size={'small'} rating={4.9} /> : null}

            {/*art*/}
            {showSnippetArticle ? (
              <div className='text-secondary-text'>Артикул: {itemId}</div>
            ) : null}
          </div>
        ) : null}

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
        {(listFeatures || []).length > 0 ? (
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
        ) : null}

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

        {/*connections*/}
        {(connections || []).length > 0 ? (
          <div className='hidden md:block mt-2 mb-6'>
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

        {isShopless ? null : (
          <div className='flex flex-wrap gap-4 items-baseline mt-auto mb-3'>
            {/*price*/}
            <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />

            {/*availability*/}
            <div>
              {noNaN(shopsCount) > 0
                ? `В наличии в ${shopsCount} ${shopsCounterPostfix}`
                : 'Нет в наличии'}
            </div>
          </div>
        )}

        {/*controls*/}
        <div
          className={`flex gap-2 justify-between ${
            showSnippetButtonsOnHover ? 'lg:opacity-0 group-hover:opacity-100 transition-all' : ''
          }`}
        >
          <Button
            disabled={isShopless}
            theme={'gray'}
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

          <div className='flex items-center justify-end'>
            <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
            <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnippetRowBigImage;
