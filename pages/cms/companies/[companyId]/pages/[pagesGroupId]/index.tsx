import Inner from 'components/Inner';
import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { getPagesListSsr } from 'lib/pageUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface PagesListPageInterface
  extends PagePropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {
  currentCompany: CompanyInterface;
}

const PagesListPage: NextPage<PagesListPageInterface> = ({
  pageUrls,
  currentCompany,
  pagesGroup,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pagesGroup?.name}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: currentCompany.name,
        href: `${ROUTE_CMS}/companies/${currentCompany._id}`,
      },
      {
        name: 'Группы страниц',
        href: `${ROUTE_CMS}/companies/${currentCompany._id}/pages`,
      },
    ],
  };

  return (
    <CmsLayout title={`${pagesGroup.name}`} pageUrls={pageUrls}>
      <CmsCompanyLayout company={currentCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PagesList
            basePath={`${ROUTE_CMS}/companies/${currentCompany._id}/pages`}
            pagesGroup={pagesGroup}
          />
        </Inner>
      </CmsCompanyLayout>
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PagesListPageInterface>> => {
  const { query } = context;
  const { pagesGroupId, companyId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !pagesGroupId || !companyId) {
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

  const pagesGroup = await getPagesListSsr({
    locale: props.sessionLocale,
    pagesGroupId: `${pagesGroupId}`,
  });
  if (!pagesGroup) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      pagesGroup: castDbData(pagesGroup),
      currentCompany: castDbData(company),
    },
  };
};

export default PagesListPage;
