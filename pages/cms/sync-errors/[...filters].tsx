import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import SyncErrorsList, { SyncErrorsListInterface } from 'components/SyncErrorsList';
import WpTitle from 'components/WpTitle';
import { getCmsSyncErrorsPageSsr } from 'db/ssr/shops/getCmsSyncErrorsPageSsr';
import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

const pageTitle = 'Ошибки синхронизации';

const CompanyShopSyncErrorsConsumer: React.FC<SyncErrorsListInterface> = ({
  notSyncedProducts,
  companySlug,
}) => {
  return (
    <AppContentWrapper>
      <Inner testId={'sync-errors-page'}>
        <WpTitle>{pageTitle}</WpTitle>
        <SyncErrorsList notSyncedProducts={notSyncedProducts} companySlug={companySlug} />
      </Inner>
    </AppContentWrapper>
  );
};

export interface CmsSyncErrorsPageInterface
  extends GetAppInitialDataPropsInterface,
    SyncErrorsListInterface {}

const CmsSyncErrorsPage: NextPage<CmsSyncErrorsPageInterface> = ({
  layoutProps,
  notSyncedProducts,
  companySlug,
}) => {
  return (
    <ConsoleLayout {...layoutProps} title={pageTitle}>
      <CompanyShopSyncErrorsConsumer
        notSyncedProducts={notSyncedProducts}
        companySlug={companySlug}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsSyncErrorsPageSsr;
export default CmsSyncErrorsPage;
