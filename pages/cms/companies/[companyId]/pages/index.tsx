import Inner from 'components/Inner';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import PageGroupsList, { PageGroupsListInterface } from 'components/Pages/PageGroupsList';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { getPageGroupsSsr } from 'lib/pageUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const pageTitle = 'Группы страниц';

interface PageGroupsPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<PageGroupsListInterface, 'basePath' | 'pageTitle'> {
  pageCompany: CompanyInterface;
}

const PageGroupsPage: NextPage<PageGroupsPageInterface> = ({
  layoutProps,
  pagesGroups,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Группы страниц',
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: pageCompany.name,
        href: links.cms.companies.companyId.url,
      },
    ],
  };

  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PageGroupsList companySlug={pageCompany.slug} pagesGroups={pagesGroups} />
        </Inner>
      </CmsCompanyLayout>
    </ConsoleLayout>
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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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
