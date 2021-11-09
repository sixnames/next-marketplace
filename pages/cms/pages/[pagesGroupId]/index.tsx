import Inner from 'components/Inner';
import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import { getPagesListSsr } from 'lib/pageUtils';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface PagesListPageInterface
  extends GetAppInitialDataPropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ layoutProps, pagesGroup }) => {
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
          <Title>{pagesGroup.name}</Title>
          <PagesList basePath={basePath} pagesGroup={pagesGroup} />
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
    },
  };
};

export default PagesListPage;
