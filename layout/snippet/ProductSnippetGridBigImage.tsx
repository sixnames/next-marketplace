import ControlButton from 'components/button/ControlButton';
import Link from 'components/Link/Link';
import WpImage from 'components/WpImage';
import { useSiteContext } from 'context/siteContext';
import { ProductSnippetInterface } from 'db/uiInterfaces';
import ProductSnippetEditButton from 'layout/snippet/ProductSnippetEditButton';
import ProductSnippetInCartIcon from 'layout/snippet/ProductSnippetInCartIcon';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';
import * as React from 'react';

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
  const { addShoplessProductToCart, addProductToCart, urlPrefix } = useSiteContext();
  const { product } = shopProduct;

  if (!product) {
    return null;
  }

  const { slug, cardPrices, shopsCount, mainImage, shopProductsIds, snippetTitle, name, itemId } =
    product;

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
      <ProductSnippetEditButton product={product} />

      {/*in cart indicator*/}
      <ProductSnippetInCartIcon productId={product._id} shopProductId={shopProduct._id} />

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
            <Link
              testId={`${testId}-image-grid`}
              target={'_blank'}
              className='block absolute z-10 inset-0 text-indent-full'
              href={`${urlPrefix}/${slug}`}
            >
              {snippetTitle}
            </Link>
          </div>

          {/*name*/}
          <div className='mb-4'>
            <Link
              testId={`${testId}-name-grid`}
              target={'_blank'}
              className='text-lg block text-primary-text hover:no-underline hover:text-primary-text'
              href={`${urlPrefix}/${slug}`}
            >
              {snippetTitle}
            </Link>
            {name ? <div className='text-secondary-text mt-1'>{name}</div> : null}
          </div>
        </div>

        {/*price*/}
        <div className='flex flex-col items-center justify-center px-4 mb-4 mt-auto'>
          <ProductSnippetPrice size={'medium'} shopsCount={shopsCount} value={cardPrices?.min} />
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

        <div className='flex items-center justify-between'>
          <ControlButton
            icon={'cart'}
            theme={showSnippetBackground ? 'accent' : undefined}
            roundedTopRight
            ariaLabel={'Добавить в корзину'}
            testId={`${testId}-add-to-cart-grid`}
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
          />
          <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
          <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
        </div>
      </div>
    </div>
  );
};

export default ProductSnippetGridBigImage;
