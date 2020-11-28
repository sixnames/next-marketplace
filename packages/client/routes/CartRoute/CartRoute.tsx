import React from 'react';
import Inner from '../../components/Inner/Inner';
import { useSiteContext } from '../../context/siteContext';
// import classes from './CartRoute.module.css';

const CartRoute: React.FC = () => {
  const { cart } = useSiteContext();

  return (
    <Inner testId={'cart'}>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </Inner>
  );
};

export default CartRoute;
