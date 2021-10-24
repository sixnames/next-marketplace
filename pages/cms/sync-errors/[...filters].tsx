import Inner from 'components/Inner';
import SyncErrorsList, { SyncErrorsListInterface } from 'components/SyncErrorsList';
import Title from 'components/Title';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { getPaginatedNotSyncedProducts } from 'db/dao/notSyncedProducts/getPaginatedNotSyncedProducts';
import AppContentWrapper from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Ошибки синхронизации';

const CompanyShopSyncErrorsConsumer: React.FC<SyncErrorsListInterface> = ({
  notSyncedProducts,
  companySlug,
}) => {
  return (
    <AppContentWrapper>
      <Inner testId={'sync-errors-page'}>
        <Title>{pageTitle}</Title>
        <SyncErrorsList notSyncedProducts={notSyncedProducts} companySlug={companySlug} />
      </Inner>
    </AppContentWrapper>
  );
};

interface CompanyShopSyncErrorsInterface extends PagePropsInterface, SyncErrorsListInterface {}

const CompanyShopSyncErrors: NextPage<CompanyShopSyncErrorsInterface> = ({
  pageUrls,
  notSyncedProducts,
  companySlug,
}) => {
  return (
    <CmsLayout pageUrls={pageUrls} title={pageTitle}>
      <CompanyShopSyncErrorsConsumer
        notSyncedProducts={notSyncedProducts}
        companySlug={companySlug}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopSyncErrorsInterface>> => {
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

export default CompanyShopSyncErrors;
