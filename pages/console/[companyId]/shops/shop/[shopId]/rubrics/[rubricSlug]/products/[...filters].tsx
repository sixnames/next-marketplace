import { NextPage } from 'next';
import * as React from 'react';
import ShopRubricProducts from '../../../../../../../../../components/shops/ShopRubricProducts';
import { getConsoleShopProductsListPageSsr } from '../../../../../../../../../db/dao/ssr/getConsoleShopProductsListPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  ShopRubricProductsInterface,
} from '../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from '../../../../../../../../../lib/linkUtils';
import { GetConsoleInitialDataPropsInterface } from '../../../../../../../../../lib/ssrUtils';

export interface ConsoleShopProductsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<ShopRubricProductsInterface, 'layoutBasePath'> {}

const ConsoleShopProductsListPage: NextPage<ConsoleShopProductsListPageInterface> = ({
  layoutProps,
  shop,
  rubricName,
  ...props
}) => {
  const links = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: rubricName,
    config: [
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
      {
        name: 'Товары',
        href: links.shop.rubrics.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopRubricProducts
        rubricName={rubricName}
        breadcrumbs={breadcrumbs}
        layoutBasePath={links.parentLink}
        shop={shop}
        {...props}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleShopProductsListPageSsr;
export default ConsoleShopProductsListPage;
