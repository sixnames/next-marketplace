import Inner from 'components/Inner';
import PageGroupsList, { PageGroupsListInterface } from 'components/Pages/PageGroupsList';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getPageGroupsSsr } from 'lib/pageUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

const pageTitle = 'Группы страниц';

interface PageGroupsPageInterface
  extends PagePropsInterface,
    Omit<PageGroupsListInterface, 'basePath' | 'pageTitle'> {}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({
  pageUrls,
  pagesGroups,
  pageCompany,
}) => {
  return (
    <ConsoleLayout title={pageTitle} pageUrls={pageUrls} company={pageCompany}>
      <AppContentWrapper>
        <Inner>
          <Title>{pageTitle}</Title>
          <PageGroupsList
            companySlug={`${pageCompany?.slug}`}
            basePath={`${ROUTE_CONSOLE}/${pageCompany?._id}/pages`}
            pagesGroups={pagesGroups}
          />
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageGroupsPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.pageCompany) {
    return {
      notFound: true,
    };
  }

  const pagesGroups = await getPageGroupsSsr({
    locale: props.sessionLocale,
    companySlug: props.pageCompany.slug,
  });

  return {
    props: {
      ...props,
      pagesGroups: castDbData(pagesGroups),
      pageCompany: props.pageCompany,
    },
  };
};

export default PageGroupsPage;
