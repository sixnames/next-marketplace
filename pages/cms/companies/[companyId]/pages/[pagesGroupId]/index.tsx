import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import { ROUTE_CMS } from 'config/common';
import { getPagesListSsr } from 'lib/pageUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface PagesListPageInterface extends PagePropsInterface, Omit<PagesListInterface, 'basePath'> {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ pageUrls, pagesGroup }) => {
  return (
    <CmsLayout title={`${pagesGroup.name}`} pageUrls={pageUrls}>
      <PagesList basePath={`${ROUTE_CMS}/pages`} pagesGroup={pagesGroup} />
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
