import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../../components/Inner';
import PageDetails, { PageDetailsInterface } from '../../../../../components/Pages/PageDetails';
import WpTitle from '../../../../../components/WpTitle';
import { ROUTE_CONSOLE } from '../../../../../config/common';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { getPageSsr } from '../../../../../lib/pageUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';

interface PageDetailsPageInterface
  extends GetConsoleInitialDataPropsInterface,
    PageDetailsInterface {
  pageCompany: CompanyInterface;
}

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({
  layoutProps,
  page,
  pageCompany,
  cities,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${page.name}`,
    config: [
      {
        name: 'Группы страниц',
        href: `${ROUTE_CONSOLE}/${pageCompany._id}/pages`,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: `${ROUTE_CONSOLE}/${pageCompany._id}/pages/${page.pagesGroup?._id}`,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${page.name}`} {...layoutProps}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <WpTitle>{page.name}</WpTitle>
          <PageDetails page={page} cities={cities} />
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageDetailsPageInterface>> => {
  const { query } = context;
  const { pageId } = query;
  const { props } = await getConsoleInitialData({ context });
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
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default PageDetailsPage;
