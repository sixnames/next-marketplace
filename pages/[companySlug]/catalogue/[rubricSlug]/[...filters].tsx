import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { ROUTE_CATALOGUE } from '../../../../config/common';
import { alwaysArray } from '../../../../lib/arrayUtils';
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

  const filters = alwaysArray(context.query.filters);
  const filtersPath = filters.join('/');
  return {
    redirect: {
      destination: `${props.urlPrefix}${ROUTE_CATALOGUE}/${context.query.rubricSlug}/${filtersPath}`,
      permanent: true,
    },
  };
}

export default CataloguePage;
