import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopDetails, { ShopDetailsInterface } from 'components/shops/ShopDetails';
import { getConsoleShopSsr } from 'db/ssr/shops/getConsoleShopSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CompanyShopInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopDetailsInterface, 'basePath'> {}

const CompanyShop: NextPage<CompanyShopInterface> = ({ layoutProps, shop }) => {
  const links = getProjectLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: shop.name,
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
    ],
  };

  return (
    <ConsoleLayout {...layoutProps}>
      <ShopDetails shop={shop} breadcrumbs={breadcrumbs} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopInterface>> => {
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shop = await getConsoleShopSsr(`${shopId}`);

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
    },
  };
};

export default CompanyShop;
