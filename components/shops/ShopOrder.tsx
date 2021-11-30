import ConsoleOrderDetails from 'components/order/ConsoleOrderDetails';
import { OrderInterface } from 'db/uiInterfaces';
import ConsoleShopLayout, { AppShopLayoutInterface } from 'layout/console/ConsoleShopLayout';
import * as React from 'react';

export interface ShopOrderInterface extends AppShopLayoutInterface {
  order: OrderInterface;
  pageCompanySlug: string;
  title: string;
}

const ShopOrders: React.FC<ShopOrderInterface> = ({
  shop,
  basePath,
  title,
  breadcrumbs,
  order,
  pageCompanySlug,
}) => {
  return (
    <ConsoleShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <ConsoleOrderDetails order={order} title={title} pageCompanySlug={pageCompanySlug} />
    </ConsoleShopLayout>
  );
};

export default ShopOrders;
