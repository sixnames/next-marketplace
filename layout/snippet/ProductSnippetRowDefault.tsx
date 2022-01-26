import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import WpLink from '../../components/Link/WpLink';
import RatingStars from '../../components/RatingStars';
import WpImage from '../../components/WpImage';
import { ProductSnippetInterface } from '../../db/uiInterfaces';
import { noNaN } from '../../lib/numbers';
import ProductAddToCartButton from './ProductAddToCartButton';
import ProductSnippetAvailability from './ProductSnippetAvailability';
import ProductSnippetEditButton from './ProductSnippetEditButton';
import ProductSnippetPrice from './ProductSnippetPrice';

const ProductSnippetRowDefault: React.FC<ProductSnippetInterface> = ({
  shopProduct,
  testId,
  className,
  showSnippetBackground = true,
  showSnippetButtonsOnHover = false,
  showSnippetConnections = false,
  showSnippetArticle,
  showSnippetRating,
  imageLoading,
}) => {
  const { summary, available } = shopProduct;
  if (!summary) {
    return null;
  }
  const {
    slug,
    minPrice,
    itemId,
    listAttributes,
    ratingAttributes,
    variants,
    shopsCount,
    mainImage,
    shopProductIds,
    snippetTitle,
    name,
  } = summary;

  const isShopless = noNaN(shopsCount) < 1;

  const bgClassName = showSnippetBackground
    ? 'bg-secondary dark:shadow-md'
    : 'transition-all border-border-200 border hover:shadow-md';

  return (
    <div
      className={`group relative grid w-full rounded-md py-6 px-5 md:grid-cols-12 ${bgClassName} ${
        className ? className : ''
      }`}
    >
      {/*edit button for admin*/}
      <ProductSnippetEditButton product={summary} />

      <div className='dark:snippet-image relative col-span-3 flex flex-grow flex-col items-center justify-center pt-4 pl-5 pr-5 md:col-span-2'>
        {/*image*/}
        <div className='relative flex-grow pb-5 pt-5'>
          <WpImage
            loading={imageLoading}
            url={mainImage}
            alt={`${snippetTitle}`}
            title={`${snippetTitle}`}
            width={100}
            className='h-full w-full object-contain'
          />
          <WpLink
            testId={`${testId}-image-row`}
            target={'_blank'}
            className='text-indent-full absolute inset-0 z-10 block'
            href={`/${slug}`}
          >
            {snippetTitle}
          </WpLink>
        </div>

        {/*rating*/}
        {showSnippetRating ? (
          <div className='mt-auto flex h-control-button-height items-center justify-center pl-5 pr-5'>
            <RatingStars size={'small'} rating={4.9} />
          </div>
        ) : null}
      </div>

      <div className='col-span-9 flex flex-col md:col-span-10'>
        {/*art*/}
        {showSnippetArticle ? (
          <div className='mb-5 text-secondary-text'>Артикул: {itemId}</div>
        ) : null}

        <div className='grid flex-grow grid-cols-7 gap-4'>
          <div className='col-span-7 flex flex-col md:col-span-5'>
            {/*name*/}
            <div className='mb-3'>
              <WpLink
                testId={`${testId}-name-row`}
                target={'_blank'}
                className='block text-2xl font-medium text-primary-text hover:text-primary-text hover:no-underline'
                href={`/${slug}`}
              >
                {snippetTitle}
              </WpLink>

              {name ? <div className='mt-1 text-secondary-text'>{name}</div> : null}
            </div>

            {/*list features*/}
            <div className='mb-6 space-y-2 md:space-y-2'>
              {(listAttributes || []).map(({ attribute, _id, readableValue }) => {
                if (!attribute) {
                  return null;
                }
                return (
                  <div className='grid-cols-12 gap-x-4 gap-y-2 md:grid' key={`${_id}`}>
                    <div className='col-span-5 text-secondary-text'>{attribute.name}</div>
                    <div className='col-span-7'>{readableValue}</div>
                  </div>
                );
              })}
            </div>

            {/*rating features*/}
            {(ratingAttributes || []).length > 0 ? (
              <div className='min-h-control-button-height flex flex-wrap items-center'>
                {(ratingAttributes || []).map(({ _id, attribute, readableValue }) => {
                  if (!attribute) {
                    return null;
                  }
                  return (
                    <div
                      key={`${_id}`}
                      className='mr-3 mt-1 mb-1 whitespace-nowrap text-sm uppercase text-secondary-text'
                    >
                      {`${attribute.name} ${readableValue}`}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className='col-span-7 flex flex-col md:col-span-2'>
            {/*price*/}
            {isShopless ? null : <ProductSnippetPrice shopsCount={shopsCount} value={minPrice} />}

            {/*connections*/}
            {(variants || []).length > 0 && showSnippetConnections ? (
              <div className='mt-2 mb-4 hidden md:block'>
                {(variants || []).map(({ _id, attribute, products }) => {
                  return (
                    <div key={`${_id}`} className='mb-4'>
                      <div className='mr-1 whitespace-nowrap'>{`${attribute?.name}:`}</div>
                      <div>
                        {(products || []).map(({ option, productId }, index) => {
                          const isLast = (products || []).length - 1 === index;
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
          </div>
        </div>

        {/*controls*/}
        <div className='grid flex-grow grid-cols-7 items-end gap-4'>
          <div
            className={`col-span-7 hidden flex-col md:col-span-5 md:flex ${
              showSnippetButtonsOnHover ? 'transition-all group-hover:opacity-100 lg:opacity-0' : ''
            }`}
          >
            <div className='flex items-center justify-end'>
              <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
              <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
            </div>
          </div>

          <div className='col-span-7 flex flex-col md:col-span-2'>
            <div className='mt-auto'>
              {/*availability*/}
              <ProductSnippetAvailability
                available={available}
                shopsCount={shopsCount}
                className='mb-3'
              />

              <div
                className={`flex gap-2 ${
                  showSnippetButtonsOnHover
                    ? 'transition-all group-hover:opacity-100 lg:opacity-0'
                    : ''
                }`}
              >
                <ProductAddToCartButton
                  available={available}
                  disabled={isShopless}
                  productId={summary._id}
                  shopProductIds={shopProductIds}
                  testId={`${testId}-add-to-cart-row`}
                />

                <div className='flex items-center justify-end md:hidden'>
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
