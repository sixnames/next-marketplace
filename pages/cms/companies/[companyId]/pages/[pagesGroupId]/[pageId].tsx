import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../../../components/Inner';
import PageDetails, { PageDetailsInterface } from '../../../../../../components/Pages/PageDetails';
import { COL_COMPANIES } from '../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../../layout/cms/CmsCompanyLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../../lib/linkUtils';
import { getPageSsr } from '../../../../../../lib/pageUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';

export interface PageDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    PageDetailsInterface {
  pageCompany: CompanyInterface;
}

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({
  layoutProps,
  pageCompany,
  page,
  cities,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    pagesGroupId: page.pagesGroupId,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${page.name}`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: pageCompany.name,
        href: links.root,
      },
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
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PageDetails page={page} cities={cities} />
        </Inner>
      </CmsCompanyLayout>
    </ConsoleLayout>
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
