import Catalogue, { CatalogueInterface } from 'components/Catalogue';
import { ROUTE_CATALOGUE } from 'config/common';
import { getCatalogueServerSideProps } from 'lib/catalogueUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const CataloguePage: NextPage<CatalogueInterface> = (props) => {
  return <Catalogue {...props} route={ROUTE_CATALOGUE} />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
  return getCatalogueServerSideProps(context);
}

export default CataloguePage;
