import Inner from 'components/Inner';
import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
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
    <ConsoleLayout title={`${pagesGroup.name}`} pageUrls={pageUrls} company={currentCompany}>
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
