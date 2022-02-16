import { getPaginatedNotSyncedProducts } from 'db/ssr/shops/getPaginatedNotSyncedProducts';
import { alwaysArray } from 'lib/arrayUtils';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsSyncErrorsPageInterface } from 'pages/cms/sync-errors/[...filters]';

export const getCmsSyncErrorsPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsSyncErrorsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getPaginatedNotSyncedProducts({
    filters: alwaysArray(query.filters),
  });

  return {
    props: {
      ...props,
      notSyncedProducts: castDbData(payload),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};
