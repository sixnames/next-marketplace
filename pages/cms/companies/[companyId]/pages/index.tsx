import Inner from 'components/Inner';
import PageGroupsList, { PageGroupsListInterface } from 'components/Pages/PageGroupsList';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { getPageGroupsSsr } from 'lib/pageUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Группы страниц';

interface PageGroupsPageInterface
  extends PagePropsInterface,
    Omit<PageGroupsListInterface, 'basePath' | 'pageTitle'> {
  pageCompany: CompanyInterface;
}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({
  pageUrls,
  pagesGroups,
  pageCompany,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Группы страниц',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: pageCompany.name,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}`,
      },
    ],
  };

  return (
    <CmsLayout title={pageTitle} pageUrls={pageUrls}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PageGroupsList
            companySlug={pageCompany.slug}
            basePath={`${ROUTE_CMS}/companies/${pageCompany._id}/pages`}
            pagesGroups={pagesGroups}
          />
        </Inner>
      </CmsCompanyLayout>
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageGroupsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: new ObjectId(`${query.companyId}`),
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

  const pagesGroups = await getPageGroupsSsr({
    locale: props.sessionLocale,
    companySlug: company.slug,
  });

  return {
    props: {
      ...props,
      pagesGroups: castDbData(pagesGroups),
      pageCompany: castDbData(company),
    },
  };
};

export default PageGroupsPage;
