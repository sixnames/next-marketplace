import Inner from 'components/Inner';
import PageDetails, { PageDetailsInterface } from 'components/Pages/PageDetails';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getPageSsr } from 'lib/pageUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface PageDetailsPageInterface extends PagePropsInterface, PageDetailsInterface {
  currentCompany: CompanyInterface;
}

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({
  pageUrls,
  page,
  currentCompany,
  cities,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${page.name}`,
    config: [
      {
        name: 'Группы страниц',
        href: `${ROUTE_CONSOLE}/${currentCompany._id}/pages`,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: `${ROUTE_CONSOLE}/${currentCompany._id}/pages/${page.pagesGroup?._id}`,
      },
    ],
  };

  return (
    <AppLayout title={`${page.name}`} pageUrls={pageUrls}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <Title>{page.name}</Title>
          <PageDetails page={page} cities={cities} />
        </Inner>
      </AppContentWrapper>
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageDetailsPageInterface>> => {
  const { query } = context;
  const { pageId } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !pageId || !props.currentCompany) {
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
      currentCompany: props.currentCompany,
    },
  };
};

export default PageDetailsPage;
