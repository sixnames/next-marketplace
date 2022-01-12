import { NextPage } from 'next';
import * as React from 'react';
import ShopRubricProducts from '../../../../../../../../../../components/shops/ShopRubricProducts';
import { getCmsCompanyShopProductsListPageSsr } from '../../../../../../../../../../db/dao/ssr/getCmsCompanyShopProductsListPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  ShopRubricProductsInterface,
} from '../../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../../../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface } from '../../../../../../../../../../lib/ssrUtils';

export interface CmsCompanyShopProductsListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopRubricProductsInterface, 'layoutBasePath'> {}

const CmsCompanyShopProductsListPage: NextPage<CmsCompanyShopProductsListPageInterface> = ({
  layoutProps,
  shop,
  rubricName,
  ...props
}) => {
  const links = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: rubricName,
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
      {
        name: 'Товары',
        href: links.shop.rubrics.parentLink,
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
