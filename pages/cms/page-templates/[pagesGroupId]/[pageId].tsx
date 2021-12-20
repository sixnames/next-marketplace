import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../components/Inner';
import PageDetails, { PageDetailsInterface } from '../../../../components/Pages/PageDetails';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_CMS } from '../../../../config/common';
import { AppContentWrapperBreadCrumbs } from '../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { getPageSsr } from '../../../../lib/pageUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';

export interface PageDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    PageDetailsInterface {}

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({ layoutProps, page, cities }) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${page.name}`,
    config: [
      {
        name: 'Группы шаблонов страниц',
        href: `${ROUTE_CMS}/page-templates`,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: `${ROUTE_CMS}/page-templates/${page.pagesGroup?._id}`,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${page.name}`} {...layoutProps}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <WpTitle>{page.name}</WpTitle>
          <PageDetails page={page} cities={cities} isTemplate />
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
  const { props } = await getAppInitialData({ context });
  if (!props || !pageId) {
    return {
      notFound: true,
    };
  }

  const getPageSsrResult = await getPageSsr({
    locale: props.sessionLocale,
    pageId: `${pageId}`,
    isTemplate: true,
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
