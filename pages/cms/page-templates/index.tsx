import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../components/Inner';
import PageGroupsList, { PageGroupsListInterface } from '../../../components/Pages/PageGroupsList';
import WpTitle from '../../../components/WpTitle';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from '../../../config/common';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import { getPageGroupsSsr } from '../../../lib/pageUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../lib/ssrUtils';

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
          <PageGroupsList
            companySlug={DEFAULT_COMPANY_SLUG}
            basePath={`${ROUTE_CMS}/page-templates`}
            pagesGroups={pagesGroups}
            isTemplate
          />
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
