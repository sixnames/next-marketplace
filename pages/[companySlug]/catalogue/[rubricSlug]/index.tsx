import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { ROUTE_CATALOGUE } from '../../../../config/common';
import { getSiteInitialData } from '../../../../lib/ssrUtils';

const CataloguePage: NextPage = () => {
  return <div />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: `${props.urlPrefix}${ROUTE_CATALOGUE}/${context.query.rubricSlug}`,
      permanent: true,
    },
  };
}

export default CataloguePage;
