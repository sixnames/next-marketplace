import Inner from 'components/Inner';
import PageGroupsList, { PageGroupsListInterface } from 'components/Pages/PageGroupsList';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
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
  currentCompany,
}) => {
  return (
    <AppLayout title={pageTitle} pageUrls={pageUrls}>
      <AppContentWrapper>
        <Inner>
          <Title>{pageTitle}</Title>
          <PageGroupsList
            companySlug={`${currentCompany?.slug}`}
            basePath={`${ROUTE_CONSOLE}/${currentCompany?._id}/pages`}
            pagesGroups={pagesGroups}
          />
        </Inner>
      </AppContentWrapper>
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageGroupsPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.currentCompany) {
    return {
      notFound: true,
    };
  }

  const pagesGroups = await getPageGroupsSsr({
    locale: props.sessionLocale,
    companySlug: props.currentCompany.slug,
  });

  return {
    props: {
      ...props,
      pagesGroups: castDbData(pagesGroups),
      currentCompany: props.currentCompany,
    },
  };
};

export default PageGroupsPage;
