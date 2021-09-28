import * as React from 'react';
import Currency from 'components/Currency';

interface ProductSnippetPriceInterface {
  value?: string | number | null;
  className?: string;
  shopsCount?: number | null;
  size?: 'normal' | 'medium' | 'small';
}

const ProductSnippetPrice: React.FC<ProductSnippetPriceInterface> = ({
  value,
  className,
  shopsCount,
  size = 'normal',
}) => {
  const minimalShopsCount = 1;
  const sizeClassName =
    size === 'medium'
      ? 'text-xl sm:text-2xl'
      : size === 'small'
      ? 'sm:text-xl'
      : 'text-2xl sm:text-3xl';

  if (!shopsCount || shopsCount < minimalShopsCount) {
    return (
      <div className={`text-secondary-text text-sm ${className ? className : ''}`}>
        Нет в наличии
      </div>
    );
  }

  return (
    <div
      className={`flex items-baseline whitespace-nowrap ${sizeClassName} ${
        className ? className : ''
      }`}
    >
      <span className='text-secondary-text text-[0.7em] mr-[0.35rem]'>
        {shopsCount === minimalShopsCount ? 'Цена ' : 'Цена от '}
      </span>
      <Currency value={value} />
    </div>
  );
};

export default ProductSnippetPrice;
