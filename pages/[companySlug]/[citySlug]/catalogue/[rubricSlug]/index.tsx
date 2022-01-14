import { NextPage } from 'next';
import * as React from 'react';
import Catalogue, { CatalogueInterface } from '../../../../../components/Catalogue';
import { getCatalogueProps } from '../../../../../lib/catalogueUtils';

const CataloguePage: NextPage<CatalogueInterface> = (props) => {
  return <Catalogue {...props} />;
};

export const getServerSideProps = getCatalogueProps;
export default CataloguePage;
