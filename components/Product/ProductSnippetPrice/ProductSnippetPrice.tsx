import * as React from 'react';
import Currency from '../../Currency/Currency';

interface ProductSnippetPriceInterface {
  value?: string | number | null;
  className?: string;
  shopsCount?: number;
}

const ProductSnippetPrice: React.FC<ProductSnippetPriceInterface> = ({
  value,
  className,
  shopsCount,
}) => {
  const minimalShopsCount = 1;

  if (!shopsCount || shopsCount < minimalShopsCount) {
    return (
      <div className={`text-secondary-text text-sm ${className ? className : ''}`}>
        Нет в наличии
      </div>
    );
  }

  return (
    <div className={`flex items-baseline text-2xl sm:text-3xl ${className ? className : ''}`}>
      <span className='text-secondary-text text-[0.5em] mr-[0.35rem]'>
        {shopsCount === minimalShopsCount ? 'Цена ' : 'Цена от '}
      </span>
      <Currency value={value} />
    </div>
  );
};

export default ProductSnippetPrice;
