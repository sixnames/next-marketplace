import React from 'react';
import FilterCheckbox, { FilterCheckboxItem } from './FilterCheckbox';
import classes from './FilterCheckboxGroup.module.css';
import { RubricFilterAttributeOption } from '../../../generated/apolloComponents';

export interface FilterCheckboxGroupItem {
  option: FilterCheckboxItem;
  counter: number;
}

interface FilterCheckboxGroupInterface {
  checkboxItems: Partial<RubricFilterAttributeOption>[];
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
