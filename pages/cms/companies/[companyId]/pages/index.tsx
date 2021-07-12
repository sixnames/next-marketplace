import Inner from 'components/Inner';
import PageGroupsList, { PageGroupsListInterface } from 'components/Pages/PageGroupsList';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import CmsCompanyLayout from 'layout/CmsLayout/CmsCompanyLayout';
import { getPageGroupsSsr } from 'lib/pageUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Группы страниц';

interface PageGroupsPageInterface
  extends PagePropsInterface,
    Omit<PageGroupsListInterface, 'basePath' | 'pageTitle'> {
  currentCompany: CompanyInterface;
}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({
  pageUrls,
  pagesGroups,
  currentCompany,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Группы страниц',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: currentCompany.name,
        href: `${ROUTE_CMS}/companies/${currentCompany._id}`,
      },
    ],
  };

  return (
    <CmsLayout title={pageTitle} pageUrls={pageUrls}>
      <CmsCompanyLayout company={currentCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PageGroupsList
            companySlug={currentCompany.slug}
            basePath={`${ROUTE_CMS}/companies/${currentCompany._id}/pages`}
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
      currentCompany: castDbData(company),
    },
  };
};

export default PageGroupsPage;
