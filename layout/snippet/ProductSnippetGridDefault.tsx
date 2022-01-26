import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import WpLink from '../../components/Link/WpLink';
import RatingStars from '../../components/RatingStars';
import WpImage from '../../components/WpImage';
import { ProductSnippetInterface } from '../../db/uiInterfaces';
import ProductAddToCartButton from './ProductAddToCartButton';
import ProductSnippetEditButton from './ProductSnippetEditButton';
import ProductSnippetPrice from './ProductSnippetPrice';

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
  const { summary, available } = shopProduct;
  if (!summary) {
    return null;
  }
  const {
    snippetTitle,
    slug,
    minPrice,
    listAttributes,
    shopsCount,
    mainImage,
    shopProductIds,
    itemId,
    name,
  } = summary;

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
      className={`group grid-snippet relative flex flex-col gap-4 rounded-md ${mainFrameClassName} ${
        className ? className : columnsClassName
      }`}
    >
      {/*edit button for admin*/}
      <ProductSnippetEditButton product={summary} />

      <div className='flex-grow grid-cols-12 px-4 md:grid md:px-0'>
        {/*image*/}
        <div className='dark:snippet-image relative col-span-3 flex flex-grow items-center justify-center pt-4 pl-4 pr-4'>
          <WpImage
            loading={imageLoading}
            url={mainImage}
            alt={`${snippetTitle}`}
            title={`${snippetTitle}`}
            width={85}
            className='h-full w-full object-contain'
          />
          <WpLink
            testId={`${testId}-image-grid`}
            target={'_blank'}
            className='text-indent-full absolute inset-0 z-10 block'
            href={`/${slug}`}
          >
            {snippetTitle}
          </WpLink>
        </div>

        <div className='col-span-9 flex min-h-[235px] flex-col gap-4 pt-12 pr-5'>
          <div className='mb-auto'>
            {/*name*/}
            <div className='mb-3'>
              <WpLink
                testId={`${testId}-name-grid`}
                target={'_blank'}
                className='block text-lg font-medium text-primary-text hover:text-primary-text hover:no-underline sm:text-xl'
                href={`/${slug}`}
              >
                {snippetTitle}
              </WpLink>
              {name ? <div className='mt-1 text-secondary-text'>{name}</div> : null}
            </div>

            {/*art*/}
            {showSnippetArticle ? (
              <div className='mb-5 text-secondary-text'>Артикул: {itemId}</div>
            ) : null}

            {/*list features*/}
            {noAttributes ? null : (
              <div className='text-sm text-secondary-text'>
                {(listAttributes || []).map(({ readableValue }, index) => {
                  if (!readableValue) {
                    return null;
                  }

                  const isLast = index === (listAttributes || []).length - 1;
                  return (
                    <span className='mr-1 inline-block' key={`${readableValue}-${index}`}>
                      {isLast ? readableValue : `${readableValue},`}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/*price*/}
          <ProductSnippetPrice shopsCount={shopsCount} value={minPrice} />
        </div>
      </div>

      <div className='grid-cols-12 px-4 md:grid md:px-0'>
        {/*rating*/}
        <div className='col-span-3 flex flex-col md:h-control-button-height'>
          {showSnippetRating ? (
            <div className='flex h-control-button-height items-center justify-center'>
              <RatingStars size={'small'} rating={4.9} />
            </div>
          ) : null}
        </div>

        {/*controls*/}
        <div className='col-span-9 flex flex-col'>
          <div
            className={`flex items-center justify-between pb-2  ${
              showSnippetButtonsOnHover ? 'transition-all group-hover:opacity-100 lg:opacity-0' : ''
            }`}
          >
            <ProductAddToCartButton
              available={available}
              className='w-full'
              frameClassName={'w-[50%]'}
              productId={summary._id}
              shopProductIds={shopProductIds}
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
