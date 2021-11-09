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
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface PagesListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {
  pageCompany: CompanyInterface;
}

const PagesListPage: NextPage<PagesListPageInterface> = ({
  layoutProps,
  pageCompany,
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
        name: pageCompany.name,
        href: `${ROUTE_CMS}/companies/${pageCompany._id}`,
      },
      {
        name: 'Группы страниц',
        href: `${ROUTE_CMS}/companies/${pageCompany._id}/pages`,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${pagesGroup.name}`} {...layoutProps}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PagesList
            basePath={`${ROUTE_CMS}/companies/${pageCompany._id}/pages`}
            pagesGroup={pagesGroup}
          />
        </Inner>
      </CmsCompanyLayout>
    </ConsoleLayout>
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
      pageCompany: castDbData(company),
    },
  };
};

export default PagesListPage;
