import { noNaN } from 'lib/numbers';
import * as React from 'react';
import Currency from 'components/Currency';
import Percent from 'components/Percent';

interface ProductPricesInterface {
  discountedPercent?: number | null;
  price?: string | number | null;
  oldPrice?: string | null;
  className?: string;
  size?: 'small' | 'normal' | 'big';
}

const ProductShopPrices: React.FC<ProductPricesInterface> = ({
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
};

export default ProductShopPrices;
