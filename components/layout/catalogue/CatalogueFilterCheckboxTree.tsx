import CheckBoxFilter from 'components/CheckBoxFilter';
import { CatalogueFilterInterface } from 'components/layout/catalogue/CatalogueFilter';
import * as React from 'react';

const CatalogueFilterCheckboxTree: React.FC<CatalogueFilterInterface> = (props) => {
  const { hideFilterHandler } = props;

  return <CheckBoxFilter {...props} onClick={hideFilterHandler} />;
};

export default CatalogueFilterCheckboxTree;
