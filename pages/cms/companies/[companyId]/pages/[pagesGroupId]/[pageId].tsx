import Inner from 'components/Inner';
import PageDetails, { PageDetailsInterface } from 'components/Pages/PageDetails';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { getPageSsr } from 'lib/pageUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

export interface PageDetailsPageInterface extends PagePropsInterface, PageDetailsInterface {
  pageCompany: CompanyInterface;
}

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({
  pageUrls,
  pageCompany,
  page,
  cities,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${page.name}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: pageCompany.name,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}`,
      },
      {
        name: 'Группы страниц',
        href: `${ROUTE_CMS}/companies/${pageCompany._id}/pages`,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}/pages/${page.pagesGroup?._id}`,
      },
    ],
  };

  return (
    <CmsLayout title={`${page.name}`} pageUrls={pageUrls}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PageDetails page={page} cities={cities} />
        </Inner>
      </CmsCompanyLayout>
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageDetailsPageInterface>> => {
  const { query } = context;
  const { pageId, companyId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !pageId || !companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: new ObjectId(`${companyId}`),
  });
  if (!company) {
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
      pageCompany: castDbData(company),
    },
  };
};

export default PageDetailsPage;
