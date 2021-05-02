import Catalogue, { CatalogueInterface } from 'components/Catalogue/Catalogue';
import { getCatalogueServerSideProps } from 'lib/catalogueUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const CataloguePage: NextPage<CatalogueInterface> = (props) => {
  return <Catalogue {...props} />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
  return getCatalogueServerSideProps(context);
}

export default CataloguePage;
