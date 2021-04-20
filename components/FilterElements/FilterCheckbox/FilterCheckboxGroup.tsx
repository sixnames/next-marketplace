import { CatalogueFilterAttributeOptionInterface } from 'db/dbModels';
import * as React from 'react';
import FilterCheckbox from './FilterCheckbox';
import classes from './FilterCheckboxGroup.module.css';

interface FilterCheckboxGroupInterface {
  checkboxItems: CatalogueFilterAttributeOptionInterface[];
  className?: string;
  checkboxClassName?: string;
  label?: string;
  attributeSlug: string;
}

const FilterCheckboxGroup: React.FC<FilterCheckboxGroupInterface> = ({
  label,
  checkboxItems,
  className,
  attributeSlug,
  checkboxClassName,
}) => {
  return (
    <div className={`${classes.frame} ${className ? className : ''}`}>
      {label && <div className={classes.label}>{label}</div>}
      {checkboxItems.map((option) => {
        const key = `${attributeSlug}-${option.slug}`;
        return (
          <FilterCheckbox
            key={key}
            option={option}
            testId={key}
            className={`${classes.item} ${checkboxClassName ? checkboxClassName : ''}`}
          />
        );
      })}
    </div>
  );
};

export default FilterCheckboxGroup;
