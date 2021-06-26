import CmsOrderDetails from 'components/CmsOrderDetails';
import { OrderInterface } from 'db/uiInterfaces';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import * as React from 'react';

export interface ShopOrderInterface extends AppShopLayoutInterface {
  order: OrderInterface;
}

const ShopOrders: React.FC<ShopOrderInterface> = ({ shop, basePath, breadcrumbs, order }) => {
  return (
    <AppShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <CmsOrderDetails order={order} />
    </AppShopLayout>
  );
};

export default ShopOrders;
