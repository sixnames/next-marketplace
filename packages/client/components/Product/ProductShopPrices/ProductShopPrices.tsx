import React from 'react';
import classes from './ProductShopPrices.module.css';
import Currency from '../../Currency/Currency';
import Percent from '../../Percent/Percent';

interface ProductPricesInterface {
  discountedPercent?: number | null;
  formattedPrice: string;
  formattedOldPrice?: string | null;
}

const ProductShopPrices: React.FC<ProductPricesInterface> = ({
  discountedPercent,
  formattedOldPrice,
  formattedPrice,
}) => {
  return (
    <div className={classes.prices}>
      <div className={`${classes.price} ${discountedPercent ? classes.discountedPrice : ''}`}>
        <Currency className={classes.priceValue} value={formattedPrice} />
      </div>
      {formattedOldPrice ? (
        <div className={classes.oldPrice}>
          <Currency className={classes.oldPriceValue} value={formattedOldPrice} />
        </div>
      ) : null}
      {discountedPercent ? (
        <div className={classes.discount}>
          <Percent isNegative value={discountedPercent} />
        </div>
      ) : null}
    </div>
  );
};

export default ProductShopPrices;
