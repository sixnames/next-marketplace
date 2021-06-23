import * as React from 'react';
import FilterRadio, { FilterRadioInterface } from 'components/FilterRadio';

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
    <div className={`mb-5 ${className ? className : ''}`}>
      {label ? <div className='mb-3 font-medium text-secondary-text truncate'>{label}</div> : null}
      {radioItems.map(({ name, _id }) => {
        const key = `${queryKey}-${name}`;
        return (
          <FilterRadio
            name={name}
            _id={_id}
            queryKey={queryKey}
            testId={key}
            key={key}
            className={radioClassName}
            {...props}
          />
        );
      })}
    </div>
  );
};

export default FilterRadioGroup;
