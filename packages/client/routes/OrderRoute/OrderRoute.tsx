import React from 'react';
import classes from './OrderRoute.module.css';
import { useSiteContext } from '../../context/siteContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';

const OrderRoute: React.FC = () => {
  const { cart } = useSiteContext();
  const { productsCount } = cart;

  return (
    <div className={classes.cart} data-cy={'order-form'}>
      <Breadcrumbs currentPageName={'Корзина'} config={[]} />

      <Inner lowTop testId={'cart'}>
        <Title className={classes.cartTitle}>
          Корзина
          <span>{`(${productsCount})`}</span>
        </Title>
        <div className={classes.frame}>
          <div data-cy={'order-products'}>lorem</div>

          <div className={classes.aside}>Aside</div>
        </div>
      </Inner>
    </div>
  );
};

export default OrderRoute;
