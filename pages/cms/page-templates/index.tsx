import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import PageGroupsList, { PageGroupsListInterface } from 'components/Pages/PageGroupsList';
import WpTitle from 'components/WpTitle';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getPageGroupsSsr } from 'lib/pageUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const pageTitle = 'Группы шаблонов страниц';

interface PageGroupsPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<PageGroupsListInterface, 'basePath' | 'pageTitle'> {}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({ layoutProps, pagesGroups }) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <WpTitle>{pageTitle}</WpTitle>
          <PageGroupsList companySlug={DEFAULT_COMPANY_SLUG} pagesGroups={pagesGroups} isTemplate />
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageGroupsPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const pagesGroups = await getPageGroupsSsr({
    locale: props.sessionLocale,
    companySlug: DEFAULT_COMPANY_SLUG,
    isTemplate: true,
  });

  return {
    props: {
      ...props,
      pagesGroups: castDbData(pagesGroups),
    },
  };
};

export default PageGroupsPage;
