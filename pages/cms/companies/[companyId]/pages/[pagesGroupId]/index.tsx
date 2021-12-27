import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../../../components/Inner';
import PagesList, { PagesListInterface } from '../../../../../../components/Pages/PagesList';
import { COL_CITIES, COL_COMPANIES } from '../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CityInterface,
  CompanyInterface,
} from '../../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../../layout/cms/CmsCompanyLayout';
import { sortObjectsByField } from '../../../../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../../../../lib/i18n';
import { getConsoleCompanyLinks } from '../../../../../../lib/linkUtils';
import { getPagesListSsr } from '../../../../../../lib/pageUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';

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
  const { root, parentLink, pages } = getConsoleCompanyLinks({
    companyId: pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pagesGroup?.name}`,
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: pageCompany.name,
        href: root,
      },
      {
        name: 'Группы страниц',
        href: pages,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${pagesGroup.name}`} {...layoutProps}>
      <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
        <Inner>
          <PagesList cities={cities} basePath={pages} pagesGroup={pagesGroup} />
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
  const citiesCollection = db.collection<CityInterface>(COL_CITIES);
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
