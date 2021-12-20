import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from 'next';
import * as React from 'react';
import Catalogue, { CatalogueInterface } from '../../../../../components/Catalogue';
import { getCatalogueIsrProps } from '../../../../../lib/catalogueIsrUtils';
import { IsrContextInterface } from '../../../../../lib/isrUtils';

const CataloguePage: NextPage<CatalogueInterface> = (props) => {
  return <Catalogue {...props} />;
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths: any[] = [];
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(
  context: IsrContextInterface,
): Promise<GetStaticPropsResult<CatalogueInterface>> {
  return getCatalogueIsrProps(context);
}

export default CataloguePage;
