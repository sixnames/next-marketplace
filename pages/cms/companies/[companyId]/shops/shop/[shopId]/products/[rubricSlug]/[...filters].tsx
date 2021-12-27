import { NextPage } from 'next';
import * as React from 'react';
import ShopRubricProducts from '../../../../../../../../../components/shops/ShopRubricProducts';
import { getCmsCompanyShopProductsListPageSsr } from '../../../../../../../../../db/dao/ssr/getCmsCompanyShopProductsListPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  ShopRubricProductsInterface,
} from '../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from '../../../../../../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface } from '../../../../../../../../../lib/ssrUtils';

export interface CmsCompanyShopProductsListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopRubricProductsInterface, 'layoutBasePath'> {}

const CmsCompanyShopProductsListPage: NextPage<CmsCompanyShopProductsListPageInterface> = ({
  layoutProps,
  shop,
  rubricName,
  ...props
}) => {
  const { root, parentLink, shops, ...links } = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: rubricName,
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
        href: links.shop.root,
      },
      {
        name: 'Товары',
        href: links.shop.products.root,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopRubricProducts
        breadcrumbs={breadcrumbs}
        layoutBasePath={links.shop.shopBasePath}
        shop={shop}
        rubricName={rubricName}
        {...props}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsCompanyShopProductsListPageSsr;
export default CmsCompanyShopProductsListPage;
