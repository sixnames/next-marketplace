import Inner from 'components/Inner';
import SyncErrorsList, { SyncErrorsListInterface } from 'components/SyncErrorsList';
import { ConsoleShopLayoutInterface } from 'db/uiInterfaces';
import ConsoleShopLayout from 'layout/console/ConsoleShopLayout';
import * as React from 'react';

export interface ShopSyncErrorsInterface
  extends ConsoleShopLayoutInterface,
    SyncErrorsListInterface {}

const ShopSyncErrors: React.FC<ShopSyncErrorsInterface> = ({
  shop,
  notSyncedProducts,
  basePath,
  breadcrumbs,
  showShopName,
  showControls,
  companySlug,
}) => {
  return (
    <ConsoleShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
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
