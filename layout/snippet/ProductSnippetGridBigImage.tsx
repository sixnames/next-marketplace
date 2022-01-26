import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import WpLink from '../../components/Link/WpLink';
import WpImage from '../../components/WpImage';
import { ProductSnippetInterface } from '../../db/uiInterfaces';
import ProductAddToCartButton from './ProductAddToCartButton';
import ProductSnippetEditButton from './ProductSnippetEditButton';
import ProductSnippetPrice from './ProductSnippetPrice';

const ProductSnippetGridBigImage: React.FC<ProductSnippetInterface> = ({
  shopProduct,
  testId,
  className,
  showSnippetBackground = true,
  showSnippetButtonsOnHover = false,
  showSnippetArticle,
  gridCatalogueColumns = 3,
  imageLoading,
}) => {
  const { summary, available } = shopProduct;

  if (!summary) {
    return null;
  }

  const { slug, minPrice, shopsCount, mainImage, shopProductIds, snippetTitle, name, itemId } =
    summary;

  let mainFrameClassName = '';
  if (showSnippetBackground && showSnippetButtonsOnHover) {
    mainFrameClassName = '';
  }
  if (!showSnippetBackground && showSnippetButtonsOnHover) {
    mainFrameClassName = 'transition-all bg-secondary lg:bg-transparent lg:hover:shadow-md';
  }
  //lg:hover:bg-secondary
  if (showSnippetBackground && !showSnippetButtonsOnHover) {
    mainFrameClassName = 'bg-secondary dark:shadow-md';
  }

  if (!showSnippetBackground && !showSnippetButtonsOnHover) {
    mainFrameClassName = 'border border-border-200 dark:shadow-md';
  }

  const columnsClassName =
    // 2
    gridCatalogueColumns === 2
      ? 'grid-snippet-2 flex-grow-0'
      : // 3
      gridCatalogueColumns === 3
      ? 'grid-snippet-3 flex-grow-0'
      : // 4
      gridCatalogueColumns === 4
      ? 'grid-snippet-4 flex-grow-0'
      : // 5
      gridCatalogueColumns === 5
      ? 'grid-snippet-5 flex-grow-0'
      : // 1
        ``;

  let secondaryFrameClassName = '';
  if (showSnippetBackground && showSnippetButtonsOnHover) {
    secondaryFrameClassName =
      'lg:group-hover:bg-none lg:group-hover:shadow-none lg:bg-secondary lg:dark:shadow-md';
  }
  if (!showSnippetBackground && showSnippetButtonsOnHover) {
    secondaryFrameClassName = 'lg:border lg:border-border-200';
  }
  if (showSnippetBackground && !showSnippetButtonsOnHover) {
    secondaryFrameClassName = '';
  }
  if (!showSnippetBackground && !showSnippetButtonsOnHover) {
    secondaryFrameClassName = '';
  }

  return (
    <div
      className={`group grid-snippet relative relative z-10 flex flex-grow flex-col rounded-md text-center hover:z-20 ${mainFrameClassName} ${
        className ? className : columnsClassName
      }`}
    >
      {/*edit button for admin*/}
      <ProductSnippetEditButton product={summary} />

      <div className={`flex h-full flex-col rounded-md ${secondaryFrameClassName}`}>
        <div className='px-4 pt-6'>
          <div className='dark:snippet-image relative mb-4 flex justify-center'>
            <div className='relative w-[90%] pb-[90%]'>
              <WpImage
                loading={imageLoading}
                url={mainImage}
                alt={`${snippetTitle}`}
                title={`${snippetTitle}`}
                width={240}
                className='absolute inset-0 h-full w-full object-contain'
              />
            </div>
            <WpLink
              testId={`${testId}-image-grid`}
              target={'_blank'}
              className='text-indent-full absolute inset-0 z-10 block'
              href={`/${slug}`}
            >
              {snippetTitle}
            </WpLink>
          </div>

          {/*name*/}
          <div className='mb-2'>
            <WpLink
              testId={`${testId}-name-grid`}
              target={'_blank'}
              className='block text-lg text-primary-text hover:text-primary-text hover:no-underline'
              href={`/${slug}`}
            >
              {snippetTitle}
            </WpLink>
            {name ? <div className='mt-1 text-secondary-text'>{name}</div> : null}
          </div>
        </div>

        {/*price*/}
        <div className='mb-2 mt-auto flex flex-col items-center justify-center px-4'>
          <ProductSnippetPrice size={'medium'} shopsCount={shopsCount} value={minPrice} />
        </div>
      </div>

      {/*controls*/}
      <div
        className={
          showSnippetButtonsOnHover
            ? `left-0 w-full rounded-bl-md rounded-br-md transition-all group-hover:h-auto group-hover:opacity-100 group-hover:shadow-md lg:absolute lg:top-[calc(100%-2px)] lg:h-0 lg:overflow-hidden lg:opacity-0 ${
                showSnippetBackground
                  ? 'bg-secondary'
                  : 'bg-primary lg:border-l lg:border-r lg:border-b lg:border-border-200'
              }`
            : ''
        }
      >
        {/*art*/}
        {showSnippetArticle ? (
          <div className='mb-2 text-center text-sm text-secondary-text'>Артикул: {itemId}</div>
        ) : null}

        <div className='flex flex-wrap items-center justify-between gap-y-2 py-2 pl-4'>
          <ProductAddToCartButton
            className='w-full'
            frameClassName={'w-auto'}
            productId={summary._id}
            shopProductIds={shopProductIds}
            testId={`${testId}-add-to-cart-grid`}
            size={'small'}
            available={available}
            short
          />
          <div className='flex items-center'>
            <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
            <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnippetGridBigImage;
