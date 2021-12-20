import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import WpLink from '../../components/Link/WpLink';
import RatingStars from '../../components/RatingStars';
import WpImage from '../../components/WpImage';
import { useSiteContext } from '../../context/siteContext';
import { ProductSnippetInterface } from '../../db/uiInterfaces';
import { noNaN } from '../../lib/numbers';
import ProductAddToCartButton from './ProductAddToCartButton';
import ProductSnippetAvailability from './ProductSnippetAvailability';
import ProductSnippetEditButton from './ProductSnippetEditButton';
import ProductSnippetPrice from './ProductSnippetPrice';

const ProductSnippetRowBigImage: React.FC<ProductSnippetInterface> = ({
  shopProduct,
  testId,
  className,
  showSnippetBackground = true,
  showSnippetConnections = false,
  showSnippetArticle,
  showSnippetRating,
  imageLoading,
}) => {
  const { urlPrefix } = useSiteContext();
  const { product, available } = shopProduct;
  if (!product) {
    return null;
  }
  const {
    slug,
    cardPrices,
    listFeatures,
    ratingFeatures,
    connections,
    shopsCount,
    mainImage,
    shopProductsIds,
    snippetTitle,
    name,
    itemId,
  } = product;

  const isShopless = noNaN(shopsCount) < 1;

  const bgClassName = showSnippetBackground
    ? 'bg-secondary dark:shadow-md'
    : 'transition-all border-border-200 border hover:shadow-md';

  return (
    <div
      className={`group grid rounded-md relative md:grid-cols-12 py-6 px-5 w-full ${bgClassName} ${
        className ? className : ''
      }`}
    >
      {/*edit button for admin*/}
      <ProductSnippetEditButton product={product} />

      <div className='md:col-span-4'>
        {/*image*/}
        <div className='relative flex-grow p-5'>
          <div className='flex p-3 justify-center'>
            <div className='relative pb-[100%] w-full'>
              <WpImage
                loading={imageLoading}
                url={mainImage}
                alt={`${snippetTitle}`}
                title={`${snippetTitle}`}
                width={100}
                className='absolute inset-0 w-full h-full object-contain'
              />
            </div>
          </div>
          <WpLink
            testId={`${testId}-image-row`}
            target={'_blank'}
            className='block absolute z-10 inset-0 text-indent-full'
            href={`${urlPrefix}/${slug}`}
          >
            {snippetTitle}
          </WpLink>
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

        {/*name*/}
        <div className='mb-3'>
          <WpLink
            testId={`${testId}-name-row`}
            target={'_blank'}
            className='block text-2xl font-medium text-primary-text hover:no-underline hover:text-primary-text'
            href={`${urlPrefix}/${slug}`}
          >
            {snippetTitle}
          </WpLink>
          {name ? <div className='text-secondary-text mt-1'>{name}</div> : null}
        </div>

        {/*list features*/}
        {(listFeatures || []).length > 0 ? (
          <div className='mb-6 space-y-2 md:space-y-2'>
            {(listFeatures || []).map(({ attribute, _id, readableValue }) => {
              if (!attribute) {
                return null;
              }
              return (
                <div className='md:grid grid-cols-12 gap-x-4 gap-y-2' key={`${_id}`}>
                  <div className='col-span-5 text-secondary-text'>{attribute.name}</div>
                  <div className='col-span-7'>{readableValue}</div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/*rating features*/}
        {(ratingFeatures || []).length > 0 ? (
          <div className='flex flex-wrap items-center min-h-control-button-height'>
            {(ratingFeatures || []).map(({ _id, attribute, readableValue }) => {
              if (!attribute) {
                return null;
              }
              return (
                <div
                  key={`${_id}`}
                  className='text-secondary-text text-sm uppercase whitespace-nowrap mr-3 mt-1 mb-1'
                >
                  {`${attribute.name} ${readableValue}`}
                </div>
              );
            })}
          </div>
        ) : null}

        {/*connections*/}
        {(connections || []).length > 0 && showSnippetConnections ? (
          <div className='hidden md:block mt-2 mb-6'>
            {(connections || []).map(({ _id, attribute, connectionProducts }) => {
              return (
                <div key={`${_id}`} className='mb-4'>
                  <div className='mr-1 whitespace-nowrap'>{`${attribute?.name}:`}</div>
                  <div>
                    {(connectionProducts || []).map(({ option, productId }, index) => {
                      const isLast = (connectionProducts || []).length - 1 === index;
                      const isCurrent = productId === shopProduct._id;

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
            <ProductSnippetAvailability available={available} shopsCount={shopsCount} />
          </div>
        )}

        {/*controls*/}
        <div className={`flex gap-2 justify-between`}>
          <ProductAddToCartButton
            available={available}
            disabled={isShopless}
            productId={product._id}
            shopProductsIds={shopProductsIds}
            testId={`${testId}-add-to-cart-row`}
          />

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
