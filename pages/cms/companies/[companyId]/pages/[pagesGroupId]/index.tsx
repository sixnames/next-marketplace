import Inner from 'components/Inner';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';

import { getPagesListSsr } from 'lib/pageUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface PagesListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {
  pageCompany: CompanyInterface;
}

const PagesListPage: NextPage<PagesListPageInterface> = ({
  layoutProps,
  pageCompany,
  pagesGroup,
  cities,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pagesGroup?.name}`,
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
    ],
  };

  return (
    <ConsoleLayout title={`${pagesGroup.name}`} {...layoutProps}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PagesList cities={cities} basePath={links.pages.parentLink} pagesGroup={pagesGroup} />
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

  const collections = await getDbCollections();
  const citiesCollection = collections.citiesCollection();
  const companiesCollection = collections.companiesCollection();

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

  const initialCities = await citiesCollection.find({}).toArray();
  const castedCities = initialCities.map((document) => {
    return {
      ...document,
      name: getFieldStringLocale(document.nameI18n, props.sessionLocale),
    };
  });
  const sortedCities = sortObjectsByField(castedCities);

  return {
    props: {
      ...props,
      pagesGroup: castDbData(pagesGroup),
      pageCompany: castDbData(company),
      cities: castDbData(sortedCities),
    },
  };
};

export default PagesListPage;
