import * as React from 'react';
import { noNaN } from '../lib/numbers';
import Currency from './Currency';
import Percent from './Percent';

interface ProductPricesInterface {
  showDiscountedPrice?: boolean;
  discountedPercent?: number | null;
  price?: string | number | null;
  oldPrice?: string | number | null;
  className?: string;
  size?: 'small' | 'normal' | 'big';
}

const ProductShopPrices: React.FC<ProductPricesInterface> = ({
  showDiscountedPrice,
  discountedPercent,
  oldPrice,
  price,
  className,
  size = 'normal',
}) => {
  const withDiscount = discountedPercent && noNaN(oldPrice) > noNaN(price);
  const priseSizeClassName =
    size === 'big' ? 'text-[2rem]' : size === 'small' ? 'text-2xl' : 'text-[1.75rem]';
  const oldPriseSizeClassName =
    size === 'big' ? 'text-[1.5rem]' : size === 'small' ? 'text-[1rem]' : 'text-[1.35rem]';

  if (showDiscountedPrice) {
    return (
      <div className={`flex gap-4 whitespace-nowrap items-baseline ${className ? className : ''}`}>
        <div>
          <Currency
            valueClassName={`${priseSizeClassName} ${withDiscount ? 'text-theme' : ''} font-medium`}
            value={price}
          />
        </div>

        {withDiscount ? (
          <div>
            <Currency valueClassName={`${oldPriseSizeClassName} line-through`} value={oldPrice} />
          </div>
        ) : null}

        {withDiscount ? (
          <div className='text-theme'>
            <Percent isNegative value={discountedPercent} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex gap-4 whitespace-nowrap items-baseline ${className ? className : ''}`}>
      <Currency valueClassName={`${priseSizeClassName} font-medium`} value={price} />
    </div>
  );
};

export default ProductShopPrices;
