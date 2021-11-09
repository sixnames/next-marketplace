import Catalogue, { CatalogueInterface } from 'components/Catalogue';
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
      destination: `${props.urlPrefix}${context.query.rubricSlug}`,
      permanent: false,
    },
  };
  // return getCatalogueServerSideProps(context);
}

export default CataloguePage;
