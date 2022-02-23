import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopRubricProducts from 'components/shops/ShopRubricProducts';
import { getCmsCompanyShopProductsListPageSsr } from 'db/ssr/shops/getCmsCompanyShopProductsListPageSsr';
import { AppContentWrapperBreadCrumbs, ShopRubricProductsInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

export interface CmsCompanyShopProductsListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopRubricProductsInterface, 'layoutBasePath'> {}

const CmsCompanyShopProductsListPage: NextPage<CmsCompanyShopProductsListPageInterface> = ({
  layoutProps,
  shop,
  rubricName,
  ...props
}) => {
  const links = getProjectLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: rubricName,
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
      {
        name: 'Товары',
        href: links.cms.companies.companyId.shops.shop.shopId.rubrics.url,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopRubricProducts
        breadcrumbs={breadcrumbs}
        shop={shop}
        rubricName={rubricName}
        {...props}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsCompanyShopProductsListPageSsr;
export default CmsCompanyShopProductsListPage;
