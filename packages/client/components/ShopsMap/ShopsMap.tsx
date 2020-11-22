import React from 'react';
import classes from './ShopsMap.module.css';
import { ProductCardShopFragment } from '../../generated/apolloComponents';

interface ShopsMapInterface {
  shops: ProductCardShopFragment[];
}

const ShopsMap: React.FC<ShopsMapInterface> = ({ shops }) => {
  console.log(shops);
  return (
    <div className={classes.frame}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi culpa exercitationem
      incidunt ipsam, numquam perspiciatis rerum suscipit veritatis voluptatem voluptates! Culpa
      doloribus exercitationem inventore iure magnam nihil quos saepe, suscipit.
    </div>
  );
};

export default ShopsMap;
