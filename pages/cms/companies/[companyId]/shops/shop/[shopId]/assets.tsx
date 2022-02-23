import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ShopAssets, { ShopAssetsInterface } from 'components/shops/ShopAssets';
import { getConsoleShopSsr } from 'db/ssr/shops/getConsoleShopSsr';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface CompanyShopAssetsInterface
  extends GetAppInitialDataPropsInterface,
    Omit<ShopAssetsInterface, 'basePath'> {}

const CompanyShopAssets: NextPage<CompanyShopAssetsInterface> = ({ layoutProps, shop }) => {
  const links = getProjectLinks({
    companyId: shop.companyId,
    shopId: shop._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Изображения',
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
      <ShopAssets shop={shop} breadcrumbs={breadcrumbs} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopAssetsInterface>> => {
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

export default CompanyShopAssets;
