import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import { ROUTE_CONSOLE } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getPagesListSsr } from 'lib/pageUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface PagesListPageInterface
  extends PagePropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {
  currentCompany: CompanyInterface;
}

const PagesListPage: NextPage<PagesListPageInterface> = ({
  pageUrls,
  pagesGroup,
  currentCompany,
}) => {
  const basePath = `${ROUTE_CONSOLE}/${currentCompany._id}/pages`;
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
    <AppLayout title={`${pagesGroup.name}`} pageUrls={pageUrls}>
      <PagesList breadcrumbs={breadcrumbs} basePath={basePath} pagesGroup={pagesGroup} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PagesListPageInterface>> => {
  const { query } = context;
  const { pagesGroupId } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.currentCompany || !pagesGroupId) {
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
      currentCompany: props.currentCompany,
    },
  };
};

export default PagesListPage;
