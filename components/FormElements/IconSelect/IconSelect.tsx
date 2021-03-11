import * as React from 'react';
import Select, { SelectInterface } from '../Select/Select';
import { SelectOptionFragment, useIconsOptionsQuery } from 'generated/apolloComponents';
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
    <div className={classes.iconSelectHolder}>
      <Select
        lineIcon={value || 'cross'}
        lineClass={classes.iconSelect}
        value={value}
        options={options}
        {...props}
        firstOption={'Не выбрано'}
      />
    </div>
  );
};

export default IconSelect;
