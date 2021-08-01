import ControlButton from 'components/ControlButton';
import Link from 'components/Link/Link';
import { LOCALE_NOT_FOUND_FIELD_MESSAGE, ROUTE_CATALOGUE } from 'config/common';
import { useSiteContext } from 'context/siteContext';
import { ProductSnippetInterface } from 'db/uiInterfaces';
import LayoutCard from 'layout/LayoutCard';
import ProductSnippetPrice from 'layout/snippet/ProductSnippetPrice';
import Image from 'next/image';
import * as React from 'react';

const ProductSnippetGridBigImage: React.FC<ProductSnippetInterface> = ({
  product,
  testId,
  className,
  noSecondaryName,
}) => {
  const { addShoplessProductToCart, addProductToCart } = useSiteContext();
  const {
    name,
    originalName,
    slug,
    cardPrices,
    _id,
    shopsCount,
    mainImage,
    rubricSlug,
    itemId,
    shopProductsIds,
  } = product;

  return (
    <LayoutCard
      className={`relative text-center ${
        className ? className : 'col-span-12 sm:col-span-6 md:col-span-4'
      }`}
    >
      <div className='px-4 pt-6'>
        <div className='relative flex justify-center snippet-image mb-4'>
          <Image
            priority={true}
            src={mainImage}
            objectFit={'contain'}
            objectPosition={'center'}
            alt={originalName}
            title={originalName}
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
            {originalName}
          </Link>
        </div>

        {/*original name*/}
        <div className='text-lg sm:text-xl font-medium mb-1'>
          <Link
            testId={`${testId}-name-grid`}
            target={'_blank'}
            className='block text-primary-text hover:no-underline hover:text-primary-text'
            href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${slug}`}
          >
            {originalName}
          </Link>
        </div>

        {/*name translation*/}
        {noSecondaryName || !name || name === LOCALE_NOT_FOUND_FIELD_MESSAGE ? null : (
          <div className='text-sm text-secondary-text mb-3'>{name}</div>
        )}

        {/*art*/}
        <div className='text-secondary-text mb-5'>Артикул: {itemId}</div>

        {/*price*/}
        <div className='flex justify-center mb-2'>
          <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
        </div>
      </div>

      {/*controls*/}
      <div className='flex items-center justify-between mt-auto'>
        <ControlButton
          icon={'cart'}
          theme={'accent'}
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
    </LayoutCard>
  );
};

export default ProductSnippetGridBigImage;
