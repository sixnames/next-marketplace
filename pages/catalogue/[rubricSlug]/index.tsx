import Catalogue, { CatalogueInterface } from 'components/Catalogue';
import { ROUTE_CATALOGUE } from 'config/common';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const CataloguePage: NextPage<CatalogueInterface> = (props) => {
  return <Catalogue {...props} />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
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
      destination: `/${props.urlPrefix}${ROUTE_CATALOGUE}/${context.query.rubricSlug}`,
      permanent: true,
    },
  };
  // return getCatalogueServerSideProps(context);
}

export default CataloguePage;
