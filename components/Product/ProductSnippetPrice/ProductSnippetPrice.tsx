import * as React from 'react';
import classes from './ProductSnippetPrice.module.css';
import Currency from '../../Currency/Currency';

interface ProductSnippetPriceInterface {
  value?: string | null;
  className?: string;
  isShopless?: boolean;
}

const ProductSnippetPrice: React.FC<ProductSnippetPriceInterface> = ({
  value,
  className,
  isShopless,
}) => {
  if (isShopless) {
    return <div className={`${classes.price} ${className ? className : ''}`}>Нет в наличии</div>;
  }

  return (
    <div className={`${classes.price} ${className ? className : ''}`}>
      от <Currency className={classes.priceValue} value={value} />
    </div>
  );
};

export default ProductSnippetPrice;
