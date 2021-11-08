import CmsOrderDetails from 'components/order/CmsOrderDetails';
import { OrderInterface } from 'db/uiInterfaces';
import ConsoleShopLayout, { AppShopLayoutInterface } from 'layout/console/ConsoleShopLayout';
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
    <ConsoleShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <CmsOrderDetails order={order} title={title} />
    </ConsoleShopLayout>
  );
};

export default ShopOrders;
