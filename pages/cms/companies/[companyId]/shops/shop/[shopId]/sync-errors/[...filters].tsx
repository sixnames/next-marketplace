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
  const { root, parentLink, shops, ...links } = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Ошибки синхронизации',
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: `${shop.company?.name}`,
        href: root,
      },
      {
        name: 'Магазины',
        href: shops,
      },
      {
        name: shop.name,
        href: `${links.shop}/${shop._id}`,
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
        basePath={links.shop.shopBasePath}
        shop={shop}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsCompanyShopSyncErrorsPageSsr;
export default CmsCompanyShopSyncErrorsPage;
