import { ROUTE_DOCS_PAGES } from 'config/common';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';

const CreatedPage: NextPage = () => {
  return <div />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const { query } = context;
  const { pageSlug } = query;
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    redirect: {
      destination: `${props.urlPrefix}${ROUTE_DOCS_PAGES}/${pageSlug}`,
      permanent: true,
    },
  };
}

export default CreatedPage;
