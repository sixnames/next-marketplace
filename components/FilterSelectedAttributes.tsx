import { CatalogueFilterAttributeInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface FilterSelectedAttributesInterface {
  selectedAttributes?: CatalogueFilterAttributeInterface[] | null;
}

const FilterSelectedAttributes: React.FC<FilterSelectedAttributesInterface> = ({
  selectedAttributes,
}) => {
  if (!selectedAttributes || selectedAttributes.length < 1) {
    return null;
  }

  return <div>{selectedAttributes.length}</div>;
};

export default FilterSelectedAttributes;
