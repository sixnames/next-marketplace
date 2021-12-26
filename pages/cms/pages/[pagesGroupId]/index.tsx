import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../components/Inner';
import PagesList, { PagesListInterface } from '../../../../components/Pages/PagesList';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_CMS } from '../../../../config/common';
import { COL_CITIES } from '../../../../db/collectionNames';
import { getDatabase } from '../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, CityInterface } from '../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { sortObjectsByField } from '../../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../../lib/i18n';
import { getPagesListSsr } from '../../../../lib/pageUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';

interface PagesListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ layoutProps, cities, pagesGroup }) => {
  const basePath = `${ROUTE_CMS}/pages`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pagesGroup.name}`,
    config: [
      {
        name: 'Группы страниц',
        href: basePath,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${pagesGroup.name}`} {...layoutProps}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <WpTitle>{pagesGroup.name}</WpTitle>
          <PagesList cities={cities} basePath={basePath} pagesGroup={pagesGroup} />
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
  const { props } = await getAppInitialData({ context });
  if (!props || !pagesGroupId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const citiesCollection = db.collection<CityInterface>(COL_CITIES);

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
      cities: castDbData(sortedCities),
    },
  };
};

export default PagesListPage;
