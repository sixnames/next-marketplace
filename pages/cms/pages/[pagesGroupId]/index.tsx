import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import WpTitle from 'components/WpTitle';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getPagesListSsr } from 'lib/pageUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface PagesListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ layoutProps, cities, pagesGroup }) => {
  const links = getProjectLinks();
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pagesGroup.name}`,
    config: [
      {
        name: 'Группы страниц',
        href: links.cms.pages.url,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${pagesGroup.name}`} {...layoutProps}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <WpTitle>{pagesGroup.name}</WpTitle>
          <PagesList cities={cities} pagesGroup={pagesGroup} />
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

  const collections = await getDbCollections();
  const citiesCollection = collections.citiesCollection();

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
