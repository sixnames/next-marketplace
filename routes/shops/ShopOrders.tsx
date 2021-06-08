import Inner from 'components/Inner/Inner';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import * as React from 'react';

export type ShopOrdersInterface = AppShopLayoutInterface;

const ShopOrders: React.FC<ShopOrdersInterface> = ({ shop, basePath }) => {
  return (
    <AppShopLayout shop={shop} basePath={basePath}>
      <Inner>
        <div data-cy={'shop-orders-list'}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aspernatur, aut
          commodi cupiditate ea et facere illum itaque magni necessitatibus, quas quidem sapiente
          ullam unde voluptate. Cumque minus numquam quia.
        </div>
      </Inner>
    </AppShopLayout>
  );
};

export default ShopOrders;
