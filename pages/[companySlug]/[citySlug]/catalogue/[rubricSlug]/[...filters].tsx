import { NextPage } from 'next';
import * as React from 'react';
import Catalogue, { CatalogueInterface } from '../../../../../components/Catalogue';
import { getCatalogueProps } from '../../../../../lib/catalogueUtils';

const CataloguePage: NextPage<CatalogueInterface> = (props) => {
  return <Catalogue {...props} />;
};

/*export async function getStaticPaths(): Promise<GetStaticPathsResult> {
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
}*/

export const getServerSideProps = getCatalogueProps;
export default CataloguePage;
