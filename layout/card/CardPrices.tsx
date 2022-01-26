import * as React from 'react';
import Currency from '../../components/Currency';
import { PricesInterface } from '../../db/uiInterfaces';
import { noNaN } from '../../lib/numbers';

interface CardPricesInterface extends PricesInterface {
  shopsCount?: number | null;
}

const CardPrices: React.FC<CardPricesInterface> = ({ minPrice, maxPrice, shopsCount }) => {
  const isShopless = noNaN(shopsCount) < 1;
  const isMultiplePrice = noNaN(minPrice) !== noNaN(maxPrice) && noNaN(shopsCount) > 1;

  if (isShopless) {
    return null;
  }

  return (
    <div className='items-baseline sm:inline-flex'>
      {isMultiplePrice ? (
        <React.Fragment>
          <div className='mr-2'>Цена от</div>
          <div className='flex items-baseline text-2xl sm:text-3xl md:text-4xl'>
            <Currency value={minPrice} />
            <div className='mx-2 text-lg'>до</div>
            <Currency value={maxPrice} />
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className='mr-2'>Цена</div>
          <div className='flex items-baseline text-2xl sm:text-3xl md:text-4xl'>
            <Currency value={minPrice} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default CardPrices;
