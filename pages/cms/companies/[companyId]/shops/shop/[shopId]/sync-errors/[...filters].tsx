import { NextPage } from 'next';
import * as React from 'react';
import ShopSyncErrors, {
  ShopSyncErrorsInterface,
} from '../../../../../../../../components/shops/ShopSyncErrors';
import { getCmsCompanyShopSyncErrorsPageSsr } from '../../../../../../../../db/dao/ssr/getCmsCompanyShopSyncErrorsPageSsr';
import { AppContentWrapperBreadCrumbs } from '../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface } from '../../../../../../../../lib/ssrUtils';

export interface CmsCompanyShopSyncErrorsPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopSyncErrorsInterface, 'basePath'> {}

const CmsCompanyShopSyncErrorsPage: NextPage<CmsCompanyShopSyncErrorsPageInterface> = ({
  layoutProps,
  shop,
  notSyncedProducts,
  companySlug,
}) => {
  const links = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Ошибки синхронизации',
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${shop.company?.name}`,
        href: links.root,
      },
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
        companySlug={companySlug}
        breadcrumbs={breadcrumbs}
        notSyncedProducts={notSyncedProducts}
        showShopName={false}
        basePath={links.root}
        shop={shop}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsCompanyShopSyncErrorsPageSsr;
export default CmsCompanyShopSyncErrorsPage;
