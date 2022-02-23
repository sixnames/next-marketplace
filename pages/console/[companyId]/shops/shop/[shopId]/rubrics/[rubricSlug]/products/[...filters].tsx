import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopRubricProducts from 'components/shops/ShopRubricProducts';
import { getConsoleShopProductsListPageSsr } from 'db/ssr/shops/getConsoleShopProductsListPageSsr';
import { AppContentWrapperBreadCrumbs, ShopRubricProductsInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetConsoleInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

export interface ConsoleShopProductsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<ShopRubricProductsInterface, 'layoutBasePath'> {}

const ConsoleShopProductsListPage: NextPage<ConsoleShopProductsListPageInterface> = ({
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
        name: 'Магазины',
        href: links.console.companyId.shops.url,
      },
      {
        name: shop.name,
        href: links.console.companyId.shops.shop.shopId.url,
      },
      {
        name: 'Товары',
        href: links.console.companyId.shops.shop.shopId.rubrics.url,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopRubricProducts
        rubricName={rubricName}
        breadcrumbs={breadcrumbs}
        shop={shop}
        {...props}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleShopProductsListPageSsr;
export default ConsoleShopProductsListPage;
