import * as React from 'react';
import Select, { SelectInterface } from '../Select/Select';
import { SelectOptionFragment, useIconsOptionsQuery } from 'generated/apolloComponents';
import Icon from '../../Icon/Icon';
import classes from './IconSelect.module.css';

export type IconSelectInterface = Omit<SelectInterface, 'options' | 'firstOption'>;

const IconSelect: React.FC<IconSelectInterface> = ({ value, ...props }) => {
  const [options, setOptions] = React.useState<SelectOptionFragment[]>([]);
  const { data, loading, error } = useIconsOptionsQuery();

  React.useEffect(() => {
    if (!loading && !error && data && data.getIconsOptions) {
      setOptions(data.getIconsOptions);
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
