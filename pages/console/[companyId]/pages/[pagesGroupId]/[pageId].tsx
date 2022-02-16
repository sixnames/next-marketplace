import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import PageDetails, { PageDetailsInterface } from 'components/Pages/PageDetails';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { getConsoleCompanyLinks } from 'lib/linkUtils';
import { getPageSsr } from 'lib/pageUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

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
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
    pagesGroupId: page.pagesGroupId,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${page.name}`,
    config: [
      {
        name: 'Группы страниц',
        href: links.pages.parentLink,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: links.pages.root,
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
