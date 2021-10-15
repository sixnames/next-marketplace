import Inner from 'components/Inner';
import PageGroupsList, { PageGroupsListInterface } from 'components/Pages/PageGroupsList';
import Title from 'components/Title';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import AppContentWrapper from 'layout/AppContentWrapper';
import { getPageGroupsSsr } from 'lib/pageUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Группы страниц';

interface PageGroupsPageInterface
  extends PagePropsInterface,
    Omit<PageGroupsListInterface, 'basePath' | 'pageTitle'> {}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({ pageUrls, pagesGroups }) => {
  return (
    <CmsLayout title={pageTitle} pageUrls={pageUrls}>
      <AppContentWrapper>
        <Inner>
          <Title>{pageTitle}</Title>
          <PageGroupsList
            companySlug={DEFAULT_COMPANY_SLUG}
            basePath={`${ROUTE_CMS}/pages`}
            pagesGroups={pagesGroups}
          />
        </Inner>
      </AppContentWrapper>
    </CmsLayout>
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
  });

  return {
    props: {
      ...props,
      pagesGroups: castDbData(pagesGroups),
    },
  };
};

export default PageGroupsPage;
