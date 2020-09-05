import React from 'react';
import FilterCheckboxGroup from '../../components/FilterElements/FilterCheckbox/FilterCheckboxGroup';
import classes from './CatalogueFilter.module.css';
import {
  Attribute,
  RubricFilterAttribute,
  RubricFilterAttributeOption,
} from '../../generated/apolloComponents';

type FilterAttribute = { __typename?: 'RubricFilterAttribute' } & Pick<
  RubricFilterAttribute,
  'id'
> & {
    node: { __typename?: 'Attribute' } & Pick<Attribute, 'id' | 'nameString' | 'slug'>;
    options: Array<
      { __typename?: 'RubricFilterAttributeOption' } & Pick<
        RubricFilterAttributeOption,
        'id' | 'slug' | 'nameString' | 'color' | 'counter'
      >
    >;
  };

interface CatalogueFilterInterface {
  filterAttributes: FilterAttribute[];
}

interface CatalogueFilterAttributeInterface {
  attribute: FilterAttribute;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributeInterface> = ({ attribute }) => {
  const {
    node: { slug, nameString },
    options,
  } = attribute;

  return (
    <div className={classes.attribute}>
      <FilterCheckboxGroup checkboxItems={options} attributeSlug={`${slug}`} label={nameString} />
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
