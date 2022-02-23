import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopSyncErrors, { ShopSyncErrorsInterface } from 'components/shops/ShopSyncErrors';
import { getCmsCompanyShopSyncErrorsPageSsr } from 'db/ssr/shops/getCmsCompanyShopSyncErrorsPageSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

export interface CmsCompanyShopSyncErrorsPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopSyncErrorsInterface, 'basePath'> {}

const CmsCompanyShopSyncErrorsPage: NextPage<CmsCompanyShopSyncErrorsPageInterface> = ({
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
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${shop.company?.name}`,
        href: links.cms.companies.companyId.url,
      },
      {
        name: 'Магазины',
        href: links.cms.companies.companyId.shops.url,
      },
      {
        name: shop.name,
        href: links.cms.companies.companyId.shops.shop.shopId.url,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopSyncErrors
        companySlug={companySlug}
        breadcrumbs={breadcrumbs}
        notSyncedProducts={notSyncedProducts}
        showShopName={false}
        shop={shop}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsCompanyShopSyncErrorsPageSsr;
export default CmsCompanyShopSyncErrorsPage;
