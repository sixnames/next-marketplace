import { NextPage } from 'next';
import * as React from 'react';
import ShopSyncErrors, {
  ShopSyncErrorsInterface,
} from '../../../../../../../components/shops/ShopSyncErrors';
import { getConsoleShopSyncErrorsListPageSsr } from '../../../../../../../db/dao/ssr/getConsoleShopSyncErrorsListPageSsr';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from '../../../../../../../lib/linkUtils';
import { GetConsoleInitialDataPropsInterface } from '../../../../../../../lib/ssrUtils';

export interface ConsoleShopSyncErrorsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<ShopSyncErrorsInterface, 'basePath'> {}

const ConsoleShopSyncErrorsListPage: NextPage<ConsoleShopSyncErrorsListPageInterface> = ({
  layoutProps,
  shop,
  notSyncedProducts,
  companySlug,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Ошибки синхронизации',
    config: [
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopSyncErrors
        showControls={false}
        showShopName={false}
        notSyncedProducts={notSyncedProducts}
        basePath={links.parentLink}
        breadcrumbs={breadcrumbs}
        shop={shop}
        companySlug={companySlug}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleShopSyncErrorsListPageSsr;
export default ConsoleShopSyncErrorsListPage;
