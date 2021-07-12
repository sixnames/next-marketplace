import CmsOrderDetails from 'components/CmsOrderDetails';
import { OrderInterface } from 'db/uiInterfaces';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import * as React from 'react';

export interface ShopOrderInterface extends AppShopLayoutInterface {
  order: OrderInterface;
  title: string;
}

const ShopOrders: React.FC<ShopOrderInterface> = ({
  shop,
  basePath,
  title,
  breadcrumbs,
  order,
}) => {
  return (
    <AppShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <CmsOrderDetails order={order} title={title} />
    </AppShopLayout>
  );
};

export default ShopOrders;
