import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopSyncErrors, { ShopSyncErrorsInterface } from 'components/shops/ShopSyncErrors';
import { getConsoleShopSyncErrorsListPageSsr } from 'db/ssr/shops/getConsoleShopSyncErrorsListPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetConsoleInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

export interface ConsoleShopSyncErrorsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<ShopSyncErrorsInterface, 'basePath'> {}

const ConsoleShopSyncErrorsListPage: NextPage<ConsoleShopSyncErrorsListPageInterface> = ({
  layoutProps,
  shop,
  notSyncedProducts,
  companySlug,
}) => {
  const links = getProjectLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Ошибки синхронизации',
    config: [
      {
        name: 'Магазины',
        href: links.console.companyId.shops.url,
      },
      {
        name: shop.name,
        href: links.console.companyId.shops.shop.shopId.url,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopSyncErrors
        showControls={false}
        showShopName={false}
        notSyncedProducts={notSyncedProducts}
        breadcrumbs={breadcrumbs}
        shop={shop}
        companySlug={companySlug}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleShopSyncErrorsListPageSsr;
export default ConsoleShopSyncErrorsListPage;
