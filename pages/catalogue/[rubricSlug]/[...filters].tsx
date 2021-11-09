import Catalogue, { CatalogueInterface } from 'components/Catalogue';
import { alwaysArray } from 'lib/arrayUtils';
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

  const filters = alwaysArray(context.query.filters);
  const filtersPath = filters.join('/');
  return {
    redirect: {
      destination: `${props.urlPrefix}${context.query.rubricSlug}/${filtersPath}`,
      permanent: false,
    },
  };
  // return getCatalogueServerSideProps(context);
}

export default CataloguePage;
