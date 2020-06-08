import React from 'react';
import FilterRadio from './FilterRadio';
import classes from './FilterRadioGroup.module.css';

interface FilterRadioGroupItem {
  nameString: string;
  id: string;
}

interface FilterRadioGroupInterface {
  radioItems: FilterRadioGroupItem[];
  queryKey: string;
  className?: string;
  radioClassName?: string;
  label?: string;
}

const FilterRadioGroup: React.FC<FilterRadioGroupInterface> = ({
  label,
  radioItems,
  className,
  queryKey,
  radioClassName,
}) => {
  return (
    <div className={`${classes.frame} ${className ? className : ''}`}>
      {label && <div className={classes.label}>{label}</div>}
      {radioItems.map(({ nameString, id }) => {
        const key = `${queryKey}-${nameString}`;
        return (
          <FilterRadio
            name={nameString}
            id={id}
            queryKey={queryKey}
            testId={key}
            key={key}
            className={`${classes.item} ${radioClassName ? radioClassName : ''}`}
          />
        );
      })}
    </div>
  );
};

export default FilterRadioGroup;
