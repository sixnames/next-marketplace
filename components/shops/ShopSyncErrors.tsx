import Inner from 'components/Inner';
import SyncErrorsList, { SyncErrorsListInterface } from 'components/SyncErrorsList';
import ConsoleShopLayout, { AppShopLayoutInterface } from 'layout/console/ConsoleShopLayout';
import * as React from 'react';

export interface ShopSyncErrorsInterface extends AppShopLayoutInterface, SyncErrorsListInterface {}

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
