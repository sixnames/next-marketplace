import { useSiteContext } from 'context/siteContext';
import { ProductInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Image from 'next/image';
import Link from '../../Link/Link';
import RatingStars from '../../RatingStars/RatingStars';
import ControlButton from '../../Buttons/ControlButton';
import ProductSnippetPrice from '../ProductSnippetPrice/ProductSnippetPrice';
import LayoutCard from 'layout/LayoutCard';

interface ProductSnippetGridInterface {
  product: ProductInterface;
  testId?: string;
  additionalSlug?: string;
  className?: string;
}

const ProductSnippetGrid: React.FC<ProductSnippetGridInterface> = ({
  product,
  testId,
  additionalSlug,
  className,
}) => {
  const { addShoplessProductToCart } = useSiteContext();
  const {
    name,
    originalName,
    slug,
    cardPrices,
    _id,
    listFeatures,
    ratingFeatures,
    shopsCount,
    mainImage,
  } = product;
  const additionalLinkSlug = additionalSlug ? additionalSlug : '';
  const firstRatingFeature = ratingFeatures ? ratingFeatures[0] : null;

  const listFeaturesString = (listFeatures || [])
    .map(({ readableValue }) => {
      return readableValue;
    })
    .join(', ');

  return (
    <LayoutCard
      className={`relative grid grid-cols-12 ${className ? className : ''}`}
      testId={testId}
    >
      <div className='relative flex items-center justify-center mb-4 flex-grow pt-4 pl-5 pr-5 col-span-4 snippet-image'>
        <Image
          priority={true}
          src={mainImage}
          objectFit={'contain'}
          objectPosition={'center'}
          alt={originalName}
          title={originalName}
          width={85}
          height={190}
          quality={50}
        />
        <Link
          target={'_blank'}
          className='block absolute z-10 inset-0 text-indent-full'
          href={`/product${additionalLinkSlug}/${slug}`}
        >
          {originalName}
        </Link>
      </div>

      <div className={`col-span-8 flex flex-col pt-12 pr-5`}>
        <div className='mb-auto pb-4'>
          <div className='text-xl font-medium mb-1'>
            <Link
              target={'_blank'}
              className='block text-primary-text hover:no-underline hover:text-primary-text'
              href={`/product${additionalLinkSlug}/${slug}`}
            >
              {originalName}
            </Link>
          </div>
          <div className='text-sm text-secondary-text mb-3'>{name}</div>
          <div className='text-sm text-secondary-text'>{listFeaturesString}</div>
        </div>
        <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
      </div>

      <div className='col-span-4 flex flex-col'>
        <div className='pl-5 pr-5 flex items-center justify-center h-control-button-height mt-auto'>
          <RatingStars size={'small'} rating={4.9} />
        </div>
      </div>

      <div className='col-span-8 flex flex-col'>
        <div className='flex items-end justify-between h-control-button-height mt-auto'>
          <div className='flex flex-wrap items-center h-control-button-height'>
            {firstRatingFeature ? (
              <div
                key={`${firstRatingFeature.attributeId}`}
                className='text-secondary-text text-sm uppercase whitespace-nowrap mr-3 mt-1 mb-1'
              >
                {`${firstRatingFeature.name} ${firstRatingFeature.readableValue}`}
              </div>
            ) : null}
          </div>

          <div className='flex items-center justify-end'>
            <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
            <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
            <ControlButton
              ariaLabel={'Добавить в корзину'}
              testId={`catalogue-item-${slug}-add-to-cart`}
              onClick={() =>
                addShoplessProductToCart({
                  amount: 1,
                  productId: _id,
                })
              }
              icon={'cart'}
              theme={'accent'}
              roundedTopLeft
            />
          </div>
        </div>
      </div>
    </LayoutCard>
  );
};

export default ProductSnippetGrid;
