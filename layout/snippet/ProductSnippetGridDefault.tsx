import WpImage from 'components/WpImage';
import { useSiteContext } from 'context/siteContext';
import { ProductSnippetInterface } from 'db/uiInterfaces';
import ProductAddToCartButton from 'layout/snippet/ProductAddToCartButton';
import ProductSnippetEditButton from 'layout/snippet/ProductSnippetEditButton';
import * as React from 'react';
import WpLink from 'components/Link/WpLink';
import RatingStars from 'components/RatingStars';
import ControlButton from 'components/button/ControlButton';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';

const ProductSnippetGridDefault: React.FC<ProductSnippetInterface> = ({
  shopProduct,
  testId,
  className,
  noAttributes,
  showSnippetBackground = true,
  showSnippetButtonsOnHover = false,
  showSnippetArticle,
  showSnippetRating,
  gridCatalogueColumns,
  imageLoading,
}) => {
  const { urlPrefix } = useSiteContext();
  const { product, available } = shopProduct;
  if (!product) {
    return null;
  }
  const {
    snippetTitle,
    slug,
    cardPrices,
    listFeatures,
    shopsCount,
    mainImage,
    shopProductsIds,
    itemId,
    name,
  } = product;

  const mainFrameClassName = showSnippetBackground
    ? 'bg-secondary dark:shadow-md'
    : 'transition-all border-border-200 border hover:shadow-md';

  const columnsClassName =
    // 2
    gridCatalogueColumns === 2
      ? 'grid-snippet-2'
      : // 3
      gridCatalogueColumns === 3
      ? 'grid-snippet-3'
      : // 4
      gridCatalogueColumns === 4
      ? 'grid-snippet-4'
      : // 5
      gridCatalogueColumns === 5
      ? 'grid-snippet-5'
      : // 1
        ``;

  return (
    <div
      className={`group rounded-md flex flex-col relative gap-4 grid-snippet ${mainFrameClassName} ${
        className ? className : columnsClassName
      }`}
    >
      {/*edit button for admin*/}
      <ProductSnippetEditButton product={product} />

      <div className='md:grid px-4 md:px-0 grid-cols-12 flex-grow'>
        {/*image*/}
        <div className='relative flex items-center justify-center flex-grow pt-4 pl-4 pr-4 col-span-3 dark:snippet-image'>
          <WpImage
            loading={imageLoading}
            url={mainImage}
            alt={`${snippetTitle}`}
            title={`${snippetTitle}`}
            width={85}
            className='w-full h-full object-contain'
          />
          <WpLink
            testId={`${testId}-image-grid`}
            target={'_blank'}
            className='block absolute z-10 inset-0 text-indent-full'
            href={`${urlPrefix}/${slug}`}
          >
            {snippetTitle}
          </WpLink>
        </div>

        <div className='col-span-9 flex flex-col pt-12 pr-5 gap-4 min-h-[235px]'>
          <div className='mb-auto'>
            {/*name*/}
            <div className='mb-3'>
              <WpLink
                testId={`${testId}-name-grid`}
                target={'_blank'}
                className='text-lg sm:text-xl font-medium block text-primary-text hover:no-underline hover:text-primary-text'
                href={`${urlPrefix}/${slug}`}
              >
                {snippetTitle}
              </WpLink>
              {name ? <div className='text-secondary-text mt-1'>{name}</div> : null}
            </div>

            {/*art*/}
            {showSnippetArticle ? (
              <div className='text-secondary-text mb-5'>Артикул: {itemId}</div>
            ) : null}

            {/*list features*/}
            {noAttributes ? null : (
              <div className='text-sm text-secondary-text'>
                {(listFeatures || []).map(({ readableValue }, index) => {
                  if (!readableValue) {
                    return null;
                  }

                  const isLast = index === (listFeatures || []).length - 1;
                  return (
                    <span className='inline-block mr-1' key={`${readableValue}-${index}`}>
                      {isLast ? readableValue : `${readableValue},`}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/*price*/}
          <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
        </div>
      </div>

      <div className='md:grid px-4 md:px-0 grid-cols-12'>
        {/*rating*/}
        <div className='col-span-3 flex flex-col md:h-control-button-height'>
          {showSnippetRating ? (
            <div className='flex items-center justify-center h-control-button-height'>
              <RatingStars size={'small'} rating={4.9} />
            </div>
          ) : null}
        </div>

        {/*controls*/}
        <div className='col-span-9 flex flex-col'>
          <div
            className={`flex items-center justify-between pb-2  ${
              showSnippetButtonsOnHover ? 'lg:opacity-0 group-hover:opacity-100 transition-all' : ''
            }`}
          >
            <ProductAddToCartButton
              available={available}
              className='w-full'
              frameClassName={'w-[50%]'}
              productId={product._id}
              shopProductsIds={shopProductsIds}
              testId={`${testId}-add-to-cart-grid`}
              size={'small'}
              short
            />
            <div className='flex items-center'>
              <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
              <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnippetGridDefault;
