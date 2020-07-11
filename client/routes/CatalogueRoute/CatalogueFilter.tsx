import React from 'react';
import FilterCheckboxGroup from '../../components/FilterElements/FilterCheckbox/FilterCheckboxGroup';
import classes from './CatalogueFilter.module.css';
import { Attribute } from '../../generated/apolloComponents';

interface CatalogueFilterInterface {
  filterAttributes: any[];
}

interface CatalogueFilterAttributeInterface {
  attribute: Attribute;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributeInterface> = ({ attribute }) => {
  const { nameString, filterOptions, slug } = attribute;

  return (
    <div className={classes.attribute}>
      <FilterCheckboxGroup
        checkboxItems={filterOptions}
        attributeSlug={`${slug}`}
        label={nameString}
      />
    </div>
  );
};

const CatalogueFilter: React.FC<CatalogueFilterInterface> = ({ filterAttributes }) => {
  return (
    <div className={classes.filter}>
      {filterAttributes.map((attribute) => {
        return <CatalogueFilterAttribute attribute={attribute} key={attribute.id} />;
      })}
    </div>
  );
};

export default CatalogueFilter;
