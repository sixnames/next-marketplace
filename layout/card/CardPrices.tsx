import Currency from 'components/Currency';
import { ProductCardPricesModel } from 'db/dbModels';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

interface CardPricesInterface {
  shopsCount?: number | null;
  cardPrices: ProductCardPricesModel | undefined;
}

const CardPrices: React.FC<CardPricesInterface> = ({ cardPrices, shopsCount }) => {
  const isShopless = noNaN(shopsCount) < 1;
  const isMultiplePrice =
    noNaN(cardPrices?.min) !== noNaN(cardPrices?.max) && noNaN(shopsCount) > 1;

  if (isShopless) {
    return null;
  }

  return (
    <div className='sm:inline-flex items-baseline'>
      {isMultiplePrice ? (
        <React.Fragment>
          <div className='mr-2'>Цена от</div>
          <div className='flex items-baseline text-2xl sm:text-3xl md:text-4xl'>
            <Currency value={cardPrices?.min} />
            <div className='text-lg mx-2'>до</div>
            <Currency value={cardPrices?.max} />
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className='mr-2'>Цена</div>
          <div className='flex items-baseline text-2xl sm:text-3xl md:text-4xl'>
            <Currency value={cardPrices?.min} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default CardPrices;
