import Inner from 'components/Inner';
import PageDetails, { PageDetailsInterface } from 'components/Pages/PageDetails';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import { getPageSsr } from 'lib/pageUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

export interface PageDetailsPageInterface extends PagePropsInterface, PageDetailsInterface {}

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({ pageUrls, page, cities }) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${page.name}`,
    config: [
      {
        name: 'Группы страниц',
        href: `${ROUTE_CMS}/pages`,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: `${ROUTE_CMS}/pages/${page.pagesGroup?._id}`,
      },
    ],
  };

  return (
    <CmsLayout title={`${page.name}`} pageUrls={pageUrls}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <Title>{page.name}</Title>
          <PageDetails page={page} cities={cities} />
        </Inner>
      </AppContentWrapper>
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageDetailsPageInterface>> => {
  const { query } = context;
  const { pageId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !pageId) {
    return {
      notFound: true,
    };
  }

  const getPageSsrResult = await getPageSsr({
    locale: props.sessionLocale,
    pageId: `${pageId}`,
  });

  if (!getPageSsrResult) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      page: castDbData(getPageSsrResult.page),
      cities: castDbData(getPageSsrResult.cities),
    },
  };
};

export default PageDetailsPage;
