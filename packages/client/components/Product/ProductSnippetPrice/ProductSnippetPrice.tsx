import React from 'react';
import classes from './ProductSnippetPrice.module.css';
import Currency from '../../Currency/Currency';

interface ProductSnippetPriceInterface {
  value?: string | null;
}

const ProductSnippetPrice: React.FC<ProductSnippetPriceInterface> = ({ value }) => {
  return (
    <div className={classes.price}>
      от <Currency className={classes.priceValue} value={value} />
    </div>
  );
};

export default ProductSnippetPrice;
