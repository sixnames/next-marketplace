import { getConsoleShopSsr } from 'db/ssr/shops/getConsoleShopSsr';
import { getPaginatedNotSyncedProducts } from 'db/ssr/shops/getPaginatedNotSyncedProducts';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsCompanyShopSyncErrorsPageInterface } from 'pages/cms/companies/[companyId]/shops/shop/[shopId]/sync-errors/[...filters]';

export const getCmsCompanyShopSyncErrorsPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsCompanyShopSyncErrorsPageInterface>> => {
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shop = await getConsoleShopSsr(`${shopId}`);
  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  const payload = await getPaginatedNotSyncedProducts({
    filters: alwaysArray(query.filters),
    shopId: alwaysString(shopId),
  });

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
      notSyncedProducts: castDbData(payload),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};
