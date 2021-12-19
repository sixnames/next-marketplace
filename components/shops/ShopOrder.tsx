import * as React from 'react';
import { ConsoleShopLayoutInterface } from '../../db/uiInterfaces';
import ConsoleShopLayout from '../../layout/console/ConsoleShopLayout';
import ConsoleOrderDetails, { CmsOrderDetailsBaseInterface } from '../order/ConsoleOrderDetails';

export interface ShopOrderInterface
  extends ConsoleShopLayoutInterface,
    CmsOrderDetailsBaseInterface {
  pageCompanySlug: string;
  title: string;
}

const ShopOrder: React.FC<ShopOrderInterface> = ({
  shop,
  basePath,
  title,
  breadcrumbs,
  order,
  pageCompanySlug,
  orderStatuses,
}) => {
  return (
    <ConsoleShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <ConsoleOrderDetails
        order={order}
        title={title}
        pageCompanySlug={pageCompanySlug}
        orderStatuses={orderStatuses}
      />
    </ConsoleShopLayout>
  );
};

export default ShopOrder;
