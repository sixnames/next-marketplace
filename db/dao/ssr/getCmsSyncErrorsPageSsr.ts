import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DEFAULT_COMPANY_SLUG } from '../../../config/common';
import { alwaysArray } from '../../../lib/arrayUtils';
import { castDbData, getAppInitialData } from '../../../lib/ssrUtils';
import { CmsSyncErrorsPageInterface } from '../../../pages/cms/sync-errors/[...filters]';
import { getPaginatedNotSyncedProducts } from '../notSyncedProducts/getPaginatedNotSyncedProducts';

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
