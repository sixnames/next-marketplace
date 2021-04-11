import * as React from 'react';
import classes from './ProductSnippetPrice.module.css';
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
    return <div className={`${classes.price} ${className ? className : ''}`}>Нет в наличии</div>;
  }

  return (
    <div className={`${classes.price} ${className ? className : ''}`}>
      {shopsCount === minimalShopsCount ? 'Цена ' : 'Цена от '}
      <Currency className={classes.priceValue} value={value} />
    </div>
  );
};

export default ProductSnippetPrice;
