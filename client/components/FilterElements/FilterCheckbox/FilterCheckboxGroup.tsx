import React from 'react';
import FilterCheckbox from './FilterCheckbox';
import classes from './FilterCheckboxGroup.module.css';

interface FilterCheckboxGroupItem {
  id: string;
  color?: string | null;
  nameString: string;
  slug: string;
}

interface FilterCheckboxGroupInterface {
  checkboxItems: FilterCheckboxGroupItem[];
  className?: string;
  checkboxClassName?: string;
  label?: string;
  queryKey: string;
}

const FilterCheckboxGroup: React.FC<FilterCheckboxGroupInterface> = ({
  label,
  checkboxItems,
  className,
  queryKey,
  checkboxClassName,
}) => {
  return (
    <div className={`${classes.frame} ${className ? className : ''}`}>
      {label && <div className={classes.label}>{label}</div>}
      {checkboxItems.map(({ nameString, slug }) => {
        const key = `${queryKey}-${nameString}`;
        return (
          <FilterCheckbox
            key={key}
            name={nameString}
            slug={slug}
            queryKey={queryKey}
            testId={key}
            className={`${classes.item} ${checkboxClassName ? checkboxClassName : ''}`}
          />
        );
      })}
    </div>
  );
};

export default FilterCheckboxGroup;
