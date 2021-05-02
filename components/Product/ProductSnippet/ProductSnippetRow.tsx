import { useSiteContext } from 'context/siteContext';
import { ProductInterface } from 'db/uiInterfaces';
import * as React from 'react';
import LayoutCard from 'layout/LayoutCard';
import RatingStars from '../../RatingStars/RatingStars';
import Image from 'next/image';
import Link from '../../Link/Link';
import ProductSnippetPrice from '../ProductSnippetPrice/ProductSnippetPrice';
import SpinnerInput from '../../FormElements/SpinnerInput/SpinnerInput';
import Button from '../../Buttons/Button';
import ControlButton from '../../Buttons/ControlButton';
import { noNaN } from 'lib/numbers';

interface ProductSnippetRowInterface {
  product: ProductInterface;
  testId?: string;
  className?: string;
}

const ProductSnippetRow: React.FC<ProductSnippetRowInterface> = ({
  product,
  testId,
  className,
}) => {
  const [amount, setAmount] = React.useState<number>(1);
  const { addShoplessProductToCart } = useSiteContext();
  const {
    name,
    originalName,
    slug,
    cardPrices,
    _id,
    itemId,
    listFeatures,
    ratingFeatures,
    connections,
    shopsCount,
    mainImage,
    rubricSlug,
  } = product;
  const shopsCounterPostfix = noNaN(shopsCount) > 1 ? 'винотеках' : 'винотеке';
  const isShopless = noNaN(shopsCount) < 1;

  return (
    <LayoutCard
      className={`relative grid grid-cols-12 pt-6 pb-6 pr-5 ${className ? className : ''}`}
      testId={testId}
    >
      <div className='relative flex flex-col items-center justify-center flex-grow pt-4 pl-5 pr-5 col-span-2 snippet-image'>
        <div className='relative flex-grow pb-5 pt-5'>
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
            href={`/catalogue/${rubricSlug}/product/${slug}`}
          >
            {originalName}
          </Link>
        </div>

        <div className='pl-5 pr-5 flex items-center justify-center h-control-button-height mt-auto'>
          <RatingStars size={'small'} rating={4.9} />
        </div>
      </div>

      <div className='col-span-10 flex flex-col'>
        <div className='text-secondary-text mb-5'>Артикул: {itemId}</div>
        <div className='grid gap-4 grid-cols-7 flex-grow'>
          <div className='flex flex-col col-span-5'>
            <div className='text-2xl font-medium mb-1'>
              <Link
                target={'_blank'}
                className='block text-primary-text hover:no-underline hover:text-primary-text'
                href={`/catalogue/${rubricSlug}/product/${slug}`}
              >
                {originalName}
              </Link>
            </div>
            <div className='text-secondary-text mb-6'>{name}</div>
            <div className='grid mb-6 grid-cols-12 gap-x-4 gap-y-2'>
              {(listFeatures || []).map(({ name, _id, readableValue }) => {
                return (
                  <React.Fragment key={`${_id}`}>
                    <div className='col-span-5 text-secondary-text'>{name}</div>
                    <div className='col-span-7'>{readableValue}</div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className='flex items-center justify-between min-h-control-button-height'>
              <div className='flex flex-wrap items-center min-h-control-button-height'>
                {(ratingFeatures || []).map(({ _id, name, readableValue }) => {
                  return (
                    <div
                      key={`${_id}`}
                      className='text-secondary-text text-sm uppercase whitespace-nowrap mr-3 mt-1 mb-1'
                    >
                      {`${name} ${readableValue}`}
                    </div>
                  );
                })}
              </div>

              <div className='flex items-center justify-end'>
                <ControlButton icon={'compare'} ariaLabel={'Добавить в сравнение'} />
                <ControlButton icon={'heart'} ariaLabel={'Добавить в избранное'} />
              </div>
            </div>
          </div>

          <div className='flex flex-col col-span-2'>
            {isShopless ? null : (
              <ProductSnippetPrice shopsCount={shopsCount} value={cardPrices?.min} />
            )}

            <div className='mt-1 mb-8 text-secondary-text'>
              {(connections || []).map(({ _id, attribute, connectionProducts }) => {
                return (
                  <div key={`${_id}`} className='flex items-center mb-2'>
                    <div className='mr-1 whitespace-nowrap'>{`${attribute?.name}:`}</div>
                    {(connectionProducts || []).map(({ option, _id }, index) => {
                      const isLast = (connectionProducts || []).length - 1 === index;
                      const isCurrent = _id === product._id;

                      return (
                        <span
                          key={`${option?.name}`}
                          className={`mr-1 ${isCurrent ? 'text-primary-text' : ''}`}
                        >
                          {isLast ? option?.name : `${option?.name}, `}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className='mt-auto'>
              <div className='mb-3'>
                {noNaN(shopsCount) > 0
                  ? `В наличии в ${shopsCount} ${shopsCounterPostfix}`
                  : 'Нет в наличии'}
              </div>

              <div className='mb-4'>
                <SpinnerInput
                  isShort
                  plusTestId={`card-shops-${slug}-plus`}
                  minusTestId={`card-shops-${slug}-minus`}
                  testId={`card-shops-${slug}-input`}
                  onChange={(e) => {
                    setAmount(noNaN(e.target.value));
                  }}
                  min={1}
                  name={'amount'}
                  value={amount}
                  disabled={isShopless}
                />
              </div>

              <Button
                className='w-full'
                disabled={isShopless}
                theme={'gray'}
                short
                testId={`card-shops-${slug}-add-to-cart`}
                ariaLabel={'Добавить в корзину'}
                onClick={() => {
                  addShoplessProductToCart({
                    amount,
                    productId: _id,
                  });
                }}
              >
                В корзину
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LayoutCard>
  );
};

export default ProductSnippetRow;
