import ControlButton from 'components/ControlButton';
import Link from 'components/Link/Link';
import { ROUTE_CATALOGUE } from 'config/common';
import { useSiteContext } from 'context/siteContext';
import { ProductSnippetInterface } from 'db/uiInterfaces';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';
import Image from 'next/image';
import * as React from 'react';

const ProductSnippetGridBigImage: React.FC<ProductSnippetInterface> = ({
  product,
  testId,
  className,
  showSnippetBackground = true,
  showSnippetButtonsOnHover = false,
  showSnippetArticle,
  gridCatalogueColumns = 3,
}) => {
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const {
    slug,
    cardPrices,
    _id,
    shopsCount,
    mainImage,
    rubricSlug,
    itemId,
    shopProductsIds,
    snippetTitle,
  } = product;

  const bgClassName = showSnippetBackground
    ? showSnippetButtonsOnHover
      ? 'transition-all bg-secondary lg:bg-transparent lg:hover:bg-secondary lg:hover:shadow-md'
      : 'bg-secondary dark:shadow-md'
    : 'transition-all hover:shadow-md hover:border-border-200 border-transparent border';

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

  return (
    <div
      className={`group rounded-md relative text-center flex flex-grow flex-col grid-snippet ${bgClassName} ${
        className ? className : columnsClassName
      }`}
    >
      <div
        className={`rounded-md h-full flex flex-col ${
          showSnippetBackground && showSnippetButtonsOnHover
            ? 'lg:group-hover:bg-none lg:group-hover:shadow-none lg:bg-secondary lg:dark:shadow-md'
            : 'group-hover:border-transparent border-border-200 border'
        }`}
      >
        <div className='px-4 pt-6'>
          <div className='relative flex justify-center dark:snippet-image mb-4'>
            <Image
              priority={true}
              src={mainImage}
              objectFit={'contain'}
              objectPosition={'center'}
              alt={`${snippetTitle}`}
              title={`${snippetTitle}`}
              width={240}
              height={240}
              quality={50}
            />
            <Link
              testId={`${testId}-image-grid`}
              target={'_blank'}
              className='block absolute z-10 inset-0 text-indent-full'
              href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
            >
              {snippetTitle}
            </Link>
          </div>

          {/*original name*/}
          <div className='text-lg mb-1'>
            <Link
              testId={`${testId}-name-grid`}
              target={'_blank'}
              className='block text-primary-text hover:no-underline hover:text-primary-text'
              href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
            >
              {snippetTitle}
            </Link>
          </div>

          {/*art*/}
          {showSnippetArticle ? (
            <div className='text-secondary-text mb-5'>Артикул: {itemId}</div>
          ) : null}
        </div>

        {/*price*/}
        <div className='flex justify-center mb-2 px-4 mt-auto'>
          <ProductSnippetPrice size={'medium'} shopsCount={shopsCount} value={cardPrices?.min} />
        </div>
      </div>

      {/*controls*/}
      <div
        className={`flex items-center justify-between ${
          showSnippetButtonsOnHover ? 'lg:opacity-0 group-hover:opacity-100 transition-all' : ''
        }`}
      >
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
                productId: _id,
                shopProductId: `${shopProductsIds[0]}`,
              });
            } else {
              addShoplessProductToCart({
                amount: 1,
                productId: _id,
              });
            }
          }}
        />
        <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
        <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
      </div>
    </div>
  );
};

export default ProductSnippetGridBigImage;
