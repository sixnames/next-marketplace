import Inner from 'components/Inner';
import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import { getPagesListSsr } from 'lib/pageUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface PagesListPageInterface
  extends PagePropsInterface,
    Omit<PagesListInterface, 'basePath' | 'breadcrumbs'> {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ pageUrls, pagesGroup }) => {
  const basePath = `${ROUTE_CMS}/page-templates`;
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
    <CmsLayout title={`${pagesGroup.name}`} pageUrls={pageUrls}>
      <AppContentWrapper breadcrumbs={breadcrumbs}>
        <Inner>
          <Title>{pagesGroup.name}</Title>
          <PagesList basePath={basePath} pagesGroup={pagesGroup} isTemplate />
        </Inner>
      </AppContentWrapper>
    </CmsLayout>
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
    isTemplate: true,
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
