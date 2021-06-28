import Inner from 'components/Inner';
import SyncErrorsList, { SyncErrorsListInterface } from 'components/SyncErrorsList';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import * as React from 'react';

export interface ShopSyncErrorsInterface extends AppShopLayoutInterface, SyncErrorsListInterface {}

const ShopSyncErrors: React.FC<ShopSyncErrorsInterface> = ({
  shop,
  notSyncedProducts,
  basePath,
  breadcrumbs,
  showShopName,
  showControls,
}) => {
  return (
    <AppShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <Inner testId={'shop-sync-errors-page'}>
        <SyncErrorsList
          notSyncedProducts={notSyncedProducts}
          showShopName={showShopName}
          showControls={showControls}
        />
      </Inner>
    </AppShopLayout>
  );
};

export default ShopSyncErrors;
