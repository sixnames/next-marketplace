import { ConsoleShopLayoutInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Inner from '../Inner';
import ConsoleShopLayout from '../layout/console/ConsoleShopLayout';
import SyncErrorsList, { SyncErrorsListInterface } from '../SyncErrorsList';

export interface ShopSyncErrorsInterface
  extends ConsoleShopLayoutInterface,
    SyncErrorsListInterface {}

const ShopSyncErrors: React.FC<ShopSyncErrorsInterface> = ({
  shop,
  notSyncedProducts,
  breadcrumbs,
  showShopName,
  showControls,
  companySlug,
}) => {
  return (
    <ConsoleShopLayout shop={shop} breadcrumbs={breadcrumbs}>
      <Inner testId={'shop-sync-errors-page'}>
        <SyncErrorsList
          companySlug={companySlug}
          notSyncedProducts={notSyncedProducts}
          showShopName={showShopName}
          showControls={showControls}
        />
      </Inner>
    </ConsoleShopLayout>
  );
};

export default ShopSyncErrors;
