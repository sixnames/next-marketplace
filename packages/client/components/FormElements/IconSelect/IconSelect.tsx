import React, { useEffect, useState } from 'react';
import Select, { SelectInterface } from '../Select/Select';
import { IconOptionFragment, useIconsOptionsQuery } from '../../../generated/apolloComponents';
import Icon from '../../Icon/Icon';
import classes from './IconSelect.module.css';

export type IconSelectInterface = Omit<SelectInterface, 'options' | 'firstOption'>;

const IconSelect: React.FC<IconSelectInterface> = ({ value, ...props }) => {
  const [options, setOptions] = useState<IconOptionFragment[]>([]);
  const { data, loading, error } = useIconsOptionsQuery();

  useEffect(() => {
    if (!loading && !error && data && data.getIconsList) {
      setOptions(data.getIconsList);
    }
  }, [data, loading, error]);

  return (
    <Select
      prefix={<Icon className={classes.icon} name={value || 'cross'} />}
      value={value}
      options={options}
      {...props}
      firstOption={'Не выбрано'}
    />
  );
};

export default IconSelect;
