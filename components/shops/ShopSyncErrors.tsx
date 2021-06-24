import Inner from 'components/Inner';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import * as React from 'react';

export interface ShopSyncErrorsInterface extends AppShopLayoutInterface {
  notSyncedProducts: NotSyncedProductInterface[];
}

const ShopSyncErrors: React.FC<ShopSyncErrorsInterface> = ({
  shop,
  notSyncedProducts,
  basePath,
}) => {
  console.log(notSyncedProducts);
  return (
    <AppShopLayout shop={shop} basePath={basePath}>
      <Inner testId={'shop-sync-errors-page'}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum dolorum, eaque fuga hic illo
        quod sapiente velit veritatis! Ab adipisci aspernatur deserunt dignissimos dolore earum hic
        incidunt provident quasi quos?
      </Inner>
    </AppShopLayout>
  );
};

export default ShopSyncErrors;
