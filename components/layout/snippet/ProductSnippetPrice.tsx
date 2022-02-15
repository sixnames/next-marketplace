import * as React from 'react';
import Currency from 'components/Currency';

interface ProductSnippetPriceInterface {
  value?: string | number | null;
  shopsCount?: number | null;
  size?: 'normal' | 'medium' | 'small';
  className?: string;
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
      <div className={`text-sm text-secondary-text ${className ? className : ''}`}>
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
      <span className='mr-[0.35rem] text-[0.7em] text-secondary-text'>
        {shopsCount === minimalShopsCount ? 'Цена ' : 'Цена от '}
      </span>
      <Currency value={value} />
    </div>
  );
};

export default ProductSnippetPrice;
