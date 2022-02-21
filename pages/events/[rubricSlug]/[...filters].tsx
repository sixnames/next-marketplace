import Catalogue, { CatalogueInterface } from 'components/Catalogue';
import { getCatalogueProps } from 'db/utils/catalogueUtils';
import { NextPage } from 'next';
import * as React from 'react';

const CataloguePage: NextPage<CatalogueInterface> = (props) => {
  return <Catalogue {...props} />;
};

export const getServerSideProps = getCatalogueProps;
export default CataloguePage;
