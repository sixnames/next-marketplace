import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../../components/Inner';
import PagesList, { PagesListInterface } from '../../../../../components/Pages/PagesList';
import WpTitle from '../../../../../components/WpTitle';
import { COL_CITIES } from '../../../../../db/collectionNames';
import { getDatabase } from '../../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, CityInterface } from '../../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { sortObjectsByField } from '../../../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../../../lib/i18n';
import { getConsoleCompanyLinks } from '../../../../../lib/linkUtils';
import { getPagesListSsr } from '../../../../../lib/pageUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';

interface PagesListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ layoutProps, pagesGroup, cities }) => {
  const links = getConsoleCompanyLinks({
    companyId: layoutProps.pageCompany._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pagesGroup.name}`,
    config: [
      {
        name: 'Группы страниц',
        href: links.pages.parentLink,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${pagesGroup.name}`} {...layoutProps}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <WpTitle>{pagesGroup.name}</WpTitle>
          <PagesList cities={cities} basePath={links.pages.parentLink} pagesGroup={pagesGroup} />
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PagesListPageInterface>> => {
  const { query } = context;
  const { pagesGroupId } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !pagesGroupId) {
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

  const { db } = await getDatabase();
  const citiesCollection = db.collection<CityInterface>(COL_CITIES);
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
      cities: castDbData(sortedCities),
    },
  };
};

export default PagesListPage;
