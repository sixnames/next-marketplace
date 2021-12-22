import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import WpLink from '../../components/Link/WpLink';
import WpImage from '../../components/WpImage';
import { useSiteContext } from '../../context/siteContext';
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
  const { urlPrefix } = useSiteContext();
  const { summary, available } = shopProduct;

  if (!summary) {
    return null;
  }

  const { slug, minPrice, shopsCount, mainImage, shopProductsIds, snippetTitle, name, itemId } =
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
      className={`relative z-10 hover:z-20 group rounded-md relative text-center flex flex-grow flex-col grid-snippet ${mainFrameClassName} ${
        className ? className : columnsClassName
      }`}
    >
      {/*edit button for admin*/}
      <ProductSnippetEditButton product={summary} />

      <div className={`rounded-md h-full flex flex-col ${secondaryFrameClassName}`}>
        <div className='px-4 pt-6'>
          <div className='relative flex justify-center dark:snippet-image mb-4'>
            <div className='relative pb-[90%] w-[90%]'>
              <WpImage
                loading={imageLoading}
                url={mainImage}
                alt={`${snippetTitle}`}
                title={`${snippetTitle}`}
                width={240}
                className='absolute inset-0 w-full h-full object-contain'
              />
            </div>
            <WpLink
              testId={`${testId}-image-grid`}
              target={'_blank'}
              className='block absolute z-10 inset-0 text-indent-full'
              href={`${urlPrefix}/${slug}`}
            >
              {snippetTitle}
            </WpLink>
          </div>

          {/*name*/}
          <div className='mb-2'>
            <WpLink
              testId={`${testId}-name-grid`}
              target={'_blank'}
              className='text-lg block text-primary-text hover:no-underline hover:text-primary-text'
              href={`${urlPrefix}/${slug}`}
            >
              {snippetTitle}
            </WpLink>
            {name ? <div className='text-secondary-text mt-1'>{name}</div> : null}
          </div>
        </div>

        {/*price*/}
        <div className='flex flex-col items-center justify-center px-4 mb-2 mt-auto'>
          <ProductSnippetPrice size={'medium'} shopsCount={shopsCount} value={minPrice} />
        </div>
      </div>

      {/*controls*/}
      <div
        className={
          showSnippetButtonsOnHover
            ? `lg:absolute lg:top-[calc(100%-2px)] w-full left-0 lg:h-0 lg:overflow-hidden group-hover:h-auto lg:opacity-0 group-hover:opacity-100 transition-all rounded-bl-md rounded-br-md group-hover:shadow-md ${
                showSnippetBackground
                  ? 'bg-secondary'
                  : 'bg-primary lg:border-l lg:border-r lg:border-b lg:border-border-200'
              }`
            : ''
        }
      >
        {/*art*/}
        {showSnippetArticle ? (
          <div className='text-secondary-text mb-2 text-center text-sm'>Артикул: {itemId}</div>
        ) : null}

        <div className='flex flex-wrap items-center justify-between gap-y-2 pl-4 py-2'>
          <ProductAddToCartButton
            className='w-full'
            frameClassName={'w-auto'}
            productId={summary._id}
            shopProductsIds={shopProductsIds}
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
