import * as React from 'react';
import FilterRadio, { FilterRadioInterface } from './FilterRadio';
import classes from './FilterRadioGroup.module.css';

interface FilterRadioGroupItem {
  name: string;
  _id: string;
}

interface FilterRadioGroupInterface extends Omit<FilterRadioInterface, '_id'> {
  radioItems: FilterRadioGroupItem[];
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
  ...props
}) => {
  return (
    <div className={`${classes.frame} ${className ? className : ''}`}>
      {label && <div className={classes.label}>{label}</div>}
      {radioItems.map(({ name, _id }) => {
        const key = `${queryKey}-${name}`;
        return (
          <FilterRadio
            name={name}
            _id={_id}
            queryKey={queryKey}
            testId={key}
            key={key}
            className={`${classes.item} ${radioClassName ? radioClassName : ''}`}
            {...props}
          />
        );
      })}
    </div>
  );
};

export default FilterRadioGroup;
