import React from 'react';
import FilterCheckbox, { FilterCheckboxItem } from './FilterCheckbox';
import classes from './FilterCheckboxGroup.module.css';

export interface FilterCheckboxGroupItem {
  option: FilterCheckboxItem;
  counter: number;
}

interface FilterCheckboxGroupInterface {
  checkboxItems: FilterCheckboxGroupItem[];
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
      {checkboxItems.map(({ option, counter }) => {
        const key = `${attributeSlug}-${option.nameString}`;
        return (
          <FilterCheckbox
            key={key}
            option={option}
            counter={counter}
            attributeSlug={attributeSlug}
            testId={key}
            className={`${classes.item} ${checkboxClassName ? checkboxClassName : ''}`}
          />
        );
      })}
    </div>
  );
};

export default FilterCheckboxGroup;
