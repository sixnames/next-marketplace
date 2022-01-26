import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../../components/Inner';
import PageGroupsList, {
  PageGroupsListInterface,
} from '../../../../../components/Pages/PageGroupsList';
import { COL_COMPANIES } from '../../../../../db/collectionNames';
import { getDatabase } from '../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../layout/cms/CmsCompanyLayout';
import { getCmsCompanyLinks } from '../../../../../lib/linkUtils';
import { getPageGroupsSsr } from '../../../../../lib/pageUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';

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
  const { root, parentLink, ...links } = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Группы страниц',
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: pageCompany.name,
        href: root,
      },
    ],
  };

  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PageGroupsList
            companySlug={pageCompany.slug}
            basePath={links.pages.parentLink}
            pagesGroups={pagesGroups}
          />
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
