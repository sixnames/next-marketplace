import React from 'react';
import FilterCheckbox, { FilterCheckboxInterface } from './FilterCheckbox';
import classes from './FilterCheckboxGroup.module.css';

interface FilterCheckboxGroupItem {
  nameString: string;
  id: string;
}

interface FilterCheckboxGroupInterface extends Omit<FilterCheckboxInterface, 'id'> {
  checkboxItems: FilterCheckboxGroupItem[];
  className?: string;
  checkboxClassName?: string;
  label?: string;
}

const FilterCheckboxGroup: React.FC<FilterCheckboxGroupInterface> = ({
  label,
  checkboxItems,
  className,
  queryKey,
  checkboxClassName,
  asPath,
  ...props
}) => {
  return (
    <div className={`${classes.frame} ${className ? className : ''}`}>
      {label && <div className={classes.label}>{label}</div>}
      {checkboxItems.map(({ nameString, id }) => {
        const key = `${queryKey}-${nameString}`;
        return (
          <FilterCheckbox
            name={nameString}
            id={id}
            queryKey={queryKey}
            testId={key}
            key={key}
            asPath={asPath}
            className={`${classes.item} ${checkboxClassName ? checkboxClassName : ''}`}
            {...props}
          />
        );
      })}
    </div>
  );
};

export default FilterCheckboxGroup;
