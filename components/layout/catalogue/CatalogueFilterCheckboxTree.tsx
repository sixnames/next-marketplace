import * as React from 'react';
import CheckBoxFilter from 'components/CheckBoxFilter';
import { CatalogueFilterInterface } from 'components/layout/catalogue/CatalogueFilter';

const CatalogueFilterCheckboxTree: React.FC<CatalogueFilterInterface> = (props) => {
  const { hideFilterHandler } = props;

  return <CheckBoxFilter {...props} onClick={hideFilterHandler} />;
};

export default CatalogueFilterCheckboxTree;
