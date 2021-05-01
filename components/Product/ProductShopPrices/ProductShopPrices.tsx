import * as React from 'react';
import classes from './ProductShopPrices.module.css';
import Currency from '../../Currency/Currency';
import Percent from '../../Percent/Percent';

interface ProductPricesInterface {
  discountedPercent?: number | null;
  formattedPrice?: string | number | null;
  formattedOldPrice?: string | null;
  className?: string;
  size?: 'small' | 'normal' | 'big';
}

const ProductShopPrices: React.FC<ProductPricesInterface> = ({
  discountedPercent,
  formattedOldPrice,
  formattedPrice,
  className,
  size = 'normal',
}) => {
  return (
    <div className={`${classes.prices} ${classes[size]} ${className ? className : ''}`}>
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
