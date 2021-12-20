import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../../components/Inner';
import PagesList, { PagesListInterface } from '../../../../../components/Pages/PagesList';
import WpTitle from '../../../../../components/WpTitle';
import { ROUTE_CONSOLE } from '../../../../../config/common';
import { AppContentWrapperBreadCrumbs } from '../../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { getPagesListSsr } from '../../../../../lib/pageUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';

interface PagesListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ layoutProps, pagesGroup }) => {
  const basePath = `${ROUTE_CONSOLE}/${layoutProps.pageCompany._id}/pages`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pagesGroup.name}`,
    config: [
      {
        name: 'Группы шаблонов страниц',
        href: basePath,
      },
    ],
  };

  return (
    <ConsoleLayout title={`${pagesGroup.name}`} {...layoutProps}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <WpTitle>{pagesGroup.name}</WpTitle>
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

  return {
    props: {
      ...props,
      pagesGroup: castDbData(pagesGroup),
    },
  };
};

export default PagesListPage;
